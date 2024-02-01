import { randomBytes, pbkdf2 } from 'node:crypto'

async function hashPassword(password: string): Promise<{ hash: string, salt: string }> {
    const salt = randomBytes(16).toString("hex")

    return new Promise((resolve, reject) => {
        pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
            if (err) return reject(err)
            return resolve({ hash: derivedKey.toString("hex"), salt })
        })
    })

}

async function comparePassword(password: string, salt: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
            if (err) return reject(err)
            return resolve(hash === derivedKey.toString("hex"))
        })
    })
}

export { hashPassword, comparePassword }