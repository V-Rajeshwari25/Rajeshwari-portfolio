document.addEventListener("DOMContentLoaded", () => {

  // 1. Smooth scrolling & Auto-close mobile menu on link click
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      // Close mobile menu after clicking a link
      const navMenu = document.querySelector(".nav-menu");
      if (navMenu) {
        navMenu.classList.remove("mobile-open");
      }
    });
  });

  // =========================
  // MOBILE MENU TOGGLE
  // =========================
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {
    const toggleMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      navMenu.classList.toggle("mobile-open");
    };

    // Support both click and touch for mobile devices
    menuToggle.addEventListener("click", toggleMenu);
    menuToggle.addEventListener("touchend", toggleMenu);
  }

  // =========================
  // ACTIVE NAVIGATION ON SCROLL
  // =========================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-menu a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 130;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

});