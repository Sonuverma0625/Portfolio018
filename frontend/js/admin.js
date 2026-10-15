import { API_BASE_URL } from './config.js';

const ADMIN_ENDPOINT = `${API_BASE_URL}/api`;
const ADMIN_KEY_STORE = 'darkside-admin-key';

// Display a short status message when the admin API returns a result.
function showStatus(message, type = '') {
  const status = document.getElementById('admin-status');
  status.textContent = message;
  status.dataset.kind = type;
}

// Add a saved message using DOM text fields so message content cannot become markup.
function createMessageCard(message, adminKey) {
  const card = document.createElement('article');
  const heading = document.createElement('h3');
  const email = document.createElement('a');
  const date = document.createElement('span');
  const body = document.createElement('p');
  const actions = document.createElement('div');
  const readButton = document.createElement('button');
  const deleteButton = document.createElement('button');

  card.className = `panel message-card${message.read ? ' is-read' : ''}`;
  heading.textContent = message.subject || 'No subject';
  email.href = `mailto:${message.email}`;
  email.textContent = `${message.name} · ${message.email}`;
  date.textContent = new Date(message.created_at).toLocaleString();
  body.textContent = message.message;
  email.className = 'message-meta-link';
  date.className = 'message-meta-date';
  const meta = document.createElement('div');
  meta.className = 'message-meta';
  meta.append(email, date);
  actions.className = 'message-actions';
  readButton.type = 'button';
  readButton.className = 'admin-refresh';
  readButton.textContent = message.read ? 'Read' : 'Mark as read';
  readButton.disabled = Boolean(message.read);
  readButton.addEventListener('click', () => markMessageRead(message.id, adminKey));
  deleteButton.type = 'button';
  deleteButton.className = 'message-delete';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => removeMessage(message.id, adminKey));
  actions.append(readButton, deleteButton);
  card.append(heading, meta, body, actions);
  return card;
}

// Request dashboard data with the key supplied in the form.
async function fetchAdminData(path, adminKey, options = {}) {
  const response = await fetch(`${ADMIN_ENDPOINT}${path}`, {
    ...options,
    headers: { 'X-Admin-Key': adminKey, ...(options.headers || {}) },
  });
  const result = await response.json();

  if (!response.ok) throw new Error(result.error || 'The dashboard request failed.');
  return result;
}

// Refresh the message cards and activity counts after a successful sign-in.
async function loadDashboard(adminKey) {
  const messageList = document.getElementById('message-list');
  showStatus('Loading portfolio activity…');

  try {
    const [messageResult, analyticsResult, projectResult] = await Promise.all([
      fetchAdminData('/messages', adminKey),
      fetchAdminData('/analytics', adminKey),
      fetch(`${ADMIN_ENDPOINT}/projects`).then((response) => response.json()),
    ]);
    document.getElementById('message-count').textContent = messageResult.count;
    document.getElementById('visit-count').textContent = analyticsResult.data.total_visits;
    document.getElementById('project-count').textContent = projectResult.count;
    messageList.replaceChildren();

    if (messageResult.data.length === 0) {
      const emptyState = document.createElement('p');
      emptyState.className = 'admin-empty';
      emptyState.textContent = 'No messages have been saved yet.';
      messageList.append(emptyState);
    } else {
      messageResult.data.forEach((message) => messageList.append(createMessageCard(message, adminKey)));
    }

    showStatus('Dashboard connected. Message details are protected by your admin key.', 'success');
  } catch (error) {
    showStatus(error.message, 'error');
  }
}

// Mark one message as read, then redraw the current inbox.
async function markMessageRead(messageId, adminKey) {
  try {
    await fetchAdminData(`/messages/${encodeURIComponent(messageId)}/read`, adminKey, { method: 'PUT' });
    await loadDashboard(adminKey);
  } catch (error) {
    showStatus(error.message, 'error');
  }
}

// Delete one message after the dashboard owner confirms the action.
async function removeMessage(messageId, adminKey) {
  if (!window.confirm('Delete this saved message?')) return;

  try {
    await fetchAdminData(`/messages/${encodeURIComponent(messageId)}`, adminKey, { method: 'DELETE' });
    await loadDashboard(adminKey);
  } catch (error) {
    showStatus(error.message, 'error');
  }
}

// Save the admin key for this tab and immediately open the inbox.
function setupAdminForm() {
  const form = document.getElementById('admin-form');
  const input = document.getElementById('admin-key');
  const storedKey = sessionStorage.getItem(ADMIN_KEY_STORE);

  if (storedKey) input.value = storedKey;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const adminKey = input.value.trim();
    if (!adminKey) return;

    sessionStorage.setItem(ADMIN_KEY_STORE, adminKey);
    await loadDashboard(adminKey);
  });

  document.getElementById('refresh-messages').addEventListener('click', () => {
    const adminKey = sessionStorage.getItem(ADMIN_KEY_STORE);
    if (adminKey) loadDashboard(adminKey);
  });

  if (storedKey) loadDashboard(storedKey);
}

setupAdminForm();
