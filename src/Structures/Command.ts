import { CacheType, Interaction, Message, MessageReaction, PartialMessageReaction, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js"
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
  public async onInit(silent:boolean) : Promise<void> {}
  public async onSelftest(silent:boolean) : Promise<void> {}
  public async onLite(args: string[]) : Promise<boolean> { return false; }
  public async onInteraction?(interaction: Interaction<CacheType>): Promise<boolean> { return false; };
  public async onReaction?(reaction: MessageReaction | PartialMessageReaction): Promise<boolean> { return false; };
  public async onRegisterSlashCommands?(): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIChatInputApplicationCommandsJSONBody[] | void> { return; };

  typeofcmd?:TypeOfCmd
  public async trigger(msg:Message) : Promise<boolean|undefined> { return undefined; }
  public async execute(msg: Message) : Promise<void|boolean> { Logging.log("Command cmd not overridden but cmd executed. ("+this.name+")"); return false; }
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
  trigger?:(msg:Message) => Promise<boolean>;
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