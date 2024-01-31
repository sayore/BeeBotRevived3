import { DataModelType } from "../Enum";
import { db } from "../Globals";
import { BaseDataModel, CustomHash } from "./BaseDataModel";
import { CreateKey } from "./CreateKey";
import crypto from "crypto";

export class ReactionData extends BaseDataModel {
  myType = DataModelType.Reaction;
  // { reaction: "pat", template: ["PATPATPATPATPAT <%= repliant %>!"], special: {}, link: "https://c.tenor.com/wLqFGYigJuIAAAAC/mai-sakurajima.gif" },
  data: {
    reaction: string;
    template: string | string[];
    templateSingle: string | string[] | undefined;
    templateMulti: string | string[] | undefined;
    special: any;
    default: boolean
    link: string;
  };
  // Add a reaction to the database, or update it if it already exists
  public static async addOrUpdate(reaction: string, template: string | string[],templateSingle:string | string[] | undefined,templateMulti:string | string[] | undefined, special: any, link: string): Promise<void> {
    // Check if the reaction already exists
    const id = CreateKey.ReactionHash({link:link[0], reaction});
    let reactionData : any = {};
    if (!await db.exists(id)) {
      // Create a new reaction
      reactionData = new ReactionData(id, reaction, {template, special, link});
      await reactionData.save();
    } else {
      // Update the reaction
      reactionData.reaction = reaction;
      reactionData.template = template;
      reactionData.special = special;
      reactionData.link = link;
    }
  }

  // Create a hash from the link and reaction field, to check if the reaction already exists
  // Hash is created by adding the link and reaction together, and then hashing it with sha256
  public hash(): string {
    const hash = crypto.createHash("sha256");
    hash.update(this.data.link + this.data.reaction);
    return hash.digest("hex");
  }

  public static hash(data:any): string {
    const hash = crypto.createHash("sha256");
    hash.update(data.link + data.reaction);
    return hash.digest("hex");
  }

  public usesCustomHash(): boolean {
    return true;
  }
}