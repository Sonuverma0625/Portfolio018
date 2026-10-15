import { API_BASE_URL } from './config.js';

const CONTACT_ENDPOINT = `${API_BASE_URL}/api/contact`;

// Show form feedback without moving keyboard or screen-reader focus.
function setFormStatus(statusElement, kind, message) {
  statusElement.dataset.kind = kind;
  statusElement.textContent = message;
}

// Send a validated message to the local portfolio API and report its response.
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const submitButton = document.getElementById('contact-submit');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    delete status.dataset.kind;

    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const payload = {
      name: String(values.get('name')).trim(),
      email: String(values.get('email')).trim(),
      message: String(values.get('message')).trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setFormStatus(status, 'error', 'Please complete each field before sending.');
      return;
    }

    submitButton.disabled = true;
    submitButton.firstChild.textContent = 'Sending ';

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Your message could not be sent. Please try again.');
      }

      setFormStatus(status, 'success', result.message || 'Your message has been received.');
      form.reset();
    } catch (error) {
      setFormStatus(status, 'error', `${error.message} You can also email me directly.`);
    } finally {
      submitButton.disabled = false;
      submitButton.firstChild.textContent = 'Send message ';
    }
  });
}

export { setupContactForm };
