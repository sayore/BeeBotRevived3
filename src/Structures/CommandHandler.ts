import { Message } from "discord.js";
import { Command } from "./Command";
import { CommandCollection } from "./CommandCollection";
import { Logging } from "supernode/Base/mod";

//Class to check if a Command should be executed
export class CommandHandler {
  //Check if a Command should be executed
  static async handle(collection: CommandCollection, msg: Message) {
    // Initialize statistics, like executed, failed
    let statistics = {
      executed: 0,
      failed: 0
    };

    // Check if the message is from a bot
    if (msg.author.bot) return;

    // Loop over all commands
    for (const cmd of collection.items.values()) {
      // Check userlimitedids if the command is limited to certain users
      if (cmd.userlimitedids && cmd.userlimitedids.length > 0) {
        // Check if the user is in the list of allowed users
        if (!cmd.userlimitedids.includes(msg.author.id)) continue;
      }

      // Check grouplimitedids if the command is limited to certain groups
      if (cmd.grouplimitedids && cmd.grouplimitedids.length > 0) {
        // Check if the user is in the list of allowed groups
        if (!msg.member?.roles.cache.some(r => cmd.grouplimitedids?.includes(r.id))) continue;
      }

      // Check if triggerwords are set and if the message contains all of them
      if (cmd.triggerwords && cmd.triggerwords.length > 0) {
        // Check if the message contains all triggerwords
        if (!cmd.triggerwords.every(w => msg.content.includes(w))) continue;
      }

      // Check if triggerfunc is set and if it returns true, continue if it does
      if (cmd.triggerfunc && cmd.triggerfunc(msg)) {
        continue;
      }

      // Execute the command, and if it returns true, break out of the loop
      let result = await cmd.cmd(msg);
      if (result) {
        statistics.executed++;
        if(cmd.isHalting) break;
      } else {
        statistics.failed++;
      }
    }

    Logging.log(`Executed ${statistics.executed} commands, ${statistics.failed} failed`, "INFO");
  }
}