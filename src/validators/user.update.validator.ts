import { t } from "elysia";

export const UserUpdateValidator = t.Object({
    firstName: t.Optional(t.String()),
    lastName: t.Optional(t.String()),
    username: t.Optional(t.String()),
    email: t.Optional(t.String()),
    password: t.Optional(t.String()),
    role: t.Optional(t.String())
})
