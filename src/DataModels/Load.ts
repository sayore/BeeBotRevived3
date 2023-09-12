import { Message } from "discord.js";
import { BaseDataModel } from "./BaseDataModel";
import { ChannelData } from "./ChannelData";
import { GuildData } from "./GuildData";
import { UserData } from "./UserData";
import { RoleData } from "./RoleData";

export class AllData {
  user:UserData;
  channel:ChannelData;
  guild:GuildData;
  async saveAll() {
    await this.user.save();
    await this.channel.save();
    await this.guild.save();
  }
}


export class Load {
  static async AllData(msg:Message) : Promise<AllData> {
    const user = await Load.UserData(msg.author.id);
    const channel = await Load.ChannelData(msg.channel.id);
    const guild = await Load.GuildData(msg.guild.id);
    var all = new AllData();
    all.user = user;
    all.channel = channel;
    all.guild = guild;
    return all;
  }
  static async RoleData(id:string) : Promise<RoleData> {
    return BaseDataModel.load(id, RoleData);
  }
  static async UserData(id:string) : Promise<UserData> {
    return BaseDataModel.load(id, UserData);
  }
  static async ChannelData(id:string) : Promise<ChannelData> {
    return BaseDataModel.load(id, ChannelData);
  }
  static async GuildData(id:string) : Promise<GuildData> {
    return BaseDataModel.load(id, GuildData);
  }
} 