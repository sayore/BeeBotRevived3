import { Client } from "discord.js";
import Level from "level-ts";
import { CommandCollection } from "./Structures/CommandCollection";

let dbm = new Level('./database')
export let db = dbm;
export let prefix = "!"
let client : Client<boolean>;
export function getClient() : Client<boolean> {
  return client;
};
export function setClient(_client:Client<boolean>) {
  if(client) client.destroy();
  client = _client;
};
export let commands = new CommandCollection();