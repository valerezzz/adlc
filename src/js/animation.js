import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

function animateHeader() {
  const h2 = document.querySelector(".header_content_texts h2");
  const h1 = document.querySelector(".header_content_texts h1");
  const buttons = document.querySelector(".header_content_buttons");

  if (!h1) {
    // No header on this page, animate navbar with a short fade-in
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      gsap.from(navbar, {
        y: -50,
        duration: 0.6,
        autoAlpha: 0,
        ease: "power2.out",
      });
    }
    return;
  }

  // Make parent elements visible so GSAP can animate the words
  gsap.set([h1, h2], { visibility: "visible" });

  const splitH2 = new SplitText(h2, { type: "words" });
  const splitH1 = new SplitText(h1, { type: "words" });

  gsap.from(splitH2.words, {
    stagger: 0.1,
    y: 25,
    duration: 1,
    autoAlpha: 0,
    rotateZ: 5,
    ease: "power2.out",
    delay: 0.25,
  });

  gsap.from(splitH1.words, {
    stagger: 0.1,
    y: 50,
    duration: 1.5,
    autoAlpha: 0,
    rotateZ: 5,
    ease: "power2.out",
    delay: 0,
  });

  if (buttons) {
    const btns = buttons.children;
    for (let i = 0; i < btns.length; i++) {
      gsap.from(btns[i], {
        y: 50,
        duration: 1,
        autoAlpha: 0,
        rotateZ: 5,
        ease: "power2.out",
        delay: 0.75 + i * 0.2,
      });
    }
  }

  const navbar = document.querySelector(".navbar");
  if (navbar) {
    gsap.from(navbar, {
      y: -100,
      duration: 1,
      autoAlpha: 0,
      ease: "power2.out",
      delay: 1.25,
    });
  }

  const arrow = document.querySelector(".arrow_scroll");
  if (arrow) {
    gsap.set(arrow, { autoAlpha: 0, y: -10 });
    const arrowTl = gsap.timeline({ delay: 1.5 });
    arrowTl.to(arrow, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power2.out" });
    arrowTl.to(arrow, {
      y: -10,
      duration: 1,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });
  }
}

function animateSections() {
  document.querySelectorAll(".section").forEach((section) => {
    const h2 = section.querySelector(".section_header h2");
    const p = section.querySelector(".section_header p");
    // Get all direct children of section_container, excluding section_header
    const container = section.querySelector(".section_container");
    const items = container
      ? Array.from(container.children).filter(
          (el) => !el.classList.contains("section_header"),
        )
      : [];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        once: true,
      },
    });

    if (h2) {
      tl.from(h2, {
        y: 30,
        duration: 0.5,
        autoAlpha: 0,
        ease: "power2.out",
      });
    }

    if (p) {
      tl.from(
        p,
        { y: 20, duration: 0.4, autoAlpha: 0, ease: "power2.out" },
        "-=0.3",
      );
    }

    if (items.length) {
      tl.from(
        items,
        {
          stagger: 0.08,
          y: 30,
          duration: 0.5,
          autoAlpha: 0,
          ease: "power2.out",
        },
        "-=0.2",
      );
    }
  });
}

function animateHistoire() {
  const section = document.querySelector(".histoire");
  if (!section) return;

  const h2 = section.querySelector("h2");
  const texts = section.querySelectorAll(".histoire_texts p");
  const logo = section.querySelector("img");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      once: true,
    },
  });

  if (h2) {
    tl.from(h2, {
      y: 30,
      duration: 0.5,
      autoAlpha: 0,
      ease: "power2.out",
    });
  }

  if (texts.length) {
    tl.from(
      texts,
      { y: 20, duration: 0.4, autoAlpha: 0, stagger: 0.1, ease: "power2.out" },
      "-=0.2",
    );
  }

  if (logo) {
    tl.from(
      logo,
      { scale: 0.8, duration: 0.5, autoAlpha: 0, ease: "power2.out" },
      "-=0.2",
    );
  }
}

function animateFormulaire() {
  const section = document.querySelector(".forumulaire_section");
  if (!section) return;

  const img = section.querySelector(".formulaire_img");
  const content = section.querySelector(".formulaire_content");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      once: true,
    },
  });

  if (img) {
    tl.from(img, {
      x: -30,
      duration: 0.5,
      autoAlpha: 0,
      ease: "power2.out",
    });
  }

  if (content) {
    tl.from(
      content,
      { x: 30, duration: 0.5, autoAlpha: 0, ease: "power2.out" },
      "-=0.3",
    );
  }
}

function animateTransitions() {
  document.querySelectorAll(".transition").forEach((section) => {
    const rows = section.querySelectorAll(".transition_row");

    gsap.from(rows, {
      autoAlpha: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        once: true,
      },
    });
  });
}

// Wait for both translations and loader to finish before animating
let translationsReady = false;
let loaderReady = false;

function animateBackButtons() {
  const btn = document.querySelector(".menudujour_back_btn, .hotel_back_btn, .hub_back_btn");
  if (btn) {
    gsap.from(btn, {
      x: -20,
      duration: 0.5,
      autoAlpha: 0,
      ease: "power2.out",
    });
  }
}

function startAnimations() {
  if (!translationsReady || !loaderReady) return;
  animateHeader();
  animateSections();
  animateHistoire();
  animateFormulaire();
  animateTransitions();
  animateBackButtons();
}

document.addEventListener("translationsApplied", () => {
  translationsReady = true;
  startAnimations();
}, { once: true });

document.addEventListener("loaderDone", () => {
  loaderReady = true;
  startAnimations();
}, { once: true });
