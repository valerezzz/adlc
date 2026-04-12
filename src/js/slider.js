function createSlider(slider) {
  const images = Array.from(slider.querySelectorAll("img"));
  const count = images.length;
  if (count < 2) return;

  const allImages = [
    images[count - 1].cloneNode(true),
    ...images,
    images[0].cloneNode(true),
  ];
  const trackCount = allImages.length;

  let current = 2;
  let isTransitioning = false;

  function realIndex(trackIndex) {
    return (((trackIndex - 1) % count) + count) % count;
  }

  function getSlideRatio() {
    return (
      parseFloat(
        getComputedStyle(slider).getPropertyValue("--slider-ratio"),
      ) || 0.72
    );
  }

  slider.innerHTML = `
    <div class="slider_viewport">
      <div class="slider_track_wrapper">
        <div class="slider_track">
          ${allImages
            .map((img, i) => {
              img.setAttribute("draggable", "false");
              const isClone = i === 0 || i === trackCount - 1;
              return `<div class="slider_slide${i === current ? " active" : ""}${isClone ? " slider_slide--clone" : ""}">${img.outerHTML}</div>`;
            })
            .join("")}
        </div>
      </div>
      <button class="slider_arrow slider_arrow--prev" aria-label="Précédent">
        <span class="material-symbols-outlined">keyboard_arrow_left</span>
      </button>
      <button class="slider_arrow slider_arrow--next" aria-label="Suivant">
        <span class="material-symbols-outlined">keyboard_arrow_right</span>
      </button>
    </div>
    <div class="slider_dots">
      ${images
        .map(
          (_, i) =>
            `<button class="slider_dot${i === realIndex(current) ? " active" : ""}" aria-label="Slide ${i + 1}"></button>`,
        )
        .join("")}
    </div>
  `;

  const track = slider.querySelector(".slider_track");
  const slides = slider.querySelectorAll(".slider_slide");
  const dots = slider.querySelectorAll(".slider_dot");
  const prevBtn = slider.querySelector(".slider_arrow--prev");
  const nextBtn = slider.querySelector(".slider_arrow--next");
  const wrapper = slider.querySelector(".slider_track_wrapper");

  function getTranslateX(index) {
    const wrapperWidth = wrapper.offsetWidth;
    const slideWidth = Math.round(wrapperWidth * getSlideRatio());
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return wrapperWidth / 2 - slideWidth / 2 - index * (slideWidth + gap);
  }

  function setSlideWidths() {
    const slideWidth = Math.round(wrapper.offsetWidth * getSlideRatio());
    slides.forEach((s) => {
      s.style.width = `${slideWidth}px`;
    });
  }

  function goTo(index, animate = true) {
    current = index;
    setSlideWidths();

    if (!animate) {
      track.style.transition = "none";
    }

    track.style.transform = `translateX(${getTranslateX(index)}px)`;

    if (!animate) {
      void track.offsetHeight;
      track.style.transition = "";
    }

    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) =>
      d.classList.toggle("active", i === realIndex(index)),
    );
  }

  track.addEventListener("transitionend", () => {
    if (current === 0) {
      goTo(count, false);
    } else if (current === trackCount - 1) {
      goTo(1, false);
    }
    isTransitioning = false;
  });

  prevBtn.addEventListener("click", () => {
    if (isTransitioning) return;
    isTransitioning = true;
    goTo(current - 1);
  });

  nextBtn.addEventListener("click", () => {
    if (isTransitioning) return;
    isTransitioning = true;
    goTo(current + 1);
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      if (isTransitioning) return;
      isTransitioning = true;
      goTo(i + 1);
    });
  });

  slides.forEach((slide, i) => {
    const isClone = i === 0 || i === trackCount - 1;
    if (isClone) return;
    slide.addEventListener("click", () => {
      if (i !== current && !isTransitioning) {
        isTransitioning = true;
        goTo(i);
      }
    });
  });

  // Drag tactile
  let touchStartX = 0;
  let baseTranslate = 0;
  let isDragging = false;

  slider.addEventListener(
    "touchstart",
    (e) => {
      if (isTransitioning) return;
      touchStartX = e.touches[0].clientX;
      baseTranslate = getTranslateX(current);
      isDragging = true;
      track.style.transition = "none";
    },
    { passive: true },
  );

  slider.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      const diff = e.touches[0].clientX - touchStartX;
      track.style.transform = `translateX(${baseTranslate + diff}px)`;
    },
    { passive: true },
  );

  slider.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = "";

    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 20) {
      isTransitioning = true;
      goTo(diff > 0 ? current + 1 : current - 1);
    } else {
      goTo(current);
    }
  });

  window.addEventListener("resize", () => goTo(current, false));

  goTo(current, false);
}

document.querySelectorAll(".section_slider").forEach(createSlider);
