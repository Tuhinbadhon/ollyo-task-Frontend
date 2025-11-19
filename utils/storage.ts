import { Device, DeviceSettings, Preset } from "@/types/simulator";

const API_BASE = "http://localhost:8000/api/";

// Types for server responses
type RawDevice = {
  id: number;
  type: string;
  name?: string;
  settings: DeviceSettings;
};
type RawPreset = { id: number; name: string; devices: RawDevice[] };

// Device APIs
export const saveDevice = async (device: Device) => {
  const payload = {
    type: device.type,
    name: device.name,
    settings: device.settings,
  };
  const res = await fetch(`${API_BASE}devices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    // Try to parse JSON response to surface validation errors from Laravel
    try {
      const errJson = await res.json();
      if (res.status === 422 && errJson.errors) {
        const messages = Object.values(errJson.errors).flat().join(", ");
        throw new Error(messages || "Validation error");
      }
      const message = errJson.message || JSON.stringify(errJson);
      throw new Error(message);
    } catch {
      const errText = await res.text().catch(() => "");
      throw new Error(`Failed to save device: ${res.status} ${errText}`);
    }
  }
  const json = await res.json();
  return json && json.data ? json.data : json;
};

export const saveDevices = async (devices: Device[]) => {
  for (const d of devices) await saveDevice(d);
};

export const updateDevice = async (
  id: string | number,
  device: Partial<Device>
) => {
  const res = await fetch(`${API_BASE}devices/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(device),
  });
  if (!res.ok) {
    try {
      const errJson = await res.json();
      if (res.status === 422 && errJson.errors) {
        const messages = Object.values(errJson.errors).flat().join(", ");
        throw new Error(messages || "Validation error");
      }
      const message = errJson.message || JSON.stringify(errJson);
      throw new Error(message);
    } catch {
      const errText = await res.text().catch(() => "");
      throw new Error(`Failed to update device: ${res.status} ${errText}`);
    }
  }
  const json = await res.json();
  return json && json.data ? json.data : json;
};

export const deleteDevice = async (id: string | number) => {
  const res = await fetch(`${API_BASE}devices/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to delete device");
  return await res.json();
};

// Preset APIs
export const savePreset = async (preset: {
  name: string;
  devices: Device[];
}) => {
  const res = await fetch(`${API_BASE}presets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(preset),
  });
  if (!res.ok) {
    try {
      const errJson = await res.json();
      if (res.status === 422 && errJson.errors) {
        const messages = Object.values(errJson.errors).flat().join(", ");
        throw new Error(messages || "Validation error");
      }
      const message = errJson.message || JSON.stringify(errJson);
      throw new Error(message);
    } catch {
      const errText = await res.text().catch(() => "");
      throw new Error(`Failed to save preset: ${res.status} ${errText}`);
    }
  }
  return await res.json();
};

export const savePresets = async (
  presets: { name: string; devices: Device[] }[]
) => {
  for (const p of presets) await savePreset(p);
};

export const loadDevices = async (): Promise<Device[]> => {
  const res = await fetch(`${API_BASE}devices`);
  if (!res.ok) {
    throw new Error("Failed to load devices");
  }
  const json = await res.json();
  // If API returns { success: true, data: [...] }
  const raw = json && json.data ? json.data : json;
  // Map backend device objects to frontend Device shape
  return (raw || []).map((d: RawDevice) => ({
    id: `${d.type}-${d.id}`,
    serverId: d.id,
    name: d.name,
    type: d.type,
    settings: d.settings,
  })) as Device[];
};

export const loadPresets = async (): Promise<Preset[]> => {
  const res = await fetch(`${API_BASE}presets`);
  if (!res.ok) throw new Error("Failed to load presets");
  const json = await res.json();
  const raw = json && json.data ? json.data : json;
  return (raw || []).map((p: RawPreset) => ({
    id: `preset-${p.id}`,
    serverId: p.id,
    name: p.name,
    devices: (p.devices || []).map((d: RawDevice) => ({
      id: `${d.type}-${d.id}`,
      serverId: d.id,
      name: d.name,
      type: d.type,
      settings: d.settings,
    })),
  })) as Preset[];
};
