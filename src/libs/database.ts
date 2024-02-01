import { connect } from "mongoose"

async function connectDB() {
    await connect(String(process.env.MONGO_URI)).then(() => {
        console.log('Mongo Connected')
    }).catch((err) => {
        console.error(err)
    })
}

export { connectDB }