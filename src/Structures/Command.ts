import { Message } from "discord.js"
import { Logging } from "supernode/Base/mod";

export class Command implements ICommand {
  constructor() {
    this.visibleInHelp = true;
    this.prefix = true;
    this.ownerlimited = false;
    this.userlimitedids = [];
    this.grouplimitedids = [];
    this.messagecontent = "";
    this.always = false;
    this.triggerwords = [];
    this.triggerfunc = async (msg:Message) => { return false; }
    this.typeofcmd = TypeOfCmd.Other;
    this.isHalting = false;
    this.canHalt = false;
  }

  visibleInHelp?: boolean | undefined
  simpleHelpName?: string | undefined
  name: string
  description?: string | undefined
  prefix?:boolean
  ownerlimited?:boolean
  userlimitedids?:string[]
  grouplimitedids?:string[]
  messagecontent?:string
  always?:boolean
  triggerwords?:string[]
  public async triggerfunc(msg:Message) : Promise<boolean|undefined> { return undefined; }
  typeofcmd?:TypeOfCmd
  public async cmd(msg: Message) : Promise<void|boolean> { Logging.log("Command cmd not overridden but cmd executed. ("+this.name+")"); return false; }
  isHalting?:boolean
  canHalt?:boolean
}

export interface ICommand {
  prefix?:boolean
  ownerlimited?:boolean
  userlimitedids?:string[]
  grouplimitedids?:string[]
  messagecontent?:string
  always?:boolean
  triggerwords?:string[]
  triggerfunc?:(msg:Message) => Promise<boolean>;
  typeofcmd?:TypeOfCmd
  isHalting?:boolean
  canHalt?:boolean

  visibleInHelp?:boolean
  name?:string
  description?:string
}

export enum TypeOfCmd {
  Action,
  Moderation,
  Other,
  Information
}