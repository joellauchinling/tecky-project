import { Client } from 'pg'
import { env } from './env'

export let client = new Client({
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD
})