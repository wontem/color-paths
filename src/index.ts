import { Vector2 } from 'three';
import OpenSimplexNoise from 'open-simplex-noise';
import Field from './Field';
import Particle from './Particle';
import * as particleGenerators from './particleGenerators';
// const WIDTH = window.innerWidth;
// const HEIGHT = window.innerHeight;
// const WIDTH = 512;
// const HEIGHT = 512;

const WIDTH = Math.min(window.innerWidth, window.innerHeight);
const HEIGHT = WIDTH;
const RATIO = 2;

const field = new Field((() => {
  const noise = new OpenSimplexNoise(Date.now());

  const fromPolar = (phi: number, length: number): Vector2 => {
    const x = length * Math.cos(phi);
    const y = length * Math.sin(phi);
    return new Vector2(x, y);
  };

  return (particle: Particle, step: number) => {
    if (particle.age > 100) {
      return false;
    }

    // const n = noise.noise3D(particle.position.x / 100, particle.position.y / 100, step / 10);
    const n = noise.noise3D(particle.position.x / 100, particle.position.y / 100, 0);
    // const n = Math.random();

    particle.velocity = fromPolar(Math.abs(n) ** (-0.5) * Math.PI * 2, n < 0 ? 0 : 2);
    // particle.velocity.add(new Vector2(0, 2));

    return true;
  };
})());

// const genField = new Field((() => {
//   const noise = new OpenSimplexNoise(Date.now());

//   const fromPolar = (phi: number, length: number): Vector2 => {
//     const x = length * Math.cos(phi);
//     const y = length * Math.sin(phi);
//     return new Vector2(x, y);
//   }

//   return (particle: Particle, step: number) => {
//     const angle = noise.noise3D(particle.position.x / 100, particle.position.y / 100, 0);
//     particle.velocity = fromPolar(angle * Math.PI * 2, 10);

//     field.addParticle(new Particle(new Vector2(
//       (particle.position.x % WIDTH + WIDTH) % WIDTH,
//       (particle.position.y % HEIGHT + HEIGHT) % HEIGHT,
//     )));

//     return true;
//   };
// })());
// particleGenerators.random(genField, 1, WIDTH, HEIGHT);

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = WIDTH * RATIO;
canvas.height = HEIGHT * RATIO;
canvas.style.transform = `scale(${1 / RATIO}, ${1 / RATIO})`;
canvas.style.transformOrigin = 'left top';
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';

ctx.scale(RATIO, RATIO);

// ctx.globalCompositeOperation = 'screen';

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, WIDTH, HEIGHT);
ctx.lineCap = 'round';

window.addEventListener('mousemove', (e) => {
  if (e.buttons === 1) {
    field.addParticle(new Particle(new Vector2(e.clientX, e.clientY)));
  }
});

const normalizedSin = (angle: number) => {
  return (Math.sin(angle) + 1) / 2;
};

const normalizedCos = (angle: number) => {
  return (Math.cos(angle) + 1) / 2;
};

const anim = () => {
  if (field.step % 5 === 0) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  if (field.step % 3 === 0) {
    // particleGenerators.grid(field, 50, 50, WIDTH, HEIGHT);
    particleGenerators.random(field, 100, WIDTH, HEIGHT);
  }

  // ctx.strokeStyle = `hsl(${step % 360}, 100%, 60%)`;
  // ctx.strokeStyle = `hsl(${normalizedSin(step / 10) * 360}, 100%, 60%, ${normalizedSin(step / 19)})`;
  // ctx.strokeStyle = `rgba(${
  //   normalizedSin(step / 13) * 255
  // }, ${
  //   127
  // }, ${
  //   normalizedSin(step / 7) * 255
  // }, ${
  //   normalizedSin(step / 10)
  // })`;
  // ctx.lineWidth = 1;

  for (const particle of field.particles) {
    // ctx.lineWidth = normalizedSin(particle.age / 20) ** 80 * 5 + 1;
    // ctx.strokeStyle = `hsla(${normalizedSin(particle.age / 10) * 120}, 100%, 60%, ${1 || Math.max((12 - particle.age) / 12, 0)})`;
    ctx.strokeStyle = `hsla(${Math.sin(particle.age / 10) * 80 - 100}, 100%, 60%, 1)`;
    // ctx.strokeStyle = `hsla(${normalizedSin(particle.age / 10) * 360}, 100%, 60%, 1)`;
    ctx.beginPath();
    const prevPosition = particle.position.clone().sub(particle.velocity);
    ctx.moveTo(prevPosition.x, prevPosition.y);
    ctx.lineTo(particle.position.x, particle.position.y);
    ctx.stroke();
  }

  field.tick();
  // genField.tick();

  // for (const particle of field.particles) {
  //   updateLine(particle);
  //   drawLine(ctx, getLine(particle));
  // }

  requestAnimationFrame(anim);
};
requestAnimationFrame(anim);
