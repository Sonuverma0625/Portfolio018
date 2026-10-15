const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { readDatabase, writeDatabase } = require('../models/database');
const persistentStore = require('../models/persistent-store');

// Clear saved visitor data and reset the counters without changing portfolio content.
async function resetVisitorData() {
  if (await persistentStore.resetVisitorData()) {
    process.stdout.write('Visitor data has been reset in persistent storage.\n');
    return;
  }

  const database = await readDatabase();
  database.messages = [];
  database.analytics = {
    total_visits: 0,
    contact_submissions: 0,
    last_updated: new Date().toISOString(),
  };
  await writeDatabase(database);
  process.stdout.write('Visitor data has been reset.\n');
}

resetVisitorData().catch((error) => {
  process.stderr.write(`Could not reset visitor data: ${error.message}\n`);
  process.exitCode = 1;
});
