const BASE_URL = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.error || data.message || "Erro na requisição");
  return data;
}

async function requestForm(path, formData) {
  const token = getToken();
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, { method: "POST", headers, body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Erro na requisição");
  return data;
}

export const api = {
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  postForm: (path, formData) => requestForm(path, formData),
  get: (path) => request(path, { method: "GET" }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};

function getPersonalToken() {
  return localStorage.getItem("personal_token");
}

async function personalRequest(path, options = {}) {
  const token = getPersonalToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.error || data.message || "Erro na requisição");
  return data;
}

export const personalApi = {
  post: (path, body) => personalRequest(path, { method: "POST", body: JSON.stringify(body) }),
  get: (path) => personalRequest(path, { method: "GET" }),
  patch: (path, body) => personalRequest(path, { method: "PATCH", body: JSON.stringify(body) }),
};
