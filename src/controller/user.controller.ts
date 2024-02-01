import { Elysia, t } from "elysia";
import { bearer } from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";
import { User } from "../models";
import { ApiResponse } from "../helper";
import { ResponseMessage } from "../interfaces";
import { UserUpdateValidator } from "../validators";

export function userController(app: Elysia) {
    return app
        .use(bearer())
        .use(jwt({
            name: 'jwt',
            secret: String(process.env.JWT_SECRET!)
        }))
        .use(cookie())
        .derive(async ({ headers, jwt, set }) => {
            headers['authorization']
        })
        .get('/user', async ({ bearer }) => {
            const data = await User.find()

            return data
        })
        .get('/user/:id', async ({ params: { id }, set }) => {
            const data = await User.findById(id)

            set.status = 200

            return data
        })
        .patch('/user/:id', async ({ params: { id }, body, set }): Promise<ResponseMessage> => {
            const data = await User.findByIdAndUpdate(id, {
                firstName: body.firstName,
                lastName: body.lastName,
                username: body.username,
                email: body.email,
                password: body.password,
                role: body.role
            })

            if (!data) {
                set.status = 404
                return {
                    status: 404,
                    success: false,
                    message: "User was not found!",
                }
            }

            set.status = 204

            return {
                status: 204,
                success: true,
                message: "User was not found!"
            }

        }, {
            body: UserUpdateValidator
        })
        .delete('/user/:id', async ({ params: { id }, set }): Promise<ResponseMessage> => {
            const user = await User.findByIdAndDelete(id)

            if (!user) {
                return new ApiResponse(set).response({
                    status: 404,
                    success: false,
                    message: "User doesn't exist!"
                })
            }

            return new ApiResponse(set).response({
                status: 204,
                success: false,
                message: "Deleted!"
            })

        }, {
            params: t.Object({
                id: t.String()
            })
        }
        )
}