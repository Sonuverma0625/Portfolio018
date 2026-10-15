const { randomUUID } = require('node:crypto');
const { readDatabase, writeDatabase } = require('../models/database');

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 4000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Accept only the fields needed for a readable contact message.
function validateContact(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name || !email || !message) {
    return { error: 'Name, email, and message are required.' };
  }

  if (name.length > MAX_NAME_LENGTH || email.length > MAX_EMAIL_LENGTH
    || subject.length > MAX_SUBJECT_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
    return { error: 'One or more fields are longer than the allowed limit.' };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: 'Enter a valid email address.' };
  }

  return { value: { name, email, subject: subject || 'No Subject', message } };
}

// Store a validated message and return a clear confirmation to the visitor.
async function createContactMessage(request, response, next) {
  const validation = validateContact(request.body || {});

  if (validation.error) {
    response.status(400).json({ error: validation.error });
    return;
  }

  try {
    const database = await readDatabase();
    const message = {
      id: randomUUID(),
      ...validation.value,
      read: false,
      created_at: new Date().toISOString(),
    };

    database.messages.push(message);
    database.analytics.contact_submissions += 1;
    database.analytics.last_updated = new Date().toISOString();
    await writeDatabase(database);

    response.status(201).json({
      success: true,
      message: 'Thanks. Your message has been saved, and I will get back to you soon.',
      id: message.id,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createContactMessage };
