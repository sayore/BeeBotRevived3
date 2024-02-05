///@ts-ignore
///@ts-nocheck
///@ts-expect-error

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


    