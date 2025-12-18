import { defineConfig } from '@prisma/config'
import * as dotenv from 'dotenv'

// load your .env manually
dotenv.config({ path: '.env' })

export default defineConfig({
  schema: './prisma/schema',
  // migrations: './prisma/migrations' // optional
});