import { EmbedBuilder, Message } from 'discord.js';
import { Command } from '../Structures/Command';
import { prefix } from '../Globals';
import { Load } from '../DataModels/mod';
import { RedirectError } from '../Structures/Error';
import { Logging } from 'supernode/Base/mod';

export class RedirectCommand extends Command {
  name="RedirectCommand"
  constructor() {
    super();
  }
  public onSelftest(silent: boolean): Promise<void> {
    Logging.log("Selftest: "+this.name,"INFO");

    return;
  }

  public async trigger(msg: Message<boolean>): Promise<boolean|undefined> {
    // Check different reaction states (like kiss, hug, cuddle, etc.)
    // Return true if the reaction is contained in a list of reaction strings
    // Else return false
    let [command, ...args] = msg.content.slice(prefix.length).trim().split(/ +/);

    let guild = await Load.GuildData(msg.guild.id);
    if(guild.data.redirects.has(msg.channel.id)) {
      let redirect = guild.data.redirects.get(msg.channel.id);
      
      let targetChannel = msg.guild.channels.cache.get(redirect.to);
      if(targetChannel.isTextBased()) {
        let messageContent = msg.content;
        
        var createdEmbed = new EmbedBuilder()
          .setColor('#FFD35D')
          .setDescription(messageContent)
          .setAuthor({name:msg.author.username, iconURL:msg.author.avatarURL(), url:msg.author.avatarURL()})
        await targetChannel.send({embeds:[createdEmbed]});
        await msg.delete();
      }
    }

    //console.log("A1")
    if(command != "redirect") return false;
    //console.log("B1")
    let options = ["add", "remove", "list", "help"];
    //console.log("D1")
    if(!options.includes(args[0].toLowerCase())) return false;
    //console.log("E1")

    return true;
  }
  async execute(msg: Message<boolean>): Promise<boolean | void> {
    let [command, ...args] = msg.content.slice(prefix.length).trim().split(/ +/);
    //console.log(command + " " + args[0])
    var data = await Load.AllData(msg);
    var redirectReply : RedirectError | void = undefined;

    switch(args[0].toLowerCase()) {
      case "add":
        try {
          //console.log(command + " A")
          await msg.reply("Redirect added (Started)");
          //console.log(command + " B")
          redirectReply = await data.guild.addRedirect(args[1], args[2], args[3] ?? undefined);
          //console.log(command + " C")
          await msg.reply("Redirect added");
        } catch (error) {
          if(error instanceof RedirectError)
          await msg.reply(error.cause);

          //console.log(error)
        }
        break;
      case "remove":
        try {
          redirectReply = await data.guild.removeRedirect(args[1]); 
          msg.reply("Redirect removed");
        } catch (error) {
          if(error instanceof RedirectError)
          msg.reply(error.cause);
        }
        break;
      case "changereply":
        try {
          redirectReply = await data.guild.changeReplyOfRedirect(args[1], args[2]);
          msg.reply("Reply changed");
        } catch (error) {
          if(error instanceof RedirectError)
          msg.reply(error.cause);
        }
        break;
      case "list":
        
          await msg.reply(await data.guild.listRedirects() + " -RPEL");
        break;
      case "help":
        msg.reply(
          "Here are the available commands for redirect:\n\n" +
          "- To add a redirect, use the following syntax:\n" +
          "`redirect add <sourceChannel> <destinationChannel> [message]`\n\n" +
          "- To remove a redirect, use the following syntax:\n" +
          "`redirect remove <sourceChannel> <destinationChannel> [message]`\n\n" +
          "- To list all redirects, use the following syntax:\n" +
          "`redirect list`\n\n" +
          "- For help with redirect commands, use the following syntax:\n" +
          "`redirect help`"
        );
        break;
    }
    if(redirectReply instanceof RedirectError) {
      msg.reply(redirectReply.cause);
      return false;
    }
    //console.log(data.guild.data)
    data.guild.data.random = Math.random();
    //await data.saveAll();
    await data.guild.save();

    var data = await Load.AllData(msg);
    //console.log(data.guild.data)

    return false;
  };
}