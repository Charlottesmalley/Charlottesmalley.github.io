import { Pane } from 'https://cdn.skypack.dev/tweakpane@4.0.4'

const config = {
  theme: 'light',
  reveal: false,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.reveal = config.reveal
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})

ctrl.addBinding(config, 'reveal', {
  label: 'Reveal',
})

ctrl.on('change', sync)
update()

if (
  !CSS.supports('(animation-timeline: view()) and (animation-range: 0 100%)')
) {
  class Slider {
    constructor(element) {
      const input = element.querySelector('[type=range]')
      const sync = () => {
        const val = (input.value - input.min) / (input.max - input.min)
        element.style.setProperty('--slider-complete', Math.round(val * 100))
      }
      console.info('polyfilling scroll animation for input:', element)
      input.addEventListener('input', sync)
      input.addEventListener('pointerdown', ({ x, y }) => {
        const { left, top, height, width } = input.getBoundingClientRect()
        const vertical = height > width
        const range =
          Number.parseInt(input.max, 10) - Number.parseInt(input.min, 10)
        const ratio = vertical ? (y - top) / height : (x - left) / width
        // alert(ratio, val)
        const val = Number.parseInt(input.min, 10) + Math.floor(range * ratio)
        input.value = val
        sync()
      })
      sync()
    }
  }
  const sliders = document.querySelectorAll('.slider')
  for (const slider of sliders) new Slider(slider)
}

// To cross-check the input value with the visual value
// const input = document.querySelector('.slider input')
// input.addEventListener('input', () => {
//   console.info({
//     val: input.value,
//     complete: Math.round(
//       ((input.value - input.min) / (input.max - input.min)) * 100
//     ),
//   })
// })
import gsap from 'https://cdn.skypack.dev/gsap';

const { InertiaPlugin } = window;

gsap.registerPlugin(Draggable);
gsap.registerPlugin(InertiaPlugin);

const friction = -0.5;
const CONTAINER = document.querySelector('.slider');
const PROXY = document.querySelector('.slider__proxy');
const LABEL = document.querySelector('.slider__label');
const INPUT = document.querySelector('input');
const VALUE_TOGGLE = document.querySelector('button');
const PROXY_PROPS = gsap.getProperty(PROXY);
const TRACKER = InertiaPlugin.track(PROXY, 'x,y')[0];
const BUMP = 10;

const KNOCK = new Audio('https://assets.codepen.io/605876/pinball-knock.mp3');

let animateBounce;

gsap.defaults({
  overwrite: true });


const syncInput = e => {
  const range = PROXY_PROPS('x');
  const width = CONTAINER.getBoundingClientRect().width;
  const radius = PROXY.getBoundingClientRect().width / 2;
  const min = INPUT.min;
  const max = INPUT.max;
  const value =
  e && e.type === 'change' ?
  e.target.value :
  Math.floor(gsap.utils.mapRange(radius, width - radius, min, max, range));

  if (!isNaN(value)) {
    gsap.set(INPUT, { value });
    gsap.set(LABEL, { innerText: value });
    if (e && e.type === 'change')
    gsap.set(PROXY, {
      x: gsap.utils.mapRange(min, max, radius, width - radius, value) });

  }
};
let bumping;
const bumpContainer = coeff => {
  if (bumping !== false && coeff === bumping) return;
  bumping = coeff;
  const vx = TRACKER.get('x');
  const xPercent =
  gsap.utils.clamp(
  0,
  BUMP,
  gsap.utils.mapRange(0, 1000, 0, BUMP, Math.abs(vx))) *
  coeff;
  const duration = gsap.utils.clamp(
  0.05,
  0.2,
  gsap.utils.mapRange(0, 1000, 0.2, 0.05, Math.abs(vx)));

  const volume =
  gsap.utils.clamp(
  0.1,
  1,
  gsap.utils.mapRange(0, 1000, 0, 1, Math.abs(vx)));

  // const xPercent = BUMP * coeff
  gsap.to(CONTAINER, {
    onStart: () => {
      KNOCK.pause();
      KNOCK.currentTime = 0;
      KNOCK.volume = volume;
      KNOCK.play();
    },
    onComplete: () => {
      bumping = false;
    },
    xPercent,
    yoyo: true,
    repeat: 1,
    duration });

};

INPUT.addEventListener('change', syncInput, false);
VALUE_TOGGLE.addEventListener('click', () => {
  gsap.killTweensOf([PROXY, CONTAINER]);
  const PRESSED =
  VALUE_TOGGLE.getAttribute('aria-pressed') === 'false' ? 'true' : 'false';
  VALUE_TOGGLE.setAttribute('aria-pressed', PRESSED);
  gsap.set(LABEL, {
    '--opacity': PRESSED === 'true' ? 1 : 0 });

});

function checkBounds() {
  const radius = PROXY.getBoundingClientRect().width / 2;
  let r = radius;
  let x = PROXY_PROPS('x');
  let vx = TRACKER.get('x');
  let xPos = x;

  let hitting = false;

  syncInput();

  if (x + r > CONTAINER.getBoundingClientRect().width) {
    xPos = CONTAINER.getBoundingClientRect().width - r;
    vx *= friction;
    bumpContainer(1);
    hitting = true;
  } else if (x - r < 0) {
    xPos = r;
    vx *= friction;
    bumpContainer(-1);
    hitting = true;
  }

  if (hitting) {
    animateBounce(xPos, vx);
  }
}

animateBounce = (x = '+=0', vx = 'auto') => {
  gsap.fromTo(
  PROXY,
  { x },
  {
    inertia: {
      x: vx },

    onUpdate: checkBounds });


};

const dragHandle = new Draggable(PROXY, {
  bounds: CONTAINER,
  type: 'x',
  onPress: () => {
    gsap.killTweensOf(PROXY);
    dragHandle.update();
  },
  onDragEndParams: [],
  onDragEnd: animateBounce,
  onDrag: syncInput });