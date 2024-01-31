import { DataModelType } from "../Enum";
import { db, getClient } from "../Globals";
import { BaseDataModel } from "./BaseDataModel";
import { ChannelErrorMessage, RedirectError } from "../Structures/Error";
import { Validation } from "../Utility/Validation";

export class GuildData extends BaseDataModel {
  
  myType = DataModelType.Guild;
  data: {
    random: number;
    adminRoleHasBeenSet: boolean;
    redirects: Map<string, {to:string, reply:string|undefined}>;
  };

  public afterLoad(): void {
    if(this.data.redirects === undefined) this.data.redirects = new Map<string, {to:string, reply:string|undefined}>();
    if(!this.data.redirects.set) this.data.redirects = new Map<string, {to:string, reply:string|undefined}>(Object.entries(this.data.redirects));
  }
  public save(): Promise<void> {
    return super.save();
  }
  public delete(): Promise<void> {
    return super.delete();
  }

  public async addRedirect(channelFrom: string, channelTo: string, reply:string|undefined): Promise<void | RedirectError> {
    // Add redirect to channelFrom
    // Add redirect to channelTo
    // Save

    if (Validation.checkIfDiscordId(channelFrom) === false) throw new RedirectError(404, ChannelErrorMessage.NotAValidChannel, { channelFrom });
    if (Validation.checkIfDiscordId(channelTo) === false) throw new RedirectError(404, ChannelErrorMessage.NotAValidChannel, { channelTo });
    if (!await this.channelExists(channelFrom)) throw new RedirectError(404, ChannelErrorMessage.ChannelFromNotExist, { channelFrom });
    if (!await this.channelExists(channelTo)) throw new RedirectError(404, ChannelErrorMessage.ChannelFromNotExist, { channelFrom });
    if (channelFrom === channelTo) throw new RedirectError(302, ChannelErrorMessage.SameChannels, { channelFrom });
    //if (this.receivesRedirects(channelFrom)) throw new RedirectError(301, ChannelErrorMessage.ChannelReceiving, { channelFrom });
    //if (this.sendRedirects(channelTo)) throw new RedirectError(301, ChannelErrorMessage.ChannelRedirected, { channelFrom });

    // Add redirect to channelFrom
    this.data.redirects.set(channelFrom, { to: channelTo, reply });

    return;
  }

  public async changeReplyOfRedirect(channelFrom: string, newReply: string): Promise<void | RedirectError> {
    if (!this.channelExists(channelFrom)) throw new RedirectError(404, ChannelErrorMessage.ChannelFromNotExist, { channelFrom });
    if (!this.receivesRedirects(channelFrom)) throw new RedirectError(404, ChannelErrorMessage.ChannelNotRedirected, { channelFrom });

    const redirect = this.data.redirects.get(channelFrom);
    if (redirect) {
      redirect.reply = newReply;
    }
  }

  public async listRedirects(): Promise<string> {
    let result = "";
    this.data.redirects.forEach((redirect, channelFrom) => {
      result += `<#${channelFrom}> -> <#${redirect.to}>\n`;
      if (redirect.reply) {
        result += `with reply msg: "${redirect.reply}"\n`;
      }
    });
    return result;
  }

  public async removeRedirect(channelFrom: string): Promise<void | RedirectError> {
    this.data.redirects.delete(channelFrom);
  }

  public async channelExists(channel: string): Promise<boolean> {
    try {
      const guild = await getClient().guilds.fetch(this.id);
      console.log("Looking up .. Channel "+channel + " in guild "+this.id + "(name " +guild.name+")");
      guild.channels.resolveId(channel);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async receivesRedirects(channel: string): Promise<boolean> {
    if(Array.from(this.data.redirects.values()).find((redirect) => redirect.to === channel) !== undefined) {
      return true;
    }
    return false;
  }

  public async sendRedirects(channel: string): Promise<boolean> {
    return this.data.redirects.has(channel);
  }
}