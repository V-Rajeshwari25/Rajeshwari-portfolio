document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     LOADER
  ========================================== */

  const loader = document.getElementById("loader");
  const loaderPercent = document.getElementById("loaderPercent");
  const loaderBar = document.getElementById("loaderBar");
  const loaderStatus = document.getElementById("loaderStatus");

  document.body.classList.add("loading");

  let progress = 0;

  const statuses = [
    "INITIALIZING",
    "LOADING ASSETS",
    "BUILDING EXPERIENCE",
    "ALMOST READY",
    "WELCOME"
  ];

  if (loader && loaderPercent && loaderBar && loaderStatus) {

    const loaderInterval = setInterval(() => {

      progress += Math.floor(Math.random() * 4) + 1;

      if (progress > 100) {
        progress = 100;
      }

      loaderPercent.textContent = progress;
      loaderBar.style.width = `${progress}%`;

      const statusIndex = Math.min(
        Math.floor(progress / 20),
        statuses.length - 1
      );

      loaderStatus.textContent = statuses[statusIndex];

      if (progress >= 100) {

        clearInterval(loaderInterval);

        setTimeout(() => {

          loader.classList.add("hide");
          document.body.classList.remove("loading");

        }, 650);

      }

    }, 45);

  } else {

    document.body.classList.remove("loading");

  }


  /* =========================================
     MOBILE MENU
  ========================================== */

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

      navLinks.classList.toggle("mobile-open");
      menuToggle.classList.toggle("active");

    });

  }


  /* =========================================
     CLOSE MOBILE MENU AFTER CLICK
  ========================================== */

  document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

      if (navLinks) {
        navLinks.classList.remove("mobile-open");
      }

      if (menuToggle) {
        menuToggle.classList.remove("active");
      }

    });

  });


  /* =========================================
     SMOOTH SCROLL
  ========================================== */

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  /* =========================================
     REVEAL ANIMATIONS
  ========================================== */

  const revealElements =
    document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add("visible");

              revealObserver.unobserve(entry.target);

            }

          });

        },
        {
          threshold: 0.12
        }
      );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach(element => {
      element.classList.add("visible");
    });

  }


  /* =========================================
     ACTIVE NAVIGATION
  ========================================== */

  const sections =
    document.querySelectorAll("section[id]");

  const navigationLinks =
    document.querySelectorAll(".nav-links a");

  function updateActiveNav() {

    let currentSection = "";

    sections.forEach(section => {

      const sectionTop =
        section.offsetTop - 180;

      const sectionHeight =
        section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {

        currentSection =
          section.getAttribute("id");

      }

    });

    navigationLinks.forEach(link => {

      link.classList.remove("active");

      if (
        link.getAttribute("href") ===
        `#${currentSection}`
      ) {

        link.classList.add("active");

      }

    });

  }

  updateActiveNav();

  window.addEventListener(
    "scroll",
    updateActiveNav,
    { passive: true }
  );


  /* =========================================
     SCROLL PROGRESS
  ========================================== */

  const progressBar =
    document.querySelector(".scroll-progress");

  function updateScrollProgress() {

    if (!progressBar) {
      return;
    }

    const scrollTop = window.scrollY;

    const pageHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const percentage =
      pageHeight > 0
        ? (scrollTop / pageHeight) * 100
        : 0;

    progressBar.style.width =
      `${percentage}%`;

  }

  updateScrollProgress();

  window.addEventListener(
    "scroll",
    updateScrollProgress,
    { passive: true }
  );


  /* =========================================
     CURSOR GLOW
  ========================================== */

  const cursorGlow =
    document.querySelector(".cursor-glow");

  if (
    cursorGlow &&
    window.matchMedia("(pointer:fine)").matches
  ) {

    window.addEventListener("mousemove", event => {

      cursorGlow.style.left =
        `${event.clientX}px`;

      cursorGlow.style.top =
        `${event.clientY}px`;

      cursorGlow.style.opacity = "1";

    });

  }


  /* =========================================
     HERO TYPEWRITER
  ========================================== */

  const typewriterText =
    document.getElementById("typewriterText");

  if (typewriterText) {

    const words = [
      "FULL STACK WEB DEVELOPER",
      "WEB APPLICATION DEVELOPER",
      "FREELANCE DEVELOPER"
    ];

    let wordIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    function typeWriter() {

      const currentWord =
        words[wordIndex];

      if (!deleting) {

        characterIndex++;

        typewriterText.textContent =
          currentWord.substring(
            0,
            characterIndex
          );

        if (
          characterIndex >=
          currentWord.length
        ) {

          deleting = true;

          setTimeout(typeWriter, 1700);

          return;

        }

      } else {

        characterIndex--;

        typewriterText.textContent =
          currentWord.substring(
            0,
            characterIndex
          );

        if (characterIndex <= 0) {

          deleting = false;

          wordIndex =
            (wordIndex + 1) %
            words.length;

        }

      }

      const speed =
        deleting ? 55 : 90;

      setTimeout(typeWriter, speed);

    }

    typeWriter();

  }


  /* =========================================
     PROJECT AUTO CAROUSEL
  ========================================== */

  const projectCards =
    Array.from(
      document.querySelectorAll(".project-card")
    );

  if (projectCards.length > 0) {

    let currentProject = 0;
    let projectTimer = null;

    /*
      Position system:

      0 = CENTER
      1 = RIGHT
      2 = HIDDEN
      3 = LEFT

      This creates:

      LEFT → CENTER → RIGHT → OUT
    */

    function updateProjectPositions(
      animate = true
    ) {

      projectCards.forEach((card, index) => {

        const relative =
          (index - currentProject +
          projectCards.length) %
          projectCards.length;

        card.classList.remove(
          "project-left",
          "project-center",
          "project-right",
          "project-hidden"
        );

        if (!animate) {
          card.style.transition = "none";
        } else {
          card.style.transition = "";
        }

        if (relative === 0) {

          card.classList.add(
            "project-center"
          );

        } else if (relative === 1) {

          card.classList.add(
            "project-right"
          );

        } else if (
          relative ===
          projectCards.length - 1
        ) {

          card.classList.add(
            "project-left"
          );

        } else {

          card.classList.add(
            "project-hidden"
          );

        }

      });

      if (!animate) {

        requestAnimationFrame(() => {

          projectCards.forEach(card => {
            card.style.transition = "";
          });

        });

      }

    }


    updateProjectPositions(false);


    function nextProject() {

      currentProject =
        (currentProject + 1) %
        projectCards.length;

      updateProjectPositions(true);

    }


    function startProjectCarousel() {

      if (projectCards.length < 2) {
        return;
      }

      if (projectTimer) {
        clearInterval(projectTimer);
      }

      projectTimer =
        setInterval(
          nextProject,
          3800
        );

    }


    function stopProjectCarousel() {

      if (projectTimer) {

        clearInterval(projectTimer);
        projectTimer = null;

      }

    }


    const projectsWindow =
      document.querySelector(
        ".projects-window"
      );

    if (projectsWindow) {

      projectsWindow.addEventListener(
        "mouseenter",
        stopProjectCarousel
      );

      projectsWindow.addEventListener(
        "mouseleave",
        startProjectCarousel
      );

      projectsWindow.addEventListener(
        "touchstart",
        stopProjectCarousel,
        { passive: true }
      );

      projectsWindow.addEventListener(
        "touchend",
        startProjectCarousel,
        { passive: true }
      );

    }

    startProjectCarousel();

  }


  /* =========================================
     PROJECT CARD TILT
     Only works when not using carousel
     transform animation manually.
  ========================================== */

  const finePointer =
    window.matchMedia("(pointer:fine)").matches;

  if (
    finePointer &&
    projectCards.length === 0
  ) {

    document
      .querySelectorAll(".project-card")
      .forEach(card => {

        card.addEventListener(
          "mousemove",
          event => {

            const rect =
              card.getBoundingClientRect();

            const x =
              event.clientX - rect.left;

            const y =
              event.clientY - rect.top;

            const rotateY =
              ((x / rect.width) - 0.5) * 4;

            const rotateX =
              ((y / rect.height) - 0.5) * -4;

            card.style.transform =
              `perspective(900px)
               rotateX(${rotateX}deg)
               rotateY(${rotateY}deg)
               translateY(-4px)`;

          }
        );

        card.addEventListener(
          "mouseleave",
          () => {

            card.style.transform =
              "perspective(900px) rotateX(0) rotateY(0) translateY(0)";

          }
        );

      });

  }


  /* =========================================
     PROJECT CARD KEYBOARD ACCESS
  ========================================== */

  document
    .querySelectorAll(".project-card")
    .forEach(card => {

      if (
        card.tagName.toLowerCase() !== "a"
      ) {

        card.addEventListener(
          "keydown",
          event => {

            if (
              event.key === "Enter" ||
              event.key === " "
            ) {

              event.preventDefault();

              card.click();

            }

          }
        );

      }

    });


  /* =========================================
     CONTACT FORM
     SEND DIRECTLY TO WHATSAPP
  ========================================== */

  const contactForm =
    document.getElementById(
      "contactForm"
    );

  const formMessage =
    document.getElementById(
      "formMessage"
    );

  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        /* -----------------------------
           GET FORM VALUES
        ----------------------------- */

        const nameElement =
          document.getElementById("name");

        const emailElement =
          document.getElementById("email");

        const subjectElement =
          document.getElementById("subject");

        const projectTypeElement =
          document.getElementById(
            "projectType"
          );

        const budgetElement =
          document.getElementById(
            "budget"
          );

        const messageElement =
          document.getElementById("message");

        const consentElement =
          document.getElementById(
            "consent"
          );


        const name =
          nameElement
            ? nameElement.value.trim()
            : "";

        const email =
          emailElement
            ? emailElement.value.trim()
            : "";

        const subject =
          subjectElement
            ? subjectElement.value.trim()
            : "";

        const projectType =
          projectTypeElement
            ? projectTypeElement.value.trim()
            : "";

        const budget =
          budgetElement
            ? budgetElement.value.trim()
            : "";

        const message =
          messageElement
            ? messageElement.value.trim()
            : "";

        const consent =
          consentElement
            ? consentElement.checked
            : false;


        /* -----------------------------
           VALIDATION
        ----------------------------- */

        if (
          !name ||
          !email ||
          !subject ||
          !message
        ) {

          showFormMessage(
            "Please fill all required fields.",
            "error"
          );

          return;

        }


        if (
          projectTypeElement &&
          !projectType
        ) {

          showFormMessage(
            "Please select a project type.",
            "error"
          );

          return;

        }


        if (
          budgetElement &&
          !budget
        ) {

          showFormMessage(
            "Please select your budget.",
            "error"
          );

          return;

        }


        if (!consent) {

          showFormMessage(
            "Please confirm the contact consent.",
            "error"
          );

          return;

        }


        const emailPattern =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
          !emailPattern.test(email)
        ) {

          showFormMessage(
            "Please enter a valid email address.",
            "error"
          );

          return;

        }


        /* -----------------------------
           WHATSAPP MESSAGE
        ----------------------------- */

        let whatsappMessage =
          `Hello Rajarajeshwari,\n\n` +
          `I would like to discuss a project with you.\n\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n` +
          `Subject: ${subject}\n`;


        if (projectType) {

          whatsappMessage +=
            `Project Type: ${projectType}\n`;

        }


        if (budget) {

          whatsappMessage +=
            `Budget: ${budget}\n`;

        }


        whatsappMessage +=
          `\nMessage:\n${message}\n\n` +
          `Sent from your portfolio website.`;


        const whatsappURL =
          `https://wa.me/919363350985?text=${encodeURIComponent(
            whatsappMessage
          )}`;


        /* -----------------------------
           OPEN WHATSAPP
        ----------------------------- */

        showFormMessage(
          "Opening WhatsApp...",
          "success"
        );


        setTimeout(() => {

          window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
          );

        }, 300);


      }
    );

  }


  /* =========================================
     FORM MESSAGE HELPER
  ========================================== */

  function showFormMessage(
    message,
    type
  ) {

    if (!formMessage) {
      return;
    }

    formMessage.textContent =
      message;

    if (type === "success") {

      formMessage.style.color =
        "#79d69b";

    } else {

      formMessage.style.color =
        "#d98b8b";

    }

  }


  /* =========================================
     DIRECT WHATSAPP LINKS
  ========================================== */

  document
    .querySelectorAll(
      '[data-whatsapp="true"]'
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {

          /*
            The href in HTML will already
            point to WhatsApp.
          */

        }
      );

    });


  /* =========================================
     HERO PARALLAX
  ========================================== */

  const heroVisual =
    document.querySelector(
      ".hero-visual"
    );

  if (
    heroVisual &&
    finePointer
  ) {

    window.addEventListener(
      "mousemove",
      event => {

        const x =
          (event.clientX /
            window.innerWidth -
            0.5) * 10;

        const y =
          (event.clientY /
            window.innerHeight -
            0.5) * 10;

        heroVisual.style.setProperty(
          "--parallax-x",
          `${x}px`
        );

        heroVisual.style.setProperty(
          "--parallax-y",
          `${y}px`
        );

      }
    );

  }


  /* =========================================
     RESIZE RESET
  ========================================== */

  let resizeTimer;

  window.addEventListener(
    "resize",
    () => {

      clearTimeout(resizeTimer);

      resizeTimer =
        setTimeout(() => {

          updateActiveNav();

        }, 150);

    }
  );


  /* =========================================
     INITIAL PAGE STATE
  ========================================== */

  updateActiveNav();
  updateScrollProgress();

});

