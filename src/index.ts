import * as THREE from 'three';
import Field from './Field';
import Particle from './Particle';



// const WIDTH = window.innerWidth;
// const HEIGHT = window.innerHeight;

const WIDTH = Math.min(window.innerWidth, window.innerHeight);
const HEIGHT = WIDTH;
const RATIO = 2;
const STEP = 50;

const field = new Field();

for (let indexX = 0; indexX < WIDTH / STEP; indexX++) {
  for (let indexY = 0; indexY < HEIGHT / STEP; indexY++) {
    // const particle = new Particle(new Three.Vector2((indexX + 0.5) * STEP, (indexY + 0.5) * STEP));
    const particle = new Particle(new THREE.Vector2(Math.random() * WIDTH, Math.random() * HEIGHT));
    field.addParticle(particle);
  }
}

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

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, WIDTH, HEIGHT);
// ctx.lineCap = 'round';

const normalizedSin = (angle: number) => {
  return (Math.sin(angle) + 1) / 2;
}

let step = 0;
const anim = () => {
  field.tick();


  // ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  // ctx.fillRect(0, 0, WIDTH, HEIGHT);
  // ctx.strokeStyle = `hsl(${step % 360}, 100%, 60%)`;
  ctx.strokeStyle = `hsl(${normalizedSin(step / 10) * 360}, 100%, 60%)`;
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
  // ctx.lineWidth = normalizedSin(step / 2) * 5 + 1;
  ctx.lineWidth = 1;

  ctx.beginPath();
  for (const particle of field.particles) {
    const prevPosition = particle.position.clone().sub(particle.velocity);
    ctx.moveTo(prevPosition.x, prevPosition.y);
    ctx.lineTo(particle.position.x, particle.position.y);
  }
  ctx.stroke();

  // for (const particle of field.particles) {
  //   updateLine(particle);
  //   drawLine(ctx, getLine(particle));
  // }

  step += 1;
  requestAnimationFrame(anim);
}
requestAnimationFrame(anim);

