import mongoose from 'mongoose'

const connectDB = async () => {
  const connectionUrl = process.env.DB_URI

  if (!connectionUrl) {
    throw new Error('DB_URI is not defined')
  }

  try {
    await mongoose.connect(connectionUrl)
    console.log('Database connected successfully')
  } catch (error: any) {
    console.error('Database connection error:', error.message)
  }

  mongoose.set('strictQuery', false)
}

export default connectDB
