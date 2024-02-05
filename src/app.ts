import * as dotenv from 'dotenv';
import * as path from 'path';
import { Logging } from 'supernode/Base/Logging';
import { Load } from './DataModels/mod';
import { GuildCommand, ReactionCommand, RedirectCommand } from './Commands/mod';
import { commands, getClient, setClient } from "./Globals";

import { Client, GatewayIntentBits , Message, REST, Routes, SlashCommandBuilder } from 'discord.js';

import {db,prefix} from "./Globals";



if(hasRun) process.exit(0);
var hasRun = true;

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let cmd = async () => {
  commands.add(new ReactionCommand());
  commands.add(new RedirectCommand());
  commands.add(new GuildCommand());

  let slashCommands = [];

  let slashCommandsCollected = await commands.onRegisterSlashCommand()
  console.log(slashCommandsCollected.length)
  if(slashCommandsCollected.length > 0) slashCommands.push(...slashCommandsCollected);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands("900320090732527638"), { body: slashCommands });

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
    
    commands.execute(message);
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    await commands.interaction(interaction);
  });

  // Log in to Discord with your bot token
  client.login(process.env.TOKEN);
  
}).catch(console.error);
