const { config } = require('dotenv');
const { unlinkSync, writeFileSync } = require('fs');
config();

let jsonX = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  "entities": ["src/entities/**/*.ts"],
  "migrations": ["src/migration/**/*.ts"],
  "cli": {
      "entitiesDir": "src/entities",
      "migrationsDir": "src/migration",
   },
  ssl: {
    rejectUnauthorized: false,
  },
};

try {
  unlinkSync('ormconfig.json');
} catch {}
writeFileSync('ormconfig.json', JSON.stringify(jsonX));
