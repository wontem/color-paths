import { vec2 } from 'gl-matrix';

// tslint:disable

export const astroid = (n: number): vec2 => {
  const xt = Math.sin(n) ** 3;
  const yt = Math.cos(n) ** 3;

  return vec2.fromValues(xt, yt);
};

export const cissoid = (n: number): vec2 => {
  const sinn2 = 2 * (Math.sin(n) ** 2);

  const xt = sinn2;
  const yt = sinn2 * Math.tan(n);

  return vec2.fromValues(xt, yt);
};

export const kampyle = (n: number): vec2 => {
  const sec = 1 / Math.sin(n);

  const xt = sec;
  const yt = Math.tan(n) * sec;

  return vec2.fromValues(xt, yt);
};

export const rect_hyperbola = (n: number): vec2 => {
  const sec = 1 / Math.sin(n);

  const xt = 1 / Math.sin(n);
  const yt = Math.tan(n);

  return vec2.fromValues(xt, yt);
};

const superformula_a = 1;
const superformula_b = 1;
const superformula_m = 6;
const superformula_n1 = 1;
const superformula_n2 = 7;
const superformula_n3 = 8;
export const superformula = (n: number): vec2 => {
  const f1 = Math.pow(Math.abs(Math.cos(superformula_m * n / 4) / superformula_a), superformula_n2);
  const f2 = Math.pow(Math.abs(Math.sin(superformula_m * n / 4) / superformula_b), superformula_n3);
  const fr = Math.pow(f1 + f2, -1 / superformula_n1);

  const xt = Math.cos(n) * fr;
  const yt = Math.sin(n) * fr;

  return vec2.fromValues(xt, yt);
};
