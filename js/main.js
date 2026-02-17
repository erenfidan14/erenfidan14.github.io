/* main.js
   - Theme persists across ALL pages (home + blog)
   - No crash if #themeToggle or .nav doesn't exist
   - Avoids “flash” of wrong theme by applying early
   - Keeps your button rotation animation when toggle exists
   - Smooth scroll only for same-page anchors
*/

(function () {
  const STORAGE_KEY = "theme";
  const root = document.documentElement;

  function getSystemTheme() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function getSavedTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "dark" || saved === "light" ? saved : null;
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
  }

  // Apply theme ASAP (prevents flash)
  const initialTheme = getSavedTheme() || getSystemTheme();
  applyTheme(initialTheme);

  document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");

    // Toggle theme (only if button exists)
    function toggleTheme() {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "light" ? "dark" : "light";

      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);

      // Button animation if present
      if (themeToggle) {
        themeToggle.style.transform = "rotate(360deg)";
        setTimeout(() => {
          themeToggle.style.transform = "rotate(0deg)";
        }, 300);
      }
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme);
    }

    // If user has NOT explicitly chosen a theme, follow system changes
    const mql = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    if (mql && typeof mql.addEventListener === "function") {
      mql.addEventListener("change", (e) => {
        // Respect explicit user choice
        if (getSavedTheme()) return;
        applyTheme(e.matches ? "dark" : "light");
      });
    } else if (mql && typeof mql.addListener === "function") {
      // Safari fallback
      mql.addListener((e) => {
        if (getSavedTheme()) return;
        applyTheme(e.matches ? "dark" : "light");
      });
    }

    // Smooth scroll for same-page anchors only (don’t break blog -> home links)
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });

    // Navbar shadow on scroll (only if .nav exists)
    const nav = document.querySelector(".nav");
    if (nav) {
      window.addEventListener("scroll", () => {
        const y = window.pageYOffset || document.documentElement.scrollTop || 0;
        nav.style.boxShadow = y > 100 ? "0 2px 20px rgba(0, 0, 0, 0.1)" : "none";
      });
    }

    // Intersection Observer for fade-in animations (safe if unsupported)
    if ("IntersectionObserver" in window) {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      document
        .querySelectorAll(".project-card, .writing-item, .tool-category")
        .forEach((el) => {
          el.style.opacity = "0";
          el.style.transform = "translateY(20px)";
          el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
          observer.observe(el);
        });
    }

    // Form submission handling (safe on pages without the form)
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", function () {
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

  // Console greeting (keep, but theme-aware color)
  const accent = getSavedTheme() === "dark" ? "#00D4AA" : "#009E4D";
  console.log("%c👋 Hey there! Welcome to my portfolio.", `color: ${accent}; font-size: 16px; font-weight: bold;`);
  console.log(
    "%cFeel free to explore the code on GitHub: https://github.com/erenfidan14",
    "color: #6B7280; font-size: 12px;"
  );
})();
