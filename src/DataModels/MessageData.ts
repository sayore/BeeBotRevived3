import { DataModelType } from '../Enum';
import { BaseDataModel } from './BaseDataModel';

enum MessageActions {
  Role = "addRole",
  remove = "remove",
  list = "list",
  help = "help",
  unknown = "unknown"
}

class MessageData extends BaseDataModel {
  myType = DataModelType.Message;
  data: {

    actions: Map<string, string[]>;
  };
  

}
