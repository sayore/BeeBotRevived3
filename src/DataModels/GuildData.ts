import { DataModelType } from "../Enum";
import { db } from "../Globals";
import { BaseDataModel } from "./BaseDataModel";

export class GuildData extends BaseDataModel {
  myType = DataModelType.User;
  data: {
    adminRoleHasBeenSet: boolean;
  };

  public save(): Promise<void> {
    return super.save();
  }
  public delete(): Promise<void> {
    return super.delete();
  }
}