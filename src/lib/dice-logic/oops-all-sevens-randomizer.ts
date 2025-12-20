import type { DiceRandomizer } from "./dice-randomizer";

/**
 * A test randomizer not intended for actual use. Mainly used for testing the
 * robber dialog.
 */
export class OopsAllSevensRandomizer implements DiceRandomizer {
  roll(): [number, number] {
    const possibleValues: [number, number][] = [[1, 6], [2, 5], [3, 4], [4, 3], [5, 2], [6, 1]];
    return possibleValues[Math.floor(Math.random() * possibleValues.length)];
  }
}

