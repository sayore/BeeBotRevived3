import { Command, ICommand } from "./Command";

// Collection of Commands to be used by the bot
export class CommandCollection {
  items : Map<string, Command> = new Map(); //new Map<string, typeof

  add(cmd: Command) {
    this.items.set(cmd.name, cmd);
  }

  combine(collection: CommandCollection) {
    collection.items.forEach((cmd, name) => {
      this.items.set(name, cmd);
    });
  }
}