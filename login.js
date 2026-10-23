(function () {
  "use strict";

  const THEME_KEY = "task-tracker.theme";
  const REMEMBER_KEY = "task-tracker.rememberEmail";

  const els = {
    form: document.getElementById("login-form"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    remember: document.getElementById("remember"),
    submit: document.getElementById("submit-btn"),
    alert: document.getElementById("form-alert"),
    togglePassword: document.getElementById("toggle-password"),
    emailError: document.getElementById("email-error"),
    passwordError: document.getElementById("password-error"),
    themeToggle: document.getElementById("theme-toggle"),
    themeIcon: document.querySelector(".theme-icon"),
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---------- Theme (shared pattern with app.js) ---------- */

  function loadTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (els.themeIcon) {
      els.themeIcon.innerHTML = theme === "dark" ? "&#9790;" : "&#9728;";
    }
    if (els.themeToggle) {
      els.themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }

  let theme = loadTheme();

  /* ---------- Validation helpers ---------- */

  function setError(field, errorEl, message) {
    if (message) {
      field.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
      errorEl.hidden = false;
    } else {
      field.removeAttribute("aria-invalid");
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
  }

  function validateEmail() {
    const value = els.email.value.trim();
    if (!value) {
      setError(els.email, els.emailError, "Email is required.");
      return false;
    }
    if (!EMAIL_RE.test(value)) {
      setError(els.email, els.emailError, "Enter a valid email address.");
      return false;
    }
    setError(els.email, els.emailError, "");
    return true;
  }

  function validatePassword() {
    const value = els.password.value;
    if (!value) {
      setError(els.password, els.passwordError, "Password is required.");
      return false;
    }
    if (value.length < 8) {
      setError(els.password, els.passwordError, "Password must be at least 8 characters.");
      return false;
    }
    setError(els.password, els.passwordError, "");
    return true;
  }

  function showAlert(message, type) {
    els.alert.textContent = message;
    els.alert.className = "form-alert " + type;
    els.alert.hidden = false;
  }

  function hideAlert() {
    els.alert.hidden = true;
    els.alert.textContent = "";
  }

  function setLoading(isLoading) {
    els.submit.disabled = isLoading;
    els.submit.classList.toggle("loading", isLoading);
    els.submit.innerHTML = isLoading
      ? '<span class="spinner" aria-hidden="true"></span>Signing in…'
      : "Sign in";
  }

  /* ---------- Password visibility toggle ---------- */

  els.togglePassword.addEventListener("click", () => {
    const showing = els.password.type === "text";
    els.password.type = showing ? "password" : "text";
    els.togglePassword.setAttribute("aria-pressed", showing ? "false" : "true");
    els.togglePassword.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    els.togglePassword.title = showing ? "Show password" : "Hide password";
  });

  /* ---------- Remember me ---------- */

  function restoreRememberedEmail() {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        els.email.value = saved;
        els.remember.checked = true;
      }
    } catch (_) {
      /* storage unavailable */
    }
  }

  function persistRememberedEmail() {
    try {
      if (els.remember.checked) {
        localStorage.setItem(REMEMBER_KEY, els.email.value.trim());
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
    } catch (_) {
      /* storage unavailable */
    }
  }

  /* ---------- Submit ---------- */

  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideAlert();

    const emailOk = validateEmail();
    const passwordOk = validatePassword();

    if (!emailOk || !passwordOk) {
      showAlert("Please fix the errors below and try again.", "error");
      (emailOk ? els.password : els.email).focus();
      return;
    }

    setLoading(true);

    // Demo authentication: no backend, no credentials stored or transmitted.
    window.setTimeout(() => {
      setLoading(false);
      persistRememberedEmail();
      showAlert("Signed in successfully! Redirecting to your tasks…", "success");
      els.form.reset();
      window.setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);
    }, 800);
  });

  // Re-validate on blur once a field has been touched
  els.email.addEventListener("blur", () => {
    if (els.email.value.trim()) validateEmail();
  });
  els.password.addEventListener("blur", () => {
    if (els.password.value) validatePassword();
  });

  /* ---------- Init ---------- */

  function init() {
    applyTheme(theme);
    restoreRememberedEmail();

    els.themeToggle.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, theme);
      applyTheme(theme);
    });

    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored !== "light" && stored !== "dark") {
          theme = e.matches ? "dark" : "light";
          applyTheme(theme);
        }
      };
      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", handleChange);
      } else if (typeof mq.addListener === "function") {
        mq.addListener(handleChange);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();