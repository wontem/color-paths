import * as THREE from 'three';

export default class Particle {
  position: THREE.Vector2;
  velocity: THREE.Vector2;
  age: number;

  constructor(position: THREE.Vector2, velocity: THREE.Vector2 = new THREE.Vector2(0, 0)) {
    this.position = position;
    this.velocity = velocity;
    this.age = 0;
  }
}
