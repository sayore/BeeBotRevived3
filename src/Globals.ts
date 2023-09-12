import Level from "level-ts";

let dbm = new Level('./database')
export let db = dbm;