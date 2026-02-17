// Theme + UX (works on every page, even if some elements are missing)
document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");

  // --- Theme init (persist across all pages) ---
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") {
    html.setAttribute("data-theme", saved);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    html.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }

  // --- Toggle theme (guarded) ---
  const applyTheme = (t) => {
    html.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
  };

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = html.getAttribute("data-theme") || "light";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);

      // button micro-animation (guarded)
      themeToggle.style.transform = "rotate(360deg)";
      setTimeout(() => (themeToggle.style.transform = "rotate(0deg)"), 300);
    });
  }

  // If user never set a theme manually, follow system changes
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener?.("change", (e) => {
    if (localStorage.getItem("theme")) return; // user override exists
    html.setAttribute("data-theme", e.matches ? "dark" : "light");
  });

  // --- Smooth scroll only for same-page anchors that exist ---
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // --- Navbar shadow on scroll (guarded) ---
  const nav = document.querySelector(".nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.style.boxShadow =
        window.pageYOffset > 60 ? "0 2px 20px rgba(0, 0, 0, 0.12)" : "none";
    });
  }

  // --- Intersection observer animations (guarded) ---
  const animated = document.querySelectorAll(".project-card, .writing-item, .tool-category");
  if (animated.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    animated.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
  }

  // --- Form UX (guarded) ---
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", () => {
      const btn = contactForm.querySelector('button[t]()
