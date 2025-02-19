/**
 * Smooth Scroll JS
 * SmoothScroll(target,speed,smooth)
 */

function init() {
  SmoothOnSectionClick(document, 50);


  const smooth_scroll = 100;
  const smooth_scroll_speed = 201 - smooth_scroll;

  SmoothOnScroll(document, smooth_scroll_speed, 12);
}

/**
 * Smooth Scroll on Section Click
 * @param {*} target
 * @param {*} _speed // 0 to 100 (0 is fastest and 100 is slowest (max 4s scroll))
 */
function SmoothOnSectionClick(target = document, _speed = 100) {
  const maxScroll = 4000; // 4s
  const speed = (_speed * maxScroll) / 100;

  //   const easeInOutCubic = (t, b, c, d) => {
  //     t /= d / 2;
  //     if (t < 1) return (c / 2) * t * t * t + b;
  //     t -= 2;
  //     return (c / 2) * (t * t * t + 2) + b;
  //   };

  //   const smoothScrollOnSectionClick = (targetElement, speed = 1000) => {
  //     const targetPosition = targetElement.getBoundingClientRect().top;
  //     const startPosition = window.pageYOffset;

  //     const distance = targetPosition - startPosition;
  //     let start = null;

  //     const step = (timestamp) => {
  //       if (!start) start = timestamp;

  //       const progress = timestamp - start;
  //       window.scrollTo(
  //         0,
  //         easeInOutCubic(progress, startPosition, distance, speed)
  //       );

  //       if (progress < speed) window.requestAnimationFrame(step);
  //     }

  //     window.requestAnimationFrame(step);
  //   }

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const smoothScrollOnSectionClick = (targetElement, duration = 1000) => {
    const targetPosition =
      targetElement.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      window.scrollTo({
        top: startPosition + distance * easeInOutCubic(progress),
        behavior: "instant",
      });

      if (elapsedTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Easing function

  target.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();

      const targetElement = target.querySelector(anchor.getAttribute("href"));

      if (targetElement) smoothScrollOnSectionClick(targetElement, speed);
    });
  });
}

/**
 * Smooth Scroll on Mouse Wheel
 * @param {*} target
 * @param {*} speed // 0 to 100
 * @param {*} smooth // 0 to 20
 */

function SmoothOnScroll(target = document, speed = 100, smooth = 12) {
  // cross browser support for document scrolling
  if (target === document) {
    target =
      document.scrollingElement ||
      document.documentElement ||
      document.body.parentNode ||
      document.body;
  }

  let moving = false;
  let pos = target.scrollTop;

  const frame =
    target === document.body && document.documentElement
      ? document.documentElement
      : target; // safari is the new IE

  const scrolled = (e) => {
    e.preventDefault(); // disable default scrolling

    const delta = normalizeWheelDelta(e);

    pos += -delta * speed;
    pos = Math.max(0, Math.min(pos, target.scrollHeight - frame.clientHeight)); // limit scrolling

    if (!moving) update();
  };

  const normalizeWheelDelta = (e) => {
    const { detail, wheelDelta } = e;

    if (detail) {
      if (wheelDelta) {
        return (wheelDelta / detail / 40) * (detail > 0 ? 1 : -1);
      }

      return -detail / 3; // Firefox, Opera
    }

    return wheelDelta / 120; // IE, Safari, Chrome
  };

  const update = () => {
    moving = true;

    const delta = (pos - target.scrollTop) / smooth;

    target.scrollTop += delta > 0 ? Math.ceil(delta) : Math.floor(delta);

    if (Math.abs(delta) > 0.5) {
      requestAnimationFrame(update);
    } else {
      moving = false;
    }
  };

  target.addEventListener("mousewheel", scrolled, { passive: false });
  target.addEventListener("DOMMouseScroll", scrolled, { passive: false });
}

window.addEventListener("DOMContentLoaded", () => {
  init();
});
