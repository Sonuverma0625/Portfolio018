const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { readDatabase, writeDatabase } = require('../models/database');

// Clear saved visitor data and reset the counters without changing portfolio content.
async function resetVisitorData() {
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
