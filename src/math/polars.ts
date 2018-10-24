/**
 * Polar coordinated into cartesian
 *
 * @export
 * @param {number} phi number in radians
 * @param {number} p scale
 * @returns {[number, number]} [x, y]
 */
export function circle(phi: number, p: number): [number, number] {
  return [
    Math.cos(phi) * p,
    Math.sin(phi) * p,
  ];
}

export function superEllipse(phi: number, a: number, b: number, n: number): [number, number] {
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);

  const f1 = Math.sign(cos) * Math.abs(cos) ** (2 / n);
  const f2 = Math.sign(sin) * Math.abs(sin) ** (2 / n);

  return [
    f1 * a,
    f2 * b,
  ];
}

export function superFormula(
  phi: number,
  a: number,
  b: number,
  m1: number,
  m2: number,
  n1: number,
  n2: number,
  n3: number,
): [number, number] {
  const f1 = Math.abs(Math.cos(m1 * phi / 4) / a) ** n2;
  const f2 = Math.abs(Math.sin(m2 * phi / 4) / b) ** n3;
  const fr = (f1 + f2) ** (-1 / n1);

  return circle(phi, fr);
}

export function cissoid(phi: number, a: number): [number, number] {
  const f = 2 * a * Math.sin(phi) ** 2;

  return [
    f,
    f * Math.tan(phi),
  ];
}

export function astroid(phi: number, a: number): [number, number] {
  return [
    a * Math.sin(phi) ** 3,
    a * Math.cos(phi) ** 3,
  ];
}

export function kampyle(phi: number, a: number): [number, number] {
  const sec = a / Math.sin(phi);

  return [
    sec,
    Math.tan(phi) * sec,
  ];
}

export function rectHyperbola(phi: number): [number, number] {
  const sec = 1 / Math.sin(phi);

  return [
    sec,
    Math.tan(phi),
  ];
}
