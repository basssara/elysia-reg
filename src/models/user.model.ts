import { Schema, model } from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'Please tell us your first name!'],
    },
    lastName: {
        type: String,
        required: [true, 'Please tell us your last name!'],
    },
    username: {
        type: String,
        required: [true, 'Please provide your username!'],
        unique: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email!'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    salt: {
        type: String,
        required: [true, "Please provide a salt"]
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});


const User = model<IUser>('User', userSchema);

export { User }
