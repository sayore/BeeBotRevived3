import { RoleData } from "../DataModels/RoleData";
import { Load } from "../DataModels/mod";
import { prefix } from "../Globals";
import { Command } from "../Structures/Command";

export class RoleCommands extends Command {
  async trigger(msg) {
    let [command, ...args] = msg.content.slice(prefix.length).trim().split(/ +/);

    let possibleCommands = ["addRole", "removeRole", "listRoles", "help"];
    if (possibleCommands.includes(command)) {
      return true;
    }
  }
  async execute(msg) {
    // switch case and handle commands
    let [command, ...args] = msg.content.slice(prefix.length).trim().split(/ +/);
    switch (args[0]) {
      case "addRole":
        (await Load.RoleData(args[1])).addRoleToUser(args[2]);
        return true;
      case "removeRole":
        (await Load.RoleData(args[1])).removeRoleFromUser(args[2]);
        return true;
      case "listRoles":
      //return this.listRoles(msg, args);
      case "help":
      //return this.help(msg, args);
      default:
      //return this.help(msg, args);
    }
    return false;
  }
  public async onLite(args) : Promise<boolean> {
    // switch case and handle commands

    switch (args[0]) {
      case "addRole":
        (await Load.RoleData(args[1])).addRoleToUser(args[2]);
      case "removeRole":
        (await Load.RoleData(args[1])).removeRoleFromUser(args[2]);
      case "listRoles":
      //return this.listRoles(msg, args);
      case "help":
      //return this.help(msg, args);
      default:
      //return this.help(msg, args);
    }
    return true;
  }
}