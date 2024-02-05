import { Logging } from "supernode/Base/mod";
import { Command } from "../Structures/Command";

export class GuildCommand extends Command {
    async onInit(silent) { }
    async onSelftest(silent) { }
    async onLite(args) { return false; }
    async onInteraction(interaction) { 
      // ping pong
      if(interaction.commandName === "ping") {
        interaction.reply("Pong!");
        return true;
      }
      return false;
    }
    
    async onReaction(reaction) { return false; }
    
    async onRegisterSlashCommands() { return [
      {
        name: 'ping',
        description: 'Replies with Pong!',
      },
    ]; }
    
    async trigger(msg) { return false; }
    async execute(msg) { Logging.log("Command cmd not overridden but cmd executed. (" + this.name + ")"); return false; }
}