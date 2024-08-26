import {UserLoginDTO} from "../../types/user";

export const loginUserValid : UserLoginDTO = {
    email: process.env.ADMIN_EMAIL as string,
    password: process.env.ADMIN_PASSWORD as string,
}


