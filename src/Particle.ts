import * as THREE from 'three';

export default class Particle {
  position: THREE.Vector2;
  velocity: THREE.Vector2;

  constructor(position: THREE.Vector2, velocity: THREE.Vector2 = new THREE.Vector2(0, 0)) {
    this.position = position;
    this.velocity = velocity;
  }

  tick() {
    this.position.add(this.velocity);
  }
}
