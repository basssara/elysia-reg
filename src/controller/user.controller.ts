import { Context, Elysia, t } from "elysia";
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
    .use(
      jwt({
        name: "jwt",
        secret: String(process.env.JWT_SECRET!),
      })
    )
    .use(cookie())
    .get(
      "/user/:id",
      async ({ params: { id }, set }): Promise<ResponseMessage> => {
        const user = await User.findById(id);

        if (!user) {
          return new ApiResponse(set).response({
            status: 404,
            success: false,
            message: "User doesn't exist!",
          });
        }

        return new ApiResponse(set).response({
          status: 200,
          success: true,
          message: "User",
          data: user,
        });
      }
    )
    .guard(
      {
        async beforeHandle({ bearer, set, jwt }) {
          const decoded: { role: string } = await jwt
            .verify(bearer)
            .catch((e) => {
              console.error(e);
            });
          if (decoded.role !== "admin") {
            set.status = 400;
            set.headers[
              "WWW-Authenticate"
            ] = `Bearer realm='sign', error="invalid_request"`;

            return "Sorry, you don't have permission to access this resource";
          }
        },
      },
      (app) =>
        app
          .get("/user", async ({ set }): Promise<ResponseMessage> => {
            const users = await User.find();

            if (!users.length) {
              return new ApiResponse(set).response({
                status: 404,
                success: true,
                message: "Users wasn't found!",
                data: [],
              });
            }

            return new ApiResponse(set).response({
              status: 200,
              success: false,
              message: "Users",
              data: users,
            });
          })
          .patch(
            "/user/:id",
            async ({ params: { id }, body, set }): Promise<ResponseMessage> => {
              const data = await User.findByIdAndUpdate(id, {
                firstName: body.firstName,
                lastName: body.lastName,
                username: body.username,
                email: body.email,
                password: body.password,
                role: body.role,
              });

              if (!data) {
                set.status = 404;
                return {
                  status: 404,
                  success: false,
                  message: "User was not found!",
                };
              }

              set.status = 204;

              return {
                status: 204,
                success: true,
                message: "User updated!",
              };
            },
            {
              body: UserUpdateValidator,
            }
          )
          .delete(
            "/user/:id",
            async ({ params: { id }, set }): Promise<ResponseMessage> => {
              const user = await User.findByIdAndDelete(id);

              if (!user) {
                return new ApiResponse(set).response({
                  status: 404,
                  success: false,
                  message: "User doesn't exist!",
                });
              }

              return new ApiResponse(set).response({
                status: 204,
                success: false,
                message: "Deleted!",
              });
            },
            {
              params: t.Object({
                id: t.String(),
              }),
            }
          )
    );
}
