import {db} from "../Globals";
import { DataModelType } from '../Enum';
import crypto from "crypto";
export class BaseDataModel {
    myType: DataModelType = DataModelType.None;
    constructor(
        public id: string,
        public name: string,
        public data: any
    ) {
        
    }

    public async save() {
        await db.put(this.hash(), this.data);
    }

    public async delete() {
        await db.del(this.hash());
    }

    public static async load<T extends BaseDataModel>(id: string, type: (new (id:string,name:string,data) => T)) : Promise<T> {
        var obj = new type(id, "No Name", {});
        let data;
        try {
            data = await db.get(obj.myType.toString() + id.toString());
            if(typeof data === "string")
                data={};
        } catch (err) {
            data = {};
        }
        obj.data = data;
        
        return obj as T;
    }

    // Add get as an alternative to load on the class
    public static async get<T extends BaseDataModel>(id: string, type: (new (id:string,name:string,data) => T)) : Promise<T> {
        return this.load(id, type);
    }

    public async exists() : Promise<boolean> {
        return db.exists(this.hash());
    }

    public hash(): string {
        const hash = crypto.createHash("sha256");
        hash.update(this.data.id + this.data.myType);
        return hash.digest("hex");
    }

    public static hash(data:any): string {
        const hash = crypto.createHash("sha256");
        hash.update(data.id + data.type);
        return hash.digest("hex");
    }
} 
