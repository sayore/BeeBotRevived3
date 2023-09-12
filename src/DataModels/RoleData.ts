import { DataModelType } from "../Enum";
import { db } from "../Globals";
import { BaseDataModel } from "./BaseDataModel";

export enum RolePermission {
  None = 0,
  Trusted = 1,
  Moderator = 2,
  Admin = 4,
  Owner = 8,
  Bot = 16,

  Creator = 32,
  Developer = 64,
  Tester = 128,
  Support = 256,
  Contributor = 512
}

export class RoleData extends BaseDataModel {
  myType = DataModelType.Role;
  data: {
    permission: number[];
  };

  public hasPermission(permission: RolePermission): boolean {
    return this.data.permission.includes(permission);
  }

  public addPermission(permission: RolePermission): void {
    if(!this.hasPermission(permission)) {
      this.data.permission.push(permission);
    }
  }

  public save(): Promise<void> {
    return super.save();
  }
  public delete(): Promise<void> {
    return super.delete();
  }
}