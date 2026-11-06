// Small fetch wrapper for the Flask backend.
// All requests go to the same origin (Vite proxies /api in development).

let csrfToken = null;

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function loadCsrfToken() {
  const res = await fetch('/api/csrf', { credentials: 'same-origin' });
  const data = await res.json();
  csrfToken = data.csrf_token;
  return csrfToken;
}

async function request(method, url, body, { isForm = false, retry = true } = {}) {
  const headers = {};
  if (method !== 'GET') {
    headers['X-CSRFToken'] = csrfToken || (await loadCsrfToken());
  }
  if (body && !isForm) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method,
    headers,
    credentials: 'same-origin',
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  // The session may have been reset, so fetch a fresh token once and retry.
  if (res.status === 403 && data?.error === 'Invalid CSRF token.' && retry) {
    await loadCsrfToken();
    return request(method, url, body, { isForm, retry: false });
  }

  if (!res.ok) {
    throw new ApiError(data?.error || 'Request failed.', res.status, data);
  }
  // Login starts a new session, which comes with a new CSRF token.
  if (data?.csrf_token) {
    csrfToken = data.csrf_token;
  }
  return data;
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, body) => request('POST', url, body),
  upload: (url, formData) => request('POST', url, formData, { isForm: true }),
};

export const auth = {
  me: () => api.get('/api/me'),
  login: (username, password) => api.post('/api/login', { username, password }),
  register: (username, password) => api.post('/api/register', { username, password }),
  logout: () => api.post('/api/logout'),
};

export const legal = {
  chat: (message, conversationId) =>
    api.post('/api/chat', { message, conversation_id: conversationId ?? null }),
  conversations: () => api.get('/api/conversations'),
  conversation: (id) => api.get(`/api/conversations/${id}`),
  analyzeContract: (text) => api.post('/api/contract/analyze', { text }),
  checkRisk: (text) => api.post('/api/risk/check', { text }),
  generateDocument: (documentType, fields) =>
    api.post('/api/documents/generate', { document_type: documentType, fields }),
  extractText: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.upload('/api/extract-text', form);
  },
  contact: (payload) => api.post('/api/contact', payload),
  lawUpdates: (limit = 20) => api.get(`/api/law-updates?limit=${limit}`),
};

export const admin = {
  users: () => api.get('/api/admin/users'),
  upload: (file) => {
    const form = new FormData();
    form.append('document', file);
    return api.upload('/api/admin/upload', form);
  },
  startLawSync: () => api.post('/api/admin/sync-laws'),
  lawSyncStatus: () => api.get('/api/admin/sync-status'),
};
