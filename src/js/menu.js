const SUPABASE_URL = "https://kcobewoyovoaobhysaan.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjb2Jld295b3ZvYW9iaHlzYWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MjAzOTcsImV4cCI6MjA2NDk5NjM5N30.RqZS7Ivd7pdu3uEDFef0sodPQtEbPDwp6ZFd42SaVB0";

const lang = localStorage.getItem("lang") || "fr";

const joursLabels = {
  fr: ["lundi", "mardi", "mercredi", "jeudi", "vendredi"],
  en: ["monday", "tuesday", "wednesday", "thursday", "friday"],
};
const joursDB = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];
const joursCompletsFR = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

const todayDB = joursCompletsFR[new Date().getDay()];

const now = new Date();
const mondayOffset = now.getDay() === 0 ? -6 : 1 - now.getDay();
const monday = new Date(now);
monday.setDate(now.getDate() + mondayOffset);
const sunday = new Date(monday);
sunday.setDate(monday.getDate() + 6);

const locale = lang === "en" ? "en-GB" : "fr-FR";
const formatDate = (d) => d.toLocaleDateString(locale, { day: "numeric", month: "long" });

function extractPrice(text) {
  const match = text.match(/(\d+[\.,]\d+)\s*CHF/i);
  if (!match) return { name: text.trim(), price: "" };
  return {
    name: text.replace(match[0], "").trim(),
    price: match[1].replace(",", ".") + " CHF",
  };
}

function buildSlide(jourDB, menusData, t) {
  const m = menusData[jourDB] || {};
  const entree = m.entree || "";
  const plat = m.plat_du_jour || "";
  let bodyHTML = "";

  if (!entree && !plat) {
    bodyHTML = `
      <div class="plat">
        <div class="plat_l">
          <h5>${t.menu_no_menu}</h5>
          <p>${t.menu_no_menu_desc}</p>
        </div>
      </div>`;
  } else {
    if (entree) {
      const e = extractPrice(entree);
      bodyHTML += `
        <h5 class="menu_section_title_inline">${t.menu_entree}</h5>
        <div class="plat">
          <div class="plat_l">
            <p>${e.name}</p>
          </div>
          ${e.price ? `<div class="plat_r"><p>${e.price}</p></div>` : ""}
        </div>`;
    }
    if (plat) {
      const plats = plat.split(/\n+[Oo][Uu]\n+/).map((s) => s.trim()).filter(Boolean);
      const platLabel = plats.length > 1 ? t.menu_plat_s : t.menu_plat;
      bodyHTML += `<h5 class="menu_section_title_inline">${platLabel}</h5>`;
      plats.forEach((p, i) => {
        const parsed = extractPrice(p);
        bodyHTML += `
          ${i > 0 ? '<div class="separator"></div>' : ""}
          <div class="plat">
            <div class="plat_l">
              <p>${parsed.name}</p>
            </div>
            ${parsed.price ? `<div class="plat_r"><p>${parsed.price}</p></div>` : ""}
          </div>`;
      });
    }
  }

  return `
    <div class="swiper-slide">
      <div class="restaurant_card menu_day_card">
        <div class="restaurant_card_container">
          <div class="restaurant_card_header">
            <img src="src/assets/images/logo-b.svg" alt="" />
          </div>
          <div class="restaurant_card_body">
            ${bodyHTML}
          </div>
        </div>
      </div>
    </div>`;
}

function buildButtons(swiper) {
  const container = document.getElementById("day_buttons");
  container.innerHTML = joursLabels[lang]
    .map((j, i) =>
      `<button class="third_button day_btn" data-index="${i}">${j.charAt(0).toUpperCase() + j.slice(1)}</button>`
    )
    .join("");

  container.querySelectorAll(".day_btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      swiper.slideTo(parseInt(btn.dataset.index));
    });
  });
}

