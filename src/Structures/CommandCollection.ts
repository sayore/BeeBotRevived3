import { Message } from "discord.js";
import { Command, ICommand } from "./Command";
import { Logging } from "supernode/Base/Logging";

// Collection of Commands to be used by the bot
export class CommandCollection {
  items : Map<string, Command> = new Map(); //new Map<string, typeof

  init() {
    this.items.forEach((cmd, name) => {
      cmd.onInit(false);
    });
  }

  selftest() {
    this.items.forEach((cmd, name) => {
      cmd.onSelftest(false);
    });
  }

  add(cmd: Command) {
    this.items.set(cmd.name, cmd);
  }

  combine(collection: CommandCollection) {
    collection.items.forEach((cmd, name) => {
      this.items.set(name, cmd);
    });
  }

  async execute(msg: Message) {
    // Initialize statistics, like executed, failed
    let statistics = {
      executed: 0,
      failed: 0,
      checked: 0
    };

    // Check if the message is from a bot
    if (msg.author.bot) return;

    // Loop over all commands
    for (const cmd of this.items.values()) {
      //console.log("Checking... "+cmd.name)
      // Check userlimitedids if the command is limited to certain users
      if (!cmd.userlimitedids || cmd.userlimitedids.length > 0) {
        // Check if the user is in the list of allowed users
        if (!cmd.userlimitedids.includes(msg.author.id)) continue;
      }
      //console.log("A... ")
      // Check grouplimitedids if the command is limited to certain groups
      if (!cmd.grouplimitedids || cmd.grouplimitedids.length > 0) {
        // Check if the user is in the list of allowed groups
        if (!msg.member?.roles.cache.some(r => cmd.grouplimitedids?.includes(r.id))) continue;
      }
      
      //console.log("B... ")
      // Check if triggerwords are set and if the message contains all of them
      if (!cmd.triggerwords || cmd.triggerwords.length > 0) {
        // Check if the message contains all triggerwords
        if (!cmd.triggerwords.every(w => msg.content.includes(w))) continue;
      }
      
      //console.log("C... ")
      // Check if triggerfunc is set and if it returns true, continue if it does
      if (!cmd.trigger || await cmd.trigger(msg) === false) {
        statistics.checked++;
        continue;
      }
      
      //console.log("D... ")
      // Execute the command, and if it returns true, break out of the loop
      let result = await cmd.execute(msg);
      //console.log("Executed... ")
      if (result) {
        statistics.executed++;
        if(cmd.isHalting) break;
      } else {
        statistics.failed++;
      }
    }

    Logging.log(`Executed ${statistics.executed} commands, ${statistics.failed} failed, ${statistics.checked} checked`, "INFO");
  }
}