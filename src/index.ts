import * as dat from 'dat.gui';
import { vec2 } from 'gl-matrix';
import OpenSimplexNoise from 'open-simplex-noise';
import Field from './Field';
import Particle from './Particle';
import * as particleGenerators from './particleGenerators';
import * as math from './math/helpers';
import * as polars from './math/polars';
import * as easing from './math/easing';

// const WIDTH = window.innerWidth;
// const HEIGHT = window.innerHeight;
const WIDTH = 1240;
const HEIGHT = 1748;
// const WIDTH = Math.min(window.innerWidth, window.innerHeight);
// const HEIGHT = WIDTH;
const RATIO = 1;

const clearCanvas = () => {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.globalCompositeOperation = options.blendMode;
  field.particles = new Set();
  field.step = 0;
};

const randomRange = (min: number, max: number, step: number): number => {
  return Math.floor(math.lerp(Math.random(), min, max) / step) * step;
};

const randomBool = (): boolean => {
  return Math.random() < 0.5;
};

const options = {
  generateCount: 50,
  liveTime: 50,
  speed: 2,
  produceEveryFrame: 4,
  playZ: false,
  produceOnlyOnce: false,
  multiply: 10,
  scale: 100,
  play: true,
  power: 1,
  hue: 0,
  hueRange: 80,
  removeNegative: false,
  showZeros: true,
  opacity: 1,
  blendMode: 'source-over',
  renderingType: 'line',
  clear: clearCanvas,
  random: () => {
    clearCanvas();

    // options.generateCount = randomRange(1, 100, 1);
    // options.liveTime = randomRange(1, 100, 1);
    // options.speed = randomRange(-5, 5, 1);
    // options.produceEveryFrame = randomRange(1, 10, 1);
    // options.produceOnlyOnce = randomBool();
    // options.playZ = randomBool();
    // options.multiply = randomRange(1, 100, 1);
    options.scale = randomRange(1, 1000, 1);
    options.power = randomRange(0, 5, 1);
    options.hue = randomRange(0, 360, 1);
    options.hueRange = randomRange(0, 360, 1);
    // options.removeNegative = randomBool();
    // options.showZeros = randomBool();

    for (const controller of gui.__controllers) {
      controller.updateDisplay();
    }
  },
};

const gui = new dat.GUI();

gui.add(options, 'generateCount', 1, 100).onChange(clearCanvas);
gui.add(options, 'liveTime', 1, 100).onChange(clearCanvas);
gui.add(options, 'speed', -5, 5).onChange(clearCanvas);
gui.add(options, 'produceEveryFrame', 1, 10, 1).onChange(clearCanvas);
gui.add(options, 'produceOnlyOnce').onChange(clearCanvas);
gui.add(options, 'removeNegative').onChange(clearCanvas);
gui.add(options, 'showZeros').onChange(clearCanvas);
gui.add(options, 'playZ').onChange(clearCanvas);
gui.add(options, 'multiply', 1, 100).onChange(clearCanvas);
gui.add(options, 'scale', 1, 1000).onChange(clearCanvas);
gui.add(options, 'power', 0, 5).onChange(clearCanvas);
gui.add(options, 'hue', 0, 360).onChange(clearCanvas);
gui.add(options, 'hueRange', 0, 360).onChange(clearCanvas);
gui.add(options, 'opacity', 0, 1).onChange(clearCanvas);
gui.add(options, 'renderingType', [
  'pixel',
  'line',
]).onChange(clearCanvas);
gui.add(options, 'blendMode', [
  'source-over',
  'source-in',
  'source-out',
  'source-atop',
  'destination-over',
  'destination-in',
  'destination-out',
  'destination-atop',
  'lighter',
  'copy',
  'xor',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
]).onChange(clearCanvas);
gui.add(options, 'clear');
gui.add(options, 'random');
gui.add(options, 'play');

const fromPolar = (phi: number, length: number): vec2 => {
  const x = length * Math.cos(phi);
  const y = length * Math.sin(phi);
  return vec2.fromValues(x, y);
};

