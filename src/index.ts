import OpenSimplexNoise from 'open-simplex-noise';

class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static fromPolar(phi: number, length: number) {
    const x = length * Math.cos(phi);
    const y = length * Math.sin(phi);
    return new Vector(x, y);
  }

  static add(vectorA: Vector, vectorB: Vector) {
    return new Vector(
      vectorA.x + vectorB.x,
      vectorA.y + vectorB.y,
    );
  }

  static sub(vectorA: Vector, vectorB: Vector) {
    return new Vector(
      vectorA.x - vectorB.x,
      vectorA.y - vectorB.y,
    );
  }
}

class Particle {
  position: Vector;
  velocity: Vector;

  constructor(position: Vector, velocity: Vector = new Vector(0, 0)) {
    this.position = position;
    this.velocity = velocity;
  }

  tick() {
    this.position = Vector.add(this.position, this.velocity);
  }
}

class Field {
  particles: Set<Particle>;
  noise: OpenSimplexNoise;
  step: number;

  constructor() {
    this.particles = new Set();
    this.noise = new OpenSimplexNoise(Date.now());
    this.step = 0;
  }

  addParticle(particle: Particle) {
    this.particles.add(particle);
    return this;
  }

  tick() {
    this.step += 1;
    for (const particle of this.particles) {
      // const angle = this.noise.noise3D(particle.position.x / 100, particle.position.y / 100, this.step / 10);
      const angle = this.noise.noise3D(particle.position.x / 100, particle.position.y / 100, this.step / 10);
      particle.velocity = Vector.fromPolar(angle * Math.PI * 2, 2);
      // particle.velocity = Vector.add(particle.velocity, new Vector(4, 1));

      particle.tick();

      // NEED TO REMOVE IT
      if (
        particle.position.x > WIDTH ||
        particle.position.x < 0 ||
        particle.position.y > HEIGHT ||
        particle.position.y < 0
      ) {
        getLine(particle, true);
        particle.position.x = (particle.position.x + WIDTH) % WIDTH;
        particle.position.y = (particle.position.y + HEIGHT) % HEIGHT;
      }
    }
  }
}

const lines = new WeakMap<Particle, Vector[]>();

const getLine = (particle: Particle, forceReset: boolean = false): Vector[] => {
  if (lines.has(particle) && !forceReset) {
    return lines.get(particle);
  } else {
    const line = new Array(50).fill(particle.position);
    lines.set(particle, line);
    return line;
  }
}

const updateLine = (particle: Particle) => {
  const line = getLine(particle);

  line.shift();
  line.push(particle.position);
}

const drawLine = (ctx: CanvasRenderingContext2D, line: Vector[]) => {
  ctx.beginPath();
  ctx.moveTo(line[0].x, line[0].y);

  for (let index = 1; index < line.length; index++) {
    const point = line[index];
    ctx.lineTo(point.x, point.y);
  }

  ctx.stroke();
}


// const WIDTH = window.innerWidth;
// const HEIGHT = window.innerHeight;

const WIDTH = Math.min(window.innerWidth, window.innerHeight);
const HEIGHT = WIDTH;
const RATIO = 2;
const STEP = 50;

const field = new Field();

for (let indexX = 0; indexX < WIDTH / STEP; indexX++) {
  for (let indexY = 0; indexY < HEIGHT / STEP; indexY++) {
    // const particle = new Particle(new Vector((indexX + 0.5) * STEP, (indexY + 0.5) * STEP));
    const particle = new Particle(new Vector(Math.random() * WIDTH, Math.random() * HEIGHT));
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


  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
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

  // ctx.beginPath();
  // for (const particle of field.particles) {
  //   const prevPosition = Vector.sub(particle.position, particle.velocity);
  //   ctx.moveTo(prevPosition.x, prevPosition.y);
  //   ctx.lineTo(particle.position.x, particle.position.y);
  // }
  // ctx.stroke();

  for (const particle of field.particles) {
    updateLine(particle);
    drawLine(ctx, getLine(particle));
  }

  step += 1;
  requestAnimationFrame(anim);
}
requestAnimationFrame(anim);

