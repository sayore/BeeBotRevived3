import { Message, Role } from "discord.js";
import { Command } from "../Structures/Command";
import { RoleData, RolePermission } from "../DataModels/RoleData";
import { Load } from "../DataModels/Load";

export class AddPermissionToRoleCommand extends Command {
  async triggerfunc(msg: Message<boolean>): Promise<boolean> {
    // Check msg.member if null
    if (msg.member === null) {
      return false;
    }

    // Check if guild is null
    if (msg.guild === null) {
      return false;
    }

    // If no admin permission has ever been set on the Guild, return true
    const guildData = await Load.GuildData(msg.guild.id);
    if (guildData.data.adminRoleHasBeenSet === undefined) {
      return true;
    }

    // If user has a role that has the admin permission(see RoleData), he is allowed to use this command
    // So we loop through all the roles the user has and check if one of them has the admin permission
    // - If the RoleData of the role has the admin permission, return true
    // - Get RoleData of the role
    // - If the role has the admin permission, return true
    // Else return false

    for (let i = 0; i < msg.member.roles.cache.size; i++) {
      const role: Role = msg.member.roles.cache.values()[i];
      const roleData: RoleData = await Load.RoleData(role.id);
      if (roleData.hasPermission(RolePermission.Admin)) {
        return true;
      }
    }
    
    return false;
  }
  async cmd(msg: Message<boolean>) : Promise<boolean | void> {
    // Add permission to role
    // - Get the role
    // - Get the RoleData of the role
    // - Add the permission to the RoleData
    // - Save the RoleData
    // - Return true

    // Get the role

    return false;
  };
}