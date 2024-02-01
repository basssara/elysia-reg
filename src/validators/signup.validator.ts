import { t } from "elysia";

export const UserSignUpValidator = t.Object({
    firstName: t.String(),
    lastName: t.String(),
    username: t.String(),
    email: t.String(),
    password: t.String(),
    role: t.Optional(t.String())
})