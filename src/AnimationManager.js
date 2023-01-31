let lastPlayedAnimations = [];
function animateSlide(slide) {
  if (slide.children && slide.children.length > 0) {
    for (let i = 0; i < slide.children.length; i++) {
      if (
        slide.children[i].dataset.animation &&
        slide.children[i].dataset.animation != ''
      ) {
        animateCSS(
          slide.children[i],
          slide.children[i].dataset.animation,
          slide.children[i].dataset.delay
        );
      }
      if (
        slide.children[i] instanceof SVGElement &&
        slide.children[i].tagName === 'circle'
      ) {
        console.log(slide.children[i].dataset);
        animateCircle(
          slide.children[i],
          slide.children[i].dataset.percentage,
          slide.children[i].dataset.delay
        );
      }
      animateSlide(slide.children[i]);
    }
    return;
  }
  return;
}
function removeLastPlayedAnimations() {
  const size = lastPlayedAnimations.length;
  for (let i = 0; i < size; i++) {
    lastPlayedAnimations[i].css('strokeDasharray', '0 439');
    console.log(lastPlayedAnimations);
  }
  lastPlayedAnimations = [];
}
const animateCSS = (
  element,
  animation = 'null',
  delay = 'null',
  callback = null,
  prefix = 'animate__'
) => {
  let node;
  if (element instanceof HTMLElement) {
    node = element;
  } else {
    node = document.querySelector(element);
  }
  const animationClass = `${prefix}${animation}`;
  const delayClass = `${prefix}${delay}`;
  node.classList.add(`${prefix}animated`, animationClass, delayClass);
  function handleAnimationEnd() {
    node.classList.remove(`${prefix}animated`, animationClass, delayClass);
    node.removeEventListener('animationend', handleAnimationEnd);
    if (typeof callback === 'function') callback();
  }
  node.addEventListener('animationend', handleAnimationEnd);
};
function animateCircle(element, per, delay) {
  setTimeout(function () {
    var result = (per * 439) / 100;
    $(element).css('strokeDasharray', result);
    lastPlayedAnimations.push($(element));
  }, parseInt(delay) * 800);
}
export default {
  animateCSS,
  animateSlide,
  removeLastPlayedAnimations,
};
