export class RandomUtils {
  static getRandomItem<T>(arrayLike: ArrayLike<T>): T | null {
    if (arrayLike.length === 0) {
      return null;
    }
    const index = Math.floor(Math.random() * arrayLike.length);
    const item = arrayLike[index];
    if (item === undefined) {
      return null;
    }
    return item;
  }

  static getWeightedRandomItem<T extends { weight?: number }>(arrayLike: ArrayLike<T>): T | null {
    if (arrayLike.length === 0) {
      return null;
    }
    const totalWeight = Array.from(arrayLike).reduce((a, b) => a + (b.weight !== undefined ? b.weight : 1), 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < arrayLike.length; i++) {
      const weight = arrayLike[i].weight !== undefined ? arrayLike[i].weight : 1;
      if (random < weight) {
        return arrayLike[i];
      }
      random -= weight;
    }
    return null;
  }

  static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getRandomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  static shuffleArray<T>(array: Array<T>): Array<T> {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  static getRandomSubset<T>(array: Array<T>, size: number): Array<T> {
    const shuffled = RandomUtils.shuffleArray(array);
    return shuffled.slice(0, size);
  }
}