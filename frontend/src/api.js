const BASE_URL = "http://127.0.0.1:8000"

function getToken() {
  return localStorage.getItem("token")
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function safeJson(res) {
  try {
    const data = await res.json()
    if (!res.ok) return { error: data.detail || "Request failed" }
    return data
  } catch {
    return { error: "Invalid server response" }
  }
}

export async function getMe() {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { ...authHeaders() },
  })
  return safeJson(res)
}

export async function registerUser(data) {
  const form = new FormData()
  form.append("username", data.username)
  form.append("email", data.email)
  form.append("password", data.password)

  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    body: form,
  })
  return safeJson(res)
}

export async function loginUser(data) {
  const form = new FormData()
  form.append("email", data.email)
  form.append("password", data.password)

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: form,
  })

  const result = await safeJson(res)
  if (result?.access_token) {
    localStorage.setItem("token", result.access_token)
  }
  return result
}

export async function predictResale(formData) {
  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  })
  return safeJson(res)
}

export async function sellFromPrediction(formData) {
  const res = await fetch(`${BASE_URL}/predict/sell-from-prediction`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  })
  return safeJson(res)
}

export async function getMarketplace() {
  const res = await fetch(`${BASE_URL}/marketplace/buy`, {
    headers: { ...authHeaders() },
  })
  return safeJson(res)
}

export async function markSold(phoneId) {
  const res = await fetch(`${BASE_URL}/marketplace/mark-sold/${phoneId}`, {
    method: "POST",
    headers: { ...authHeaders() },
  })
  return safeJson(res)
}

export async function createPhoneOrder(phoneId) {
  const res = await fetch(`${BASE_URL}/marketplace/buy/create-order/${phoneId}`, {
    method: "POST",
    headers: { ...authHeaders() },
  })
  return safeJson(res)
}

export async function verifyPhonePayment(formData) {
  const res = await fetch(`${BASE_URL}/marketplace/buy/verify-payment`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  })
  return safeJson(res)
}

export async function createCreditOrder(formData) {
  const res = await fetch(`${BASE_URL}/payments/create-credit-order`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  })
  return safeJson(res)
}

export async function verifyCreditPayment(formData) {
  const res = await fetch(`${BASE_URL}/payments/verify-credit-payment`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  })
  return safeJson(res)
}