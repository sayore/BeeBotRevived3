import { DataModelType } from "../Enum";
import { db, getClient } from "../Globals";
import { BaseDataModel } from "./BaseDataModel";
import { AllData } from "./Load";

export enum RolePermission {
  None = 0,
  Trusted = 1,
  Moderator = 2,
  Admin = 4,
  Owner = 8,
  Bot = 16,

  Creator = 32,
  Developer = 64,
  Tester = 128,
  Support = 256,
  Contributor = 512
}

export class RoleData extends BaseDataModel {
  myType = DataModelType.Role;
  data: {
    permission: number[];
  };

  public hasPermission(permission: RolePermission): boolean {
    return this.data.permission.includes(permission);
  }

  public addPermission(permission: RolePermission): void {
    if(!this.hasPermission(permission)) {
      this.data.permission.push(permission);
    }
  }

  public async addRoleToUser(user: string, throwIfRoleOwned: boolean = false) {
    // Check if role exists, throw error if not
    // Check if user exists, throw error if not
    // Check if user has role, throw error if yes
    // Add role to user
    // Save

    // get the guild id from the role id
    const guildId = await getClient().guilds.cache.find(guild => guild.roles.cache.has(this.id)).id;

    if(!getClient().guilds.cache.get(guildId).roles.cache.has(this.id)) 
      throw new Error("Role does not exist");
    if(!getClient().guilds.cache.get(guildId).members.cache.has(user)) 
      throw new Error("User does not exist");
    if(throwIfRoleOwned && getClient().guilds.cache.get(guildId).members.cache.get(user).roles.cache.has(this.id)) 
      throw new Error("User already has role");

    await getClient().guilds.cache.get(guildId).members.cache.get(user).roles.add(this.id);
  }
  public async removeRoleFromUser(user: string, throwIfRoleNotOwned: boolean = false) {
    // Check if role exists, throw error if not
    // Check if user exists, throw error if not
    // Check if user has role, throw error if yes
    // Remove role from user
    // Save

    // get the guild id from the role id
    const guildId = await getClient().guilds.cache.find(guild => guild.roles.cache.has(this.id)).id;

    if(!getClient().guilds.cache.get(guildId).roles.cache.has(this.id)) 
      throw new Error("Role does not exist");
    if(!getClient().guilds.cache.get(guildId).members.cache.has(user)) 
      throw new Error("User does not exist");
    if(throwIfRoleNotOwned && !getClient().guilds.cache.get(guildId).members.cache.get(user).roles.cache.has(this.id))
      throw new Error("User does not have role");

    await getClient().guilds.cache.get(guildId).members.cache.get(user).roles.remove(this.id);
  }
  public async listRoles(guild: string, user?: string) {
    // Return list of roles for user, or all roles if no user
    // Save
    if(user) {
      return getClient().guilds.cache.get(guild).members.cache.get(user).roles.cache.map(role => role.name).join(", ");
    } else {
      return getClient().guilds.cache.get(guild).roles.cache.map(role => role.name).join(", ");
    }
  }
  public async help(msg: any, args: any) {
    throw new Error("Method not implemented.");
  }

  public save(): Promise<void> {
    return super.save();
  }
  public delete(): Promise<void> {
    return super.delete();
  }
}