import { DataModelType } from "../Enum";
import { BaseDataModel } from "./BaseDataModel";

export class ChannelData extends BaseDataModel {
  myType = DataModelType.User;
  data: {
    count: number;
  };

  public save(): Promise<void> {
    return super.save();
  }
  public delete(): Promise<void> {
    return super.delete();
  }
}