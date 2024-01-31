import {db} from "../Globals";
import { DataModelType } from '../Enum';
import crypto from "crypto";
import { LogLevel, Logging } from "supernode/Base/Logging";

export class CustomHash {
    constructor(public hash: string) {}
    toString() {
        return this.hash;
    }
}

export class BaseDataModel {
    myType: DataModelType = DataModelType.None;
    constructor(
        public id: string,
        public name: string,
        public data: any,
        public created?: number,
    ) {
        if(this.usesCustomHash()) {
            try {
                this.preLoad();
                this.load(this.hash()).then(() => {
                    this.afterLoad();
                })
            } catch (err) {
                console.log("The hash function did fail on construct. Maybe fields were missing from the data.");
            }
        } else {
            this.preLoad();
            this.load(this.hash()).then(() => {
                this.afterLoad();
            })
        }
    }

    private async load(id: string) {
        if(await db.exists(id))
        db.get(id).then((data) => {
            if (typeof data === "string")
                data = JSON.parse(data);
            if (typeof data === "object" && data !== null && data.data !== undefined)
                data = data;
            if (typeof data === "undefined") {
                Logging.log(id + " not found (Created now)", LogLevel.Report);
                data = { created: Date.now(), lastAccessed: Date.now() };
            }
            data.lastAccessed = Date.now();
            this.data = Object.assign(this.data, data);
        });
    }

    public async save() {
        //console.log("Saving "+this.hash() + " with data "+JSON.stringify(this.data));
        await db.put(this.hash(), JSON.stringify(this.data, BaseDataModel.replacer));
    }

    public async delete() {
        await db.del(this.hash());
    }

    public static async load<T extends BaseDataModel>(id: string, type: (new (id:string,name:string,data) => T)) : Promise<T> {
        if(typeof id !== "string") throw new Error("id is not a string and not a hash("+typeof("id")+":"+id+")");
        if(id=="") throw new Error("id is empty");
        var obj = new type(id, "No Name", {});
        let data;
        var key;

        key = obj.hash();
        Logging.log("Loading "+key, LogLevel.Report);
        
        try {
            //console.log("Loading "+key);
            if(await db.exists(key)){
                var result = await db.get(key);
                if(typeof result === "object") data = result;
                else { data = JSON.parse(await db.get(key), this.reviver); }
                //console.log("Loaded "+JSON.stringify(data)+" from "+key);
            }else
                //console.log("Not found "+key);
            if(typeof data === "undefined") {
                Logging.log(key + " not found (Created now)", LogLevel.Report);
                data = {created:Date.now(),lastAccessed:Date.now()};
            }
            data.lastAccessed = Date.now();
        } catch (err) {
            //console.log(err);
        }

        (obj as T).preLoad();
        obj.data = data;
        (obj as T).afterLoad();
        
        return obj as T;
    }

    public afterLoad() {
        return;
    }
    public preLoad() {
        return;
    }

    // Add get as an alternative to load on the class
    public static async get<T extends BaseDataModel>(id: string, type: (new (id:string,name:string,data) => T)) : Promise<T> {
        return this.load(id, type);
    }

    public async exists() : Promise<boolean> {
        return db.exists(this.hash());
    }

    public hash(): string {
        return this.myType.toString() + this.id.toString();
    }

    public usesCustomHash() : boolean { 
        return false;
    }

    public static replacer(key, value) {
        if(value instanceof Map) {
            return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
            };
        } else {
            return value;
        }
    }

    public static reviver(key, value) {
        if(typeof value === 'object' && value !== null) {
            if (value.dataType === 'Map') {
            return new Map(value.value);
            }
        }
        return value;
    }
} 
