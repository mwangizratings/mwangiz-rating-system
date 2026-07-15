const DEVICE_ID_STORAGE_KEY = "mwangiz.deviceId.v1";

function createFallbackDeviceId() {
  const randomValues = new Uint32Array(4);
  window.crypto.getRandomValues(randomValues);

  return Array.from(randomValues, (value) => value.toString(16).padStart(8, "0"))
    .join("-")
    .toLowerCase();
}

function createDeviceId() {
  if (window.crypto?.randomUUID) {
    return `mwangiz:${window.crypto.randomUUID()}`;
  }

  return `mwangiz:${createFallbackDeviceId()}`;
}

export function getOrCreateDeviceId() {
  let existingDeviceId: string | null = null;

  try {
    existingDeviceId = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
  } catch {
    existingDeviceId = null;
  }

  if (existingDeviceId) {
    return existingDeviceId;
  }

  const deviceId = createDeviceId();

  try {
    window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  } catch {
    return deviceId;
  }

  return deviceId;
}
