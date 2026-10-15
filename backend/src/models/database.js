const fs = require('node:fs/promises');
const path = require('node:path');

const DEFAULT_DATABASE_PATH = path.join(__dirname, '..', '..', 'db.json');
const VERCEL_DATABASE_PATH = path.join('/tmp', 'portfolio-db.json');
const DATABASE_PATH = process.env.PORTFOLIO_DB_PATH
  || (process.env.VERCEL ? VERCEL_DATABASE_PATH : DEFAULT_DATABASE_PATH);

// Read the portfolio data from its small, local JSON store.
async function readDatabase() {
  if (DATABASE_PATH !== DEFAULT_DATABASE_PATH) {
    await fs.mkdir(path.dirname(DATABASE_PATH), { recursive: true });
    try {
      await fs.access(DATABASE_PATH);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      await fs.copyFile(DEFAULT_DATABASE_PATH, DATABASE_PATH);
    }
  }

  const databaseText = await fs.readFile(DATABASE_PATH, 'utf8');
  return JSON.parse(databaseText);
}

// Save database changes only after a complete JSON file has been prepared.
async function writeDatabase(database) {
  const temporaryPath = `${DATABASE_PATH}.tmp`;
  const databaseText = `${JSON.stringify(database, null, 2)}\n`;
  await fs.writeFile(temporaryPath, databaseText, 'utf8');
  await fs.rename(temporaryPath, DATABASE_PATH);
}

module.exports = { readDatabase, writeDatabase };
