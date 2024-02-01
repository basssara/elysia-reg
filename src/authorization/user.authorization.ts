import { Elysia, t } from "elysia";
import { bearer } from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";
import { User } from "../models/user.model";
import { ApiResponse } from "../helper";
import { ResponseMessage } from "../interfaces";
import { comparePassword, hashPassword } from "../utils";
import { UserLoginValidator, UserSignUpValidator } from "../validators";

export function userAuthorization(app: Elysia) {
    return app
        .use(bearer())
        .use(jwt({
            name: 'jwt',
            secret: String(process.env.JWT_SECRET!)
        }))
        .use(cookie())
        .post('/signup', async ({ body, set }): Promise<ResponseMessage> => {
            const { hash, salt } = await hashPassword(body.password)
            const emailIsExist = await User.findOne({ email: body.email })
            const usernameIsExist = await User.findOne({ username: body.username })

            if (emailIsExist) {
                return new ApiResponse(set).response({
                    status: 409,
                    success: false,
                    message: "Email already occupied!"
                })
            }

            if (usernameIsExist) {
                return new ApiResponse(set).response({
                    status: 409,
                    success: false,
                    message: "Username already occupied!"
                })
            }

            const newUser = new User({
                firstName: body.firstName,
                lastName: body.lastName,
                username: body.username,
                email: body.email,
                password: hash,
                salt: salt,
                role: body.role
            })
            await newUser.save()

            return new ApiResponse(set).response({
                status: 201,
                success: true,
                message: "Created"
            })

        }, {
            body: UserSignUpValidator
        })
        .post('/login', async ({ body, set, jwt, setCookie }): Promise<any> => {
            const user = await User.findOne({ username: body.username })
            if (!user) {
                return new ApiResponse(set).response({
                    status: 404,
                    success: false,
                    message: "User doesn't exist",
                })
            }

            const match = await comparePassword(
                body.password,
                user.salt,
                user.password,
            )

            if (!match) {
                return new ApiResponse(set).response({
                    status: 400,
                    success: false,
                    message: "Invalid credentials",
                })
            }

            const accessToken = await jwt.sign({
                username: user.username,
                email: user.email
            })

            setCookie("access_token", accessToken, {
                maxAge: 15 * 60,
                httpOnly: true
            })

            return new ApiResponse(set).response({
                status: 200,
                success: true,
                message: "Account login successfully",
                access_token: accessToken
            })

        }, {
            body: UserLoginValidator
        })
}