// லோடர் பர்சடேஜ் மற்றும் அனிமேஷன் வேலைகள்
window.addEventListener('DOMContentLoaded', () => {
    let percentageElement = document.getElementById('loader-percentage');
    let progressBar = document.getElementById('loader-progress-bar');
    let loaderScreen = document.getElementById('custom-loader');
    
    let currentWidth = 0;
    
    let loadInterval = setInterval(() => {
        // ஸ்பீடை கூட்ட அல்லது குறைக்க இந்த மதிப்பை மாற்றலாம்
        currentWidth += Math.floor(Math.random() * 8) + 3; 
        
        if (currentWidth >= 100) {
            currentWidth = 100;
            clearInterval(loadInterval);
            
            // 100% ஆனதும் லோடர் மறைந்து வெப்சைட் உள்ளே வரும்
            setTimeout(() => {
                loaderScreen.classList.add('loader-hidden');
            }, 300);
        }
        
        percentageElement.innerText = currentWidth + '%';
        progressBar.style.width = currentWidth + '%';
    }, 40);
});
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const links = document.querySelectorAll('.nav-links li a');

// ஹேம்பர்கரை கிளிக் செய்தால் மெனுவை காட்டுவது/மறைப்பது
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// மெனுவில் உள்ள ஏதேனும் ஒரு செக்ஷனை கிளிக் செய்தவுடன் ஆட்டோமேட்டிக்காக மெனு க்ளோஸ் ஆகி அந்த இடத்திற்குச் செல்ல
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});