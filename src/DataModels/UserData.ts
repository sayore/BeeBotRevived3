import { DataModelType } from "../Enum";
import { db } from "../Globals";
import { BaseDataModel } from "./BaseDataModel";

export class UserData extends BaseDataModel {
  myType = DataModelType.User;
  data: {
    count: number;
    tag: string;
    color: string;
    rpg: {
      xp: number;
    }
  };

  public save(): Promise<void> {
    return super.save();
  }
  public delete(): Promise<void> {
    return super.delete();
  }
}

