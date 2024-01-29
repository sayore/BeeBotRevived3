//Create a Class to keys specific to DataModelType's and their data
// Path: src/DataModels/CreateKey.ts
// Compare this snippet from src/DataModels/CreateKey.ts:
import { random } from "lodash";
import { DataModelType } from "../Enum";
import { BaseDataModel } from "./BaseDataModel";
import crypto from "crypto";

export class CreateKey {
  // Create a hash from the link and reaction field, to check if the reaction already exists
  // Hash is created by adding the link and reaction together, and then hashing it with sha256
  public static ReactionHash(data:{link:string, reaction:string}): string {
    const hash = crypto.createHash("sha256");
    hash.update(data.link);
    hash.update(data.reaction);
    return "Reaction_v1_"+hash.digest("hex");
  }

  // Hash of GuildID
  public static TypeHash(type:DataModelType): string {
    return this.RandomHash(type);
  }

  //Default hash
  public static RandomHash(type:DataModelType): string {
    const hash = crypto.createHash("sha256");
    hash.update(type);
    hash.update(crypto.randomBytes(32).toString("hex"));
    return type+"_v1_"+hash.digest("hex");
  }

}