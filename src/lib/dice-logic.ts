export interface DiceRandomizer {
  roll(): [number, number];
}

export class TrueRandomRandomizer implements DiceRandomizer {
  roll(): [number, number] {
    return [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];
  }
}

export class BalancedRandomizer implements DiceRandomizer {
  private bucket: [number, number][] = [];
  
  private createBucket(): [number, number][] {
    const combinations: [number, number][] = [];
    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 6; j++) {
        combinations.push([i, j]);
      }
    }
    return this.shuffle(combinations);
  }
  
  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    // TODO: Validate logic here
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  roll(): [number, number] {
    if (this.bucket.length === 0) {
      this.bucket = this.createBucket();
    }
    return this.bucket.pop()!;
  }
  
  getBucket(): [number, number][] {
    return [...this.bucket];
  }
  
  setBucket(bucket: [number, number][]): void {
    this.bucket = bucket;
  }
}

