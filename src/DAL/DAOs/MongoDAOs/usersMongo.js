import { userModel } from "../../mongoDB/models/User.js";
import BasicMongo from "./basicMongo.js";

class UsersMongo extends BasicMongo {
    constructor() {
        super(userModel);
    }
}

export const usersMongo = new UsersMongo();


