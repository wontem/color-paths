import { Vector2 } from 'three';
import OpenSimplexNoise from 'open-simplex-noise';
import Field from './Field';
import Particle from './Particle';
import * as particleGenerators from './particleGenerators';

import imgSrc from './map.png';

// const WIDTH = window.innerWidth;
// const HEIGHT = window.innerHeight;
const WIDTH = 512;
const HEIGHT = 512;

// const WIDTH = Math.min(window.innerWidth, window.innerHeight);
// const HEIGHT = WIDTH;
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

    const x = Math.floor(particle.position.x);
    const y = Math.floor(particle.position.y);
    const angle = brightness && brightness[x] && typeof brightness[x][y] === 'number' ?
      brightness[x][y] :
      0;

    particle.velocity = fromPolar(angle * Math.PI * 2, 2);
    particle.velocity.add(new Vector2(2, 0));

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

const getBrightness = (imagePath: string): Promise<number[][]> => new Promise((resolve) => {
  const img = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const onLoad = () => {
    img.removeEventListener('load', onLoad);
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData: number[][] = [];

    for (let x = 0; x < canvas.width; x += 1) {
      const row: number[] = [];
      imageData.push(row);

      for (let y = 0; y < canvas.width; y += 1) {
        const pixel = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = pixel.data;

        row.push((0.2126 * r + 0.7152 * g + 0.0722 * b) / 256);
      }
    }

    resolve(imageData);
  };
  img.addEventListener('load', onLoad);
  img.src = imagePath;
});

let brightness: number[][] = null;

getBrightness(imgSrc).then((brightnessMap) => {
  brightness = brightnessMap;
  // particleGenerators.random(field, , WIDTH, HEIGHT);
});

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
