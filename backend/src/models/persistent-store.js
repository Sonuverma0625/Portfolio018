const { neon } = require('@neondatabase/serverless');

let clientPromise;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function usesPersistentDatabase() {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL)
    || Boolean(process.env.VERCEL);
}

// Keep the Vercel serverless filesystem out of the durable message store.
async function getSql() {
  const connectionString = process.env.DATABASE_URL
    || process.env.POSTGRES_URL
    || process.env.NEON_DATABASE_URL;

  if (!connectionString) {
    if (process.env.VERCEL) {
      const error = new Error('Persistent storage is not configured for this deployment.');
      error.status = 503;
      throw error;
    }

    return null;
  }

  if (!clientPromise) {
    clientPromise = (async () => {
      const sql = neon(connectionString);
      await sql`
        CREATE TABLE IF NOT EXISTS portfolio_messages (
          id UUID PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          is_read BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS portfolio_analytics (
          singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
          total_visits BIGINT NOT NULL DEFAULT 0,
          contact_submissions BIGINT NOT NULL DEFAULT 0,
          last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        INSERT INTO portfolio_analytics (singleton)
        VALUES (TRUE)
        ON CONFLICT (singleton) DO NOTHING
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS portfolio_messages_created_at_idx
        ON portfolio_messages (created_at DESC)
      `;
      return sql;
    })().catch((error) => {
      clientPromise = undefined;
      throw error;
    });
  }

  return clientPromise;
}

function fromDatabaseMessage(message) {
  if (!message) return null;
  return {
    ...message,
    created_at: new Date(message.created_at).toISOString(),
  };
}

async function createMessage(message) {
  const sql = await getSql();
  if (!sql) return null;

  const rows = await sql`
    WITH saved AS (
      INSERT INTO portfolio_messages (id, name, email, subject, message, is_read, created_at)
      VALUES (
        ${message.id}, ${message.name}, ${message.email}, ${message.subject},
        ${message.message}, ${message.read}, ${message.created_at}::timestamptz
      )
      RETURNING id, name, email, subject, message, is_read AS "read", created_at
    ), counted AS (
      UPDATE portfolio_analytics
      SET contact_submissions = contact_submissions + 1, last_updated = NOW()
      WHERE singleton = TRUE
      RETURNING singleton
    )
    SELECT saved.* FROM saved CROSS JOIN counted
  `;
  return fromDatabaseMessage(rows[0]);
}

async function listMessages() {
  const sql = await getSql();
  if (!sql) return null;

  const rows = await sql`
    SELECT id, name, email, subject, message, is_read AS "read", created_at
    FROM portfolio_messages
    ORDER BY created_at DESC
  `;
  return rows.map(fromDatabaseMessage);
}

async function markMessageRead(id) {
  if (!UUID_PATTERN.test(id)) return null;
  const sql = await getSql();
  if (!sql) return null;

  const rows = await sql`
    UPDATE portfolio_messages
    SET is_read = TRUE
    WHERE id = ${id}::uuid
    RETURNING id, name, email, subject, message, is_read AS "read", created_at
  `;
  return fromDatabaseMessage(rows[0]);
}

async function removeMessage(id) {
  if (!UUID_PATTERN.test(id)) return null;
  const sql = await getSql();
  if (!sql) return null;

  const rows = await sql`
    DELETE FROM portfolio_messages
    WHERE id = ${id}::uuid
    RETURNING id, name, email, subject, message, is_read AS "read", created_at
  `;
  return fromDatabaseMessage(rows[0]);
}

async function readAnalytics() {
  const sql = await getSql();
  if (!sql) return null;

  const [analytics] = await sql`
    SELECT total_visits, contact_submissions, last_updated
    FROM portfolio_analytics
    WHERE singleton = TRUE
  `;
  return {
    total_visits: Number(analytics.total_visits),
    contact_submissions: Number(analytics.contact_submissions),
    last_updated: new Date(analytics.last_updated).toISOString(),
  };
}

async function recordVisit() {
  const sql = await getSql();
  if (!sql) return false;

  await sql`
    UPDATE portfolio_analytics
    SET total_visits = total_visits + 1, last_updated = NOW()
    WHERE singleton = TRUE
  `;
  return true;
}

async function resetVisitorData() {
  const sql = await getSql();
  if (!sql) return false;

  await sql`
    WITH deleted AS (DELETE FROM portfolio_messages RETURNING id)
    UPDATE portfolio_analytics
    SET total_visits = 0, contact_submissions = 0, last_updated = NOW()
    WHERE singleton = TRUE
  `;
  return true;
}

module.exports = {
  createMessage,
  listMessages,
  markMessageRead,
  readAnalytics,
  recordVisit,
  removeMessage,
  resetVisitorData,
  usesPersistentDatabase,
};