const noise = new OpenSimplexNoise(Date.now());
const noiseTransform = (position: vec2, step: number): number => {
  const n = (2 ** options.power) * noise.noise3D(position[0] / options.scale, position[1] / options.scale, options.playZ ? step / options.multiply : 0);

  return n;
};

const field = new Field((() => {

  return (particle: Particle, step: number) => {
    if (particle.age > options.liveTime) {
      return false;
    }

    const n = noiseTransform(particle.position, step);
    const angle = n * Math.PI;

    const v = [
      polars.circle(angle, 1),
      // polars.astroid(angle, 2),
      // polars.kampyle(angle, 1),
      // polars.rectHyperbola(angle),
    ].reduce(
      (acc, v) => {
        return vec2.add(
          acc,
          acc,
          v,
        );
      },
      vec2.create(),
    );

    // particle.velocity = fromPolar(angle, options.removeNegative && n < 0 ? 0 : options.speed);
    particle.velocity = vec2.scale(v, v, options.removeNegative && n < 0 ? 0 : options.speed);
    // particle.velocity = vec2.scale(v, v, options.speed);

    return true;
  };
})());

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = WIDTH * RATIO;
canvas.height = HEIGHT * RATIO;
canvas.style.height = '100%';
// canvas.style.transform = `scale(${1 / RATIO}, ${1 / RATIO})`;
canvas.style.transformOrigin = 'left top';
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';

ctx.scale(RATIO, RATIO);

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, WIDTH, HEIGHT);
ctx.lineCap = 'round';

window.addEventListener('mousemove', (e) => {
  if (e.buttons === 1) {
    field.addParticle(new Particle(vec2.fromValues(e.clientX, e.clientY)));
  }
});

window.addEventListener('click', (e) => {
  field.addParticle(new Particle(vec2.fromValues(e.clientX, e.clientY)));
});

const dots = new OpenSimplexNoise(Date.now());

const anim = () => {
  requestAnimationFrame(anim);
  if (!options.play) {
    return;
  }

  if (
    options.produceOnlyOnce ?
      field.step === 0 :
      field.step % options.produceEveryFrame === 0
  ) {
    // particleGenerators.grid(field, 100, 100, WIDTH, HEIGHT);
    particleGenerators.random(field, options.generateCount, WIDTH, HEIGHT);
  }

  for (const particle of field.particles) {
    if (!options.showZeros && particle.velocity[0] === particle.velocity[1] && particle.velocity[0] === 0) {
      continue;
    }

    let h;
    h = math.norm(particle.age / options.liveTime * options.hueRange + options.hue, 0, 360);
    // h = easing.easeOutCubic(h);
    const color = `hsla(${h * 360}, 100%, 60%, ${options.opacity})`;

    switch (options.renderingType) {
      case 'pixel': {
        ctx.fillStyle = color;
        ctx.fillRect(particle.position[0], particle.position[1], 1, 1);
        break;
      }
      case 'line': {
        // ctx.lineWidth = math.map(dots.noise2D(particle.age / 10, 0), -1, 1, 1, 8);
        ctx.lineWidth = 2;
        // ctx.lineWidth = math.map(Math.sin(particle.age / 4), -1, 1, 4, 20);
        // ctx.strokeStyle = `hsla(${normalizedSin(particle.age / 10) * 120}, 100%, 60%, 1)`;
        // ctx.strokeStyle = `hsla(0, 0%, 0%, .03)`;
        // ctx.strokeStyle = `hsla(${Math.sin(particle.age / 10) * 80 - 100 - 60}, 100%, 60%, 1)`;
        // ctx.strokeStyle = `hsla(${normalizedSin(particle.age / 10) * 360}, 100%, 60%, 1)`;
        // ctx.strokeStyle = `hsla(${Math.sin(particle.age / 10) * options.hueRange + options.hue}, 100%, 60%, ${options.opacity})`;
        ctx.strokeStyle = color;
        ctx.beginPath();
        const prevPosition = vec2.sub(vec2.create(), particle.position, particle.velocity);
        ctx.moveTo(prevPosition[0], prevPosition[1]);
        ctx.lineTo(particle.position[0], particle.position[1]);
        ctx.stroke();
        break;
      }
    }
  }

  field.tick();
};
requestAnimationFrame(anim);
