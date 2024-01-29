import { getClient } from "../Globals";
import { DataModelType } from "../Enum";
import { db } from "../Globals";
import { BaseDataModel } from "./BaseDataModel";

export class UserData extends BaseDataModel {
  myType = DataModelType.User;
  data: {
    count: number;
    tag: string;
    username: string;
    /**
     * Guild ID -> Nickname
     */
    nickname: Map<string, string>;
    color: string;
    rpg: {
      xp: number;
    }
  };

  public save(): Promise<void> {
    return super.save();
  }
  public delete(): Promise<void> {
    return super.delete();
  }

  async getUsername(): Promise<string> {
    // Fetch username via id from discord
    // not from this object
    
    return await getClient().users.fetch(this.id).then((user) => {
      this.data.username = user.username;
      return user.username;
    });
  }

  async getNickname(guild: string): Promise<string> {
    // Fetch nickname via id from discord
    // Fall back to username
    // not from this object

    // Check if nickname map exists, if not create it
    if(!this.data.nickname) {
      this.data.nickname = new Map<string, string>();
    }
    
    return await getClient().guilds.fetch(guild).then((guild) => {
      return guild.members.fetch(this.id).then((member) => {
        if(member.nickname) {
          this.data.nickname.set(guild.id, member.nickname);
          return member.nickname;
        } else {
          return this.getUsername();
        }
      });
    });
  }
}

