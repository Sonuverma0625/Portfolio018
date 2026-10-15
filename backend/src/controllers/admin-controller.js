const { readDatabase, writeDatabase } = require('../models/database');
const persistentStore = require('../models/persistent-store');

// Return saved messages in newest-first order to the authenticated dashboard.
async function getMessages(request, response, next) {
  try {
    let messages;
    if (persistentStore.usesPersistentDatabase()) {
      messages = await persistentStore.listMessages();
    } else {
      const database = await readDatabase();
      messages = [...database.messages].sort((first, second) => (
        new Date(second.created_at) - new Date(first.created_at)
      ));
    }
    response.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
}

// Mark a saved contact message as read.
async function markMessageRead(request, response, next) {
  try {
    let message;
    let database;
    if (persistentStore.usesPersistentDatabase()) {
      message = await persistentStore.markMessageRead(request.params.id);
    } else {
      database = await readDatabase();
      message = database.messages.find((item) => item.id === request.params.id);
    }

    if (!message) {
      response.status(404).json({ error: 'Message not found.' });
      return;
    }

    if (!persistentStore.usesPersistentDatabase()) {
      message.read = true;
      await writeDatabase(database);
    }
    response.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
}

// Remove one saved message after confirming that it exists.
async function deleteMessage(request, response, next) {
  try {
    let storedMessage;
    let database;
    let messageIndex = -1;
    if (persistentStore.usesPersistentDatabase()) {
      storedMessage = await persistentStore.removeMessage(request.params.id);
    } else {
      database = await readDatabase();
      messageIndex = database.messages.findIndex((item) => item.id === request.params.id);
    }

    if (persistentStore.usesPersistentDatabase() ? !storedMessage : messageIndex === -1) {
      response.status(404).json({ error: 'Message not found.' });
      return;
    }

    let deletedMessage = storedMessage;
    if (!persistentStore.usesPersistentDatabase()) {
      [deletedMessage] = database.messages.splice(messageIndex, 1);
      await writeDatabase(database);
    }
    response.json({ success: true, data: deletedMessage });
  } catch (error) {
    next(error);
  }
}

// Return visit and contact totals to the authenticated dashboard.
async function getAnalytics(request, response, next) {
  try {
    if (persistentStore.usesPersistentDatabase()) {
      response.json({ success: true, data: await persistentStore.readAnalytics() });
    } else {
      const database = await readDatabase();
      response.json({ success: true, data: database.analytics });
    }
  } catch (error) {
    next(error);
  }
}

// Count a public visit without exposing private analytics data.
async function recordVisit(request, response, next) {
  try {
    if (persistentStore.usesPersistentDatabase()) {
      await persistentStore.recordVisit();
    } else {
      const database = await readDatabase();
      database.analytics.total_visits += 1;
      database.analytics.last_updated = new Date().toISOString();
      await writeDatabase(database);
    }
    response.json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = { getMessages, markMessageRead, deleteMessage, getAnalytics, recordVisit };
