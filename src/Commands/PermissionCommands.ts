import { Message, Role } from "discord.js";
import { Command } from "../Structures/Command";
import { RoleData, RolePermission } from "../DataModels/RoleData";
import { Load } from "../DataModels/Load";

export class PermissionCommand extends Command {
  async trigger(msg: Message<boolean>): Promise<boolean> {
    // Check if the message is a permission command and should be executed
    return false;
  }
  async execute(msg: Message<boolean>) : Promise<boolean | void> {
    // 

    return false;
  };
}