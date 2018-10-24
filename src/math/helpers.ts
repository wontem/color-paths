/**
 * Linear interpolation of value [0, 1] => [v0, v1]
 *
 * @export
 * @param {number} t input value in range [0, 1]
 * @param {number} v0 lower bound of result value
 * @param {number} v1 upper bound of result value
 * @returns {number} result value in range [v0, v1]
 */
export function lerp(t: number, v0: number, v1: number): number {
  return (1 - t) * v0 + t * v1;
}

/**
 * Normalizes value [v0, v1] => [0, 1]
 *
 * @export
 * @param {number} t input value on scale
 * @param {number} v0 lower bound of scale
 * @param {number} v1 upper bound of scale
 * @returns {number} result value in range [0, 1]
 */
export function norm(t: number, v0: number, v1: number): number {
  return (t - v0) / (v1 - v0);
}

/**
 * Re-maps a number from one range to another [v0, v1] => [s0, s1].
 *
 * @export
 * @param {number} t input value in range [v0, v1]
 * @param {number} v0 lower bound of input value
 * @param {number} v1 upper bound of input value
 * @param {number} s0 lower bound of result value
 * @param {number} s1 upper bound of result value
 * @returns {number} result value in range [s0, s1]
 */
export function map(t: number, v0: number, v1: number, s0: number, s1: number): number {
  return lerp(norm(t, v0, v1), s0, s1);
}
