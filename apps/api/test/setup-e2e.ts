import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { PrismaClient } from '@prisma/client'

import { envSchema } from '@/infra/env/env'

const env = envSchema.parse(process.env)

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable')
  }

  const url = new URL(env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL

  execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
