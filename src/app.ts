import * as dotenv from 'dotenv';
import * as path from 'path';
import { Logging } from 'supernode/Base/Logging';
import { Load } from './DataModels/mod';
import { ReactionCommand, RedirectCommand } from './Commands/mod';
import { commands, getClient, setClient } from "./Globals";

import { Client, GatewayIntentBits , Message, REST, Routes } from 'discord.js';

import {db,prefix} from "./Globals";



if(hasRun) process.exit(0);
var hasRun = true;

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let cmd = async () => {
  const commands = [
    {
      name: 'ping',
      description: 'Replies with Pong!',
    },
  ];

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands("900320090732527638"), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

cmd().then(async () => {
  // Create a new Discord client with necessary intents
  setClient(new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] }));
  let client = getClient();

  // Ready event - When the bot is ready and logged in
  client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);

    commands.add(new ReactionCommand());
    commands.add(new RedirectCommand());
    commands.init();
    commands.selftest();
  });

  // Message event - Triggered whenever a message is sent in any channel the bot has access to
  client.on('messageCreate', async (message: Message) => {
    // Ignore messages from bots
    if (message.author?.bot) return;

    const [command, ...args] = message.content.slice(prefix.length).trim().split(/ +/);
    Logging.log( `Message: ${message.content}`,"INFO");
    Logging.log( `Command: ${command}, Args: ${args}`,"INFO");
    // Check if the message starts with the prefix
    if (message.content.startsWith(prefix)) {
      // Extract the command and arguments from the message 
      // Simple ping-pong command
      if (command === 'ping') {
        var all = await Load.AllData(message);
        all.user.data.count = 0 || all.user.data.count+1;
        all.channel.data.count = 0 || all.channel.data.count+1;
        await all.saveAll();
        message.reply('Pong! U ' + JSON.stringify(all.user.data));
        message.reply('Pong! C ' + JSON.stringify(all.channel.data));
      }
    }

    
    
    // Use CommandHandler to check if the command should be executed
    commands.execute(message);
  });
  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'ping') {
      await interaction.reply('Pong!');
    }
  });

  // Log in to Discord with your bot token
  client.login(process.env.TOKEN);
  
}).catch(console.error);
