import type { DiceRandomizer } from "./dice-randomizer";

export class TrueRandomRandomizer implements DiceRandomizer {
  roll(): [number, number] {
    return [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];
  }
}

