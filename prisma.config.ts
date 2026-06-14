import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
    url: "postgresql://postgres:postgres@localhost:5432/school_management?schema=public",
  },
  migrations: {
    seed: 'ts-node prisma/seed.ts',
  },
})