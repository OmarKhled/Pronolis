$("*").attr("draggable", false);
const slides = document.getElementsByClassName("slides")[0].children;
const hashLocationSplit = window.location.hash.split("/");
const currentSlideNumber =
  hashLocationSplit[1] && hashLocationSplit[1].trim() != ""
    ? parseInt(hashLocationSplit[1].trim())
    : 0;
const ACTIONS = {
  close: "CLOSE",
  openPDF: "OPEN_PDF",
};

const PresentationManager = {
  ACTIONS,
  currentSlide: slides[currentSlideNumber],
  numberOfSlides: slides.length,
  slides,
  showModal: function () {
    const modal = this.currentSlide.getElementsByTagName("modal")[0];
    if (modal) {
      $(".modal-body").html(modal.innerHTML);
      $("#modal").modal();
    }
  },

  showReferences: function () {
    console.log("ref");
    const references = this.currentSlide.getElementsByTagName("references")[0];
    if (references) {
      $(".modal-body").html(references.innerHTML);
      $("#modal").modal();
    }
  },

  navigateToSlide: function (slideNumber) {
    window.location.hash = `/${slideNumber}`;
  },

  sendMessageToCarrier: function (action, payload) {
    try {
      if (Carrier) {
        Carrier.postMessage(JSON.stringify({ action, payload }));
      } else {
        throw Error("This can only be used inside Tacitapp Carrier");
      }
    } catch (err) {
      throw Error("This can only be used inside Tacitapp Carrier");
    }
  },

  exit: function ({ timeTrackingObject }) {
    try {
      this.sendMessageToCarrier(ACTIONS.close, timeTrackingObject);
    } catch (err) {
      console.error(err);
    }
  },

  openPDF: function (title, filename) {
    try {
      this.sendMessageToCarrier(ACTIONS.openPDF, { title, filename });
    } catch (err) {
      window.open(window.location.origin + "/assets/" + filename, "_blank");
    }
  },
};

export default PresentationManager;
