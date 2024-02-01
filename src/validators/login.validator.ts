import { t } from "elysia";

export const UserLoginValidator = t.Object({
    username: t.String(),
    password: t.String()
})