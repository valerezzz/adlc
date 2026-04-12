import gsap from "gsap";

// Loader
window.addEventListener("load", () => {
  const loader = document.getElementById("pageLoader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hidden");
      loader.addEventListener("transitionend", () => {
        loader.remove();
        document.dispatchEvent(new CustomEvent("loaderDone"));
      });
    }, 600);
  } else {
    document.dispatchEvent(new CustomEvent("loaderDone"));
  }
});

// Navbar scroll effect
const navbar = document.querySelector(".navbar");

if (navbar) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

const burgerButton = document.getElementById("burger_button");
const mobileMenu = document.getElementById("mobile_menu");

if (burgerButton && mobileMenu) {
  burgerButton.addEventListener("click", () => {
    burgerButton.classList.toggle("open");
    mobileMenu.classList.toggle("open");

    const navbar = document.querySelector(".navbar");
    if (mobileMenu.classList.contains("open")) {
      navbar.classList.add("scrolled", "menu-open");
      document.body.style.overflow = "hidden";
    } else {
      navbar.classList.remove("menu-open");
      document.body.style.overflow = "";
      if (window.scrollY === 0) {
        navbar.classList.remove("scrolled");
      }
    }
  });
}

const reserverBtn = document.getElementById("reserver_btn");
const reserverDropdown = reserverBtn ? reserverBtn.closest(".reserver_dropdown") : null;

if (reserverBtn && reserverDropdown) {
  reserverBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    reserverDropdown.classList.toggle("open");
  });

  document.addEventListener("click", () => {
    reserverDropdown.classList.remove("open");
  });
}

// Navigation restaurant
const navButtons = document.querySelectorAll(
  ".restaurant_navigation_buttons .navigation_button",
);
const restaurantContent = document.querySelector(".restaurant_content");

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((b) => b.classList.remove("active_button"));
    btn.classList.add("active_button");

    const target = btn.dataset.target;
    restaurantContent.querySelectorAll(":scope > div").forEach((panel) => {
      if (panel.classList.contains(target)) {
        panel.style.display = "flex";
        const cards = panel.querySelectorAll(".restaurant_card");
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.08,
              ease: "power2.out",
            },
          );
        }
      } else {
        panel.style.display = "none";
      }
    });
  });
});
