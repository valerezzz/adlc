import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".transition").forEach((section) => {
  const rows = section.querySelectorAll(".transition_row");
  if (rows.length < 2) return;

  const containerWidth = section.offsetWidth;

  // Dupliquer le contenu un nombre fixe de fois
  rows.forEach((row) => {
    const originalItems = Array.from(row.children);
    for (let i = 0; i < 8; i++) {
      originalItems.forEach((item) => row.appendChild(item.cloneNode(true)));
    }
    gsap.set(row, { x: -(row.scrollWidth - containerWidth) / 2 });
  });

  const row1 = rows[0];
  const row2 = rows[1];
  const travel = containerWidth * 0.2;
  const center1 = -(row1.scrollWidth - containerWidth) / 2;
  const center2 =
    -(row2.scrollWidth - containerWidth) / 2 + containerWidth * 0.2;

  gsap.set(row2, { x: center2 });

  gsap.fromTo(
    row1,
    { x: center1 + travel },
    {
      x: center1 - travel,
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    },
  );

  gsap.fromTo(
    row2,
    { x: center2 - travel },
    {
      x: center2 + travel,
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    },
  );
});
