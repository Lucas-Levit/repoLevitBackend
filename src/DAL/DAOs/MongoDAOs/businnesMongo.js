import {businessModel} from "../../mongoDB/models/Business.js";
import BasicMongo from "./basicMongo.js";

class BusinnesMongo extends BasicMongo {
    constructor(model){
        super(model)
    }
}

export const businnesMongo = new BusinnesMongo(businessModel)