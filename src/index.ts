import { Elysia } from "elysia";
import jwt from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";
import bearer from "@elysiajs/bearer";
import { connectDB } from "./libs/database";
import { userController } from "./controller";
import { userAuthorization } from "./authorization/";

await connectDB()

const app = new Elysia()
  .use(bearer())
  .use(jwt({
    name: 'jwt',
    secret: String(process.env.JWT_SECRET!)
  }))
  .use(cookie())
  .guard({
    async beforeHandle({ bearer, set, jwt }) {
      if (!bearer) {
        set.status = 400
        set.headers[
          'WWW-Authenticate'
        ] = `Bearer realm='sign', error="invalid_request"`

        return 'Unauthorized'
      }

      const decoded: { username: string, email: string } = await jwt.verify(bearer)
        .catch((e) => {
          console.error(e)
        })

      if (!decoded.username && !decoded.email) {
        set.status = 400
        set.headers[
          'WWW-Authenticate'
        ] = `Bearer realm='sign', error="invalid_request"`

        return 'Unauthorized'
      }
    }

  }, userController)
  .use(userAuthorization)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
