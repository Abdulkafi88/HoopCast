const LIMITS = {
  login: { max: 5, windowMs: 15 * 60 * 1000 },   // 5 attempts per 15 min
  signup: { max: 3, windowMs: 10 * 60 * 1000 },   // 3 attempts per 10 min
}

const getRecord = (key) => {
  try {
    return JSON.parse(localStorage.getItem(`rl_${key}`)) ?? { attempts: 0, windowStart: Date.now() }
  } catch {
    return { attempts: 0, windowStart: Date.now() }
  }
}

const saveRecord = (key, record) => {
  localStorage.setItem(`rl_${key}`, JSON.stringify(record))
}

export const checkRateLimit = (key) => {
  const { max, windowMs } = LIMITS[key]
  const now = Date.now()
  let record = getRecord(key)

  if (now - record.windowStart > windowMs) {
    record = { attempts: 0, windowStart: now }
  }

  if (record.attempts >= max) {
    const remaining = Math.ceil((record.windowStart + windowMs - now) / 60000)
    return { allowed: false, remaining }
  }

  return { allowed: true, remaining: null }
}

export const recordAttempt = (key) => {
  const { windowMs } = LIMITS[key]
  const now = Date.now()
  let record = getRecord(key)

  if (now - record.windowStart > windowMs) {
    record = { attempts: 0, windowStart: now }
  }

  record.attempts += 1
  saveRecord(key, record)
}