function updateButtons(activeIndex) {
  document.querySelectorAll(".day_btn").forEach((btn, i) => {
    btn.classList.toggle("active_button", i === activeIndex);
  });
}

function buildDots(swiper, activeIndex) {
  const el = document.getElementById("menu_swiper_pagination");
  el.innerHTML = joursDB.map((_, i) =>
    `<div class="menu_dot ${i === activeIndex ? "menu_dot--active" : ""}" data-index="${i}"></div>`
  ).join("");
  el.querySelectorAll(".menu_dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      swiper.slideTo(parseInt(dot.dataset.index));
    });
  });
}

function updateDots(activeIndex) {
  document.querySelectorAll(".menu_dot").forEach((dot, i) => {
    dot.classList.toggle("menu_dot--active", i === activeIndex);
  });
}

fetch(`/json/${lang}.json`)
  .then((r) => r.json())
  .then((t) => {
    document.getElementById("semaine_titre").textContent =
      (t.menu_semaine || "")
        .replace("{a}", formatDate(monday))
        .replace("{b}", formatDate(sunday));

    return fetch(
      `${SUPABASE_URL}/rest/v1/menus?select=jour,entree,plat_du_jour`,
      { headers: { apikey: SUPABASE_KEY } }
    )
      .then((r) => r.json())
      .then((data) => {
        const menusData = Object.fromEntries(data.map((m) => [m.jour, m]));
        const initialSlide = Math.max(joursDB.indexOf(todayDB), 0);

        document.getElementById("swiper_wrapper").innerHTML = joursDB
          .map((j) => buildSlide(j, menusData, t))
          .join("");

        const swiperEl = document.querySelector(".menuSwiper");

        function updateSwiperHeight() {
          swiperEl.style.height = "auto";
          const slides = document.querySelectorAll(".menuSwiper .swiper-slide");
          let maxHeight = 0;
          slides.forEach((s) => { maxHeight = Math.max(maxHeight, s.scrollHeight); });
          swiperEl.style.height = maxHeight + "px";
        }

        updateSwiperHeight();

        const swiper = new Swiper(".menuSwiper", {
          effect: "cards",
          grabCursor: true,
          centeredSlides: true,
          initialSlide: initialSlide,
          cardsEffect: {
            perSlideOffset: 8,
            perSlideRotate: 2,
            rotate: true,
            slideShadows: true,
          },
          on: {
            slideChange() {
              updateButtons(this.activeIndex);
              updateDots(this.activeIndex);
            },
          },
        });

        buildButtons(swiper);
        updateButtons(initialSlide);
        buildDots(swiper, initialSlide);

        // Animate day buttons appearance
        const dayBtnsContainer = document.getElementById("day_buttons");
        if (dayBtnsContainer) {
          dayBtnsContainer.style.visibility = "visible";
          const btns = dayBtnsContainer.querySelectorAll(".day_btn");
          btns.forEach((btn, i) => {
            btn.style.opacity = "0";
            btn.style.transform = "translateY(15px)";
          });
          // Reveal once loader is gone
          function revealBtns() {
            btns.forEach((btn, i) => {
              btn.style.transition = `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`;
              requestAnimationFrame(() => {
                btn.style.opacity = "1";
                btn.style.transform = "translateY(0)";
              });
            });
          }
          // Check if loader is already gone
          if (!document.getElementById("pageLoader")) {
            revealBtns();
          } else {
            document.addEventListener("loaderDone", revealBtns, { once: true });
          }
        }

        window.addEventListener("resize", () => {
          updateSwiperHeight();
          swiper.update();
        });
      });
  })
  .catch(() => {
    document.getElementById("swiper_wrapper").innerHTML = `
      <div class="swiper-slide">
        <div class="restaurant_card menu_day_card">
          <div class="restaurant_card_container">
            <div class="restaurant_card_body">
              <div class="plat">
                <div class="plat_l">
                  <h5>Erreur de chargement</h5>
                  <p>Veuillez réessayer plus tard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  });
