const slides = document.getElementsByClassName("slides")[0];
const durationsMap = {};

let interval = null;

for (let i = 0; i < slides.children.length; i++) {
  const slide = slides.children[i];
  const { sectionName, slideName } = slide.dataset;
  console.log(sectionName);
  if (i == 0) {
    trackSlideDuration(sectionName, slideName);
  }
  if (!durationsMap[sectionName]) {
    durationsMap[sectionName] = {};
  }

  durationsMap[sectionName][slideName] = 0;
}

function trackSlideDuration(sectionName, slideName) {
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    durationsMap[sectionName][slideName]++;
  }, 1000);
}

function transformDurationsMapToCarrierDurationsModel() {
  const carrierDurationsModel = {
    sections: [],
  };
  const sections = Object.keys(durationsMap);
  for (let i = 0; i < sections.length; i++) {
    const slidesNames = Object.keys(durationsMap[sections[i]]);
    carrierDurationsModel.sections.push({
      name: sections[i],
      duration: 0,
      slides: [],
    });
    for (let j = 0; j < slidesNames.length; j++) {
      carrierDurationsModel.sections[i].slides.push({
        name: slidesNames[j],
        duration: durationsMap[sections[i]][slidesNames[j]],
      });
      carrierDurationsModel.sections[i].duration +=
        durationsMap[sections[i]][slidesNames[j]];
    }
  }

  return carrierDurationsModel;
}

export default {
  trackSlideDuration,
  transformDurationsMapToCarrierDurationsModel,
};
