// Theme + UX (safe on pages without themeToggle)
document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function getInitialTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    return systemPrefersDark() ? "dark" : "light";
  }

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  // Apply theme on load
  applyTheme(getInitialTheme());

  // Toggle button (only if it exists on the page)
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = html.getAttribute("data-theme") || "light";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);

      // small animation without forcing inline transform states
      themeToggle.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
        { duration: 300, easing: "ease-out" }
      );
    });
  }

  // If user has NOT manually set theme, follow OS changes
  const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  if (mq && !localStorage.getItem("theme")) {
    mq.addEventListener("change", (e) => applyTheme(e.matches ? "dark" : "light"));
  }

  // Smooth scroll ONLY for real in-page anchors (avoid breaking normal links)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return; // allow default
      const target = document.querySelector(href);
      if (!target) return; // allow default if not found

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Navbar shadow on scroll (safe if .nav missing)
  const nav = document.querySelector(".nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.style.boxShadow =
        window.scrollY > 100 ? "0 2px 20px rgba(0, 0, 0, 0.12)" : "none";
    });
  }

  // Fade-in observer (safe even if elements don't exist)
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".project-card, .writing-item, .tool-category").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Form button UX (safe)
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", () => {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (!submitBtn) return;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 3000);
    });
  }
});

console.log("%c👋 Hey there! Welcome to my portfolio.", "color: #C70A0C; font-size: 16px; font-weight: bold;");
console.log("%cExplore the code on GitHub: https://github.com/erenfidan14", "color: #6B7280; font-size: 12px;");
