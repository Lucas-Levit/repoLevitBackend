import { userModel } from "../../mongoDB/models/User.js";
import BasicMongo from "./basicMongo.js";

class UsersMongo extends BasicMongo {
    constructor() {
        super(userModel);
    }
    async changePremiumRole(id) {
        try {
            const user = await userModel.findById(id);
            const role = user.role == "premium" ? "user" : "premium";
            const updatedUser = await userModel.findByIdAndUpdate(
                id,
                { role: role },
                { new: true }
            );
            return updatedUser;
        } catch (error) {
            return error;
        }
    }
}

export const usersMongo = new UsersMongo();


