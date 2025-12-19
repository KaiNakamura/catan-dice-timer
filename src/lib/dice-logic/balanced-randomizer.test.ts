import { describe, it, expect } from "vitest";
import { BalancedRandomizer } from "./balanced-randomizer";

describe("BalancedRandomizer", () => {
  it("should create bucket with exactly 36 unique permutations", () => {
    const randomizer = new BalancedRandomizer();

    // Initial state should be empty
    expect(randomizer.getBucket()).toHaveLength(0);

    // Roll once to trigger bucket creation
    const firstRoll = randomizer.roll();

    // Bucket should now have 35 items (36 - 1 popped)
    const bucket = randomizer.getBucket();
    expect(bucket).toHaveLength(35);

    // Verify no duplicates in bucket
    const bucketStrings = bucket.map(([a, b]) => `${a},${b}`);
    const bucketSet = new Set(bucketStrings);
    expect(bucketSet.size).toBe(35);

    // Verify all combinations are valid (1-6 range)
    bucket.forEach(([die1, die2]) => {
      expect(die1).toBeGreaterThanOrEqual(1);
      expect(die1).toBeLessThanOrEqual(6);
      expect(die2).toBeGreaterThanOrEqual(1);
      expect(die2).toBeLessThanOrEqual(6);
    });

    // Verify all 36 combinations are present (firstRoll + bucket = all 36)
    const allCombinations = new Set([
      `${firstRoll[0]},${firstRoll[1]}`,
      ...bucketStrings,
    ]);
    expect(allCombinations.size).toBe(36);

    // Verify we have all possible combinations (1-6 x 1-6)
    const expectedCombinations = new Set<string>();
    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 6; j++) {
        expectedCombinations.add(`${i},${j}`);
      }
    }
    expect(allCombinations).toEqual(expectedCombinations);
  });

  it("should reshuffle bucket when empty", () => {
    const randomizer = new BalancedRandomizer();

    // Initial state should be empty
    expect(randomizer.getBucket()).toHaveLength(0);

    // Roll once
    randomizer.roll();
    expect(randomizer.getBucket()).toHaveLength(35);

    // Roll 35 more times (consuming all remaining items)
    for (let i = 0; i < 35; i++) {
      randomizer.roll();
    }

    // Bucket should be empty (all 36 items consumed)
    expect(randomizer.getBucket()).toHaveLength(0);

    // Roll once more (should trigger repopulation)
    randomizer.roll();

    // Bucket should be 35 again (new bucket created with one item popped)
    expect(randomizer.getBucket()).toHaveLength(35);
  });
});

