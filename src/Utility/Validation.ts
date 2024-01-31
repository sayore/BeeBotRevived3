export class Validation {
  static checkIfDiscordId(id: string): boolean {
    return /^[0-9]{16,22}$/.test(id);
  }
} //[0-9]{15,20}