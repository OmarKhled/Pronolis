import "animate.css";
import "./animate-extension.css";
import * as Reveal from "./reveal.js";
import TimeTracker from "./TimeTracker";
import PresentationManager from "./PresentationManager";
import GesturesManager from "./GesturesManager";
import AnimationManager from "./AnimationManager";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./reset.css";
import "./reveal.css";
import "./styles.css";
import { type } from "jquery";

let isMenuOpen = false;
let isSecondaryMenuOpen = false;
const animationHistory = [];

Reveal.initialize({
  margin: 0,
  controls: false,
  progress: false,
  center: false,
  hash: true,
  transition: "slide",
  dependencies: [],
});

(function init() {
  window.toggleMenu = toggleMenu;
  window.closeMenu = closeMenu;
  window.navigateToSlide = navigateToSlide;
  window.closePresentation = closePresentation;
  window.showSecondaryMenu = showSecondaryMenu;
  AnimationManager.animateSlide(PresentationManager.currentSlide);

  window.showModal = () => {
    PresentationManager.showModal();
  };
  window.openPDF = (title, filename) => {
    PresentationManager.openPDF(title, filename);
  };
  window.showReferences = () => {
    console.log("ref");
    PresentationManager.showReferences();
  };
  window.animateObject = animateObject;
  const { sectionName, slideName } = PresentationManager.currentSlide.dataset;
  TimeTracker.trackSlideDuration(sectionName, slideName);
})();

/* Toggle Menu */
function toggleMenu() {
  if (isMenuOpen) {
    closeMenu();
  } else {
    document.getElementById("menu-btn").classList.toggle("change");

    document.querySelector(".overlay-content").style.opacity = "1";
    document.querySelector(".overlay-content").style.transitionDelay = "0.3s";

    document.getElementById("menu").style.width = "30%";
    document.getElementById("menu").style.transitionDelay = "0s";
  }
  isMenuOpen = !isMenuOpen;
}

/* Close Menu */
function closeMenu() {
  document.getElementById("menu-btn").classList.toggle("change");

  document.querySelector(".overlay-content").style.opacity = "0";
  document.querySelector(".overlay-content").style.transitionDelay = "0s";

  document.getElementById("menu").style.width = "0%";
  document.getElementById("menu").style.transitionDelay = "0.3s";
}

function navigateToSlide(slideNumber) {
  toggleMenu();
  PresentationManager.navigateToSlide(slideNumber);
}

function closePresentation() {
  //TODO: Send notification to flutter app to signal closing of the presentation
  let lastSlide = document.querySelector(".slides").childElementCount;
  if (window.location.hash == `#/${lastSlide - 1}`) {
    PresentationManager.exit({
      timeTrackingObject:
        TimeTracker.transformDurationsMapToCarrierDurationsModel(),
    });
  } else {
    window.location.hash = `/${lastSlide}`;
  }
}

Reveal.addEventListener("slidechanged", function (event) {
  if (event.indexh !== 0) {
    document.getElementById("close-btn").style.display = "block";
  } else {
    document.getElementById("close-btn").style.display = "none";
  }

  if ([3, 4, 7].includes(event.indexh)) {
    document.getElementById("menu-btn").style.setProperty("--color", "#fff");
    console.log("first");
  } else {
    document.getElementById("menu-btn").style.setProperty("--color", "#00b2b0");
  }

  PresentationManager.currentSlide = event.currentSlide;
  AnimationManager.removeLastPlayedAnimations();
  AnimationManager.animateSlide(event.currentSlide);
  const { sectionName, slideName } = event.currentSlide.dataset;

  for (let i = 0; i < animationHistory.length; i++) {
    animationHistory[i].classList.add("d-none");
  }

  TimeTracker.trackSlideDuration(sectionName, slideName);
});

GesturesManager.listeners.on(
  GesturesManager.events.DOUBLE_TAP,
  function (event) {
    event.preventDefault();
    showSecondaryMenu();
  }
);

GesturesManager.listeners.on(GesturesManager.events.PRESS, function (event) {
  event.preventDefault();
  showSecondaryMenu();
});

GesturesManager.listeners.on(
  GesturesManager.events.SINGLE_TAP,
  function (event) {
    if (isSecondaryMenuOpen && event.target.id != "secondary-menu-btn") {
      event.preventDefault();
      document.querySelector(".secondary-overlay-content").style.opacity = "0";
      document.querySelector(
        ".secondary-overlay-content"
      ).style.transitionDelay = "0s";
      document.getElementById("secondary-menu").style.width = "0%";
      document.getElementById("secondary-menu").style.transitionDelay = "0.3s";
      isSecondaryMenuOpen = false;
    }
  }
);

function showSecondaryMenu() {
  document.querySelector(".secondary-overlay-content").style.opacity = "1";
  document.querySelector(".secondary-overlay-content").style.transitionDelay =
    "0.1s";
  document.getElementById("secondary-menu").style.width = "8%";
  document.getElementById("secondary-menu").style.transitionDelay = "0s";
  isSecondaryMenuOpen = true;
}

function animateObject(elementClass) {
  let element = document.getElementsByClassName(elementClass);

  for (let x = 0; x < element.length; x++) {
    console.log(elementClass);

    if (!element[x].classList.contains("d-none")) {
      const myAnimationOut = {
        animationName: "fadeOutRight",
        delay: "null",
      };
      AnimationManager.animateCSS(
        `.${elementClass}`,
        myAnimationOut.animationName,
        myAnimationOut.delay,
        function () {
          element[x].classList.remove(
            "animate__" + myAnimationOut.animationName
          );
          element[x].classList.add("d-none");
        }
      );
    }

    const myAnimation = {
      animationName: "fadeInRight",
      delay: "null",
    };

    animationHistory.push(element[x]);
    AnimationManager.animateCSS(
      `.${elementClass}`,
      myAnimation.animationName,
      myAnimation.delay,
      function () {
        element[x].classList.remove("animate__" + myAnimation.animationName);
      }
    );

    element[x].classList.remove("d-none");
  }
}
