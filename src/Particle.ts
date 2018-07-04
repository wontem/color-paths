import { vec2 } from 'gl-matrix';

export default class Particle {
  position: vec2;
  velocity: vec2;
  age: number;

  constructor(position: vec2, velocity: vec2 = vec2.create()) {
    this.position = position;
    this.velocity = velocity;
    this.age = 0;
  }
}
