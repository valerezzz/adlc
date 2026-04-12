let currentLang = localStorage.getItem("lang") || "fr";

function applyTranslations(t) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) el.placeholder = t[key];
  });
  document.querySelectorAll(".toggle_language_current").forEach((el) => {
    el.textContent = currentLang.toUpperCase();
  });
  document.querySelectorAll(".mobile_lang_btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
  document.dispatchEvent(new CustomEvent("translationsApplied"));
}

const needsReload = document.querySelector("[data-dynamic-i18n]") !== null;

function applyLanguage(lang) {
  const changed = lang !== currentLang;
  currentLang = lang;
  localStorage.setItem("lang", lang);
  if (changed && needsReload) {
    location.reload();
    return;
  }
  fetch(`/src/json/${lang}.json`)
    .then((r) => r.json())
    .then(applyTranslations);
}

function initToggle(toggle) {
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
  });

  toggle.querySelectorAll("[data-lang]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      applyLanguage(item.dataset.lang);
      document.querySelectorAll(".toggle_language").forEach((t) => {
        t.classList.remove("open");
      });
    });
  });
}

initToggle(document.getElementById("toggle-language"));

// Mobile lang switch (FR | EN)
document.querySelectorAll(".mobile_lang_btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mobile_lang_btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyLanguage(btn.dataset.lang);
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".toggle_language")) {
    document.querySelectorAll(".toggle_language").forEach((t) => {
      t.classList.remove("open");
    });
  }
});

applyLanguage(currentLang);
