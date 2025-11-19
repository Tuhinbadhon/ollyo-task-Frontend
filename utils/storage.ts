/* eslint-disable @typescript-eslint/no-explicit-any */
import { Device, DeviceSettings, Preset } from "@/types/simulator";
import axios, { AxiosInstance } from "axios";

const API_BASE = "http://localhost:8000/api/";
const USE_CREDENTIALS = process.env.NEXT_PUBLIC_USE_CREDENTIALS === "true";
const VERBOSE_API = process.env.NEXT_PUBLIC_VERBOSE_API === "true";

const createClient = (useCredentials = false): AxiosInstance =>
  axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    withCredentials: useCredentials,
  });

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
  const client = createClient(USE_CREDENTIALS);
  try {
    const resp = await client.post("devices", payload);
    return resp.data && resp.data.data ? resp.data.data : resp.data;
  } catch (err: unknown) {
    if (USE_CREDENTIALS) {
      // try again without credentials
      try {
        const client2 = createClient(false);
        const resp2 = await client2.post("devices", payload);
        return resp2.data && resp2.data.data ? resp2.data.data : resp2.data;
      } catch (err2: unknown) {
        // map axios errors
        const message =
          err2?.response?.data?.message ?? err2?.message ?? String(err2);
        const status = err2?.response?.status;
        throw new Error(`Failed to save device (status ${status}): ${message}`);
      }
    }
    // Narrow unknown into object to access axios response data.
    const aerr = err as {
      response?: { data?: Record<string, unknown>; status?: number };
      message?: string;
    };
    const message =
      aerr?.response?.data?.message ?? aerr?.message ?? String(err);
    const status = aerr?.response?.status;
    throw new Error(`Failed to save device (status ${status}): ${message}`);
  }
};

export const saveDevices = async (devices: Device[]) => {
  for (const d of devices) await saveDevice(d);
};

export const updateDevice = async (
  id: string | number,
  device: Partial<Device>
) => {
  const client = createClient(USE_CREDENTIALS);
  try {
    const resp = await client.put(`devices/${id}`, device);
    return resp.data && resp.data.data ? resp.data.data : resp.data;
  } catch (err: unknown) {
    if (USE_CREDENTIALS) {
      try {
        const client2 = createClient(false);
        const resp2 = await client2.put(`devices/${id}`, device);
        return resp2.data && resp2.data.data ? resp2.data.data : resp2.data;
      } catch (err2: unknown) {
        const aerr = err2 as {
          response?: { data?: Record<string, unknown>; status?: number };
          message?: string;
        };
        const message =
          aerr?.response?.data?.message ?? aerr?.message ?? String(err2);
        const status = aerr?.response?.status;
        throw new Error(
          `Failed to update device (status ${status}): ${message}`
        );
      }
    }
    const aerr = err as {
      response?: { data?: Record<string, unknown>; status?: number };
      message?: string;
    };
    const message =
      aerr?.response?.data?.message ?? aerr?.message ?? String(err);
    const status = aerr?.response?.status;
    throw new Error(`Failed to update device (status ${status}): ${message}`);
  }
};

export const deleteDevice = async (id: string | number) => {
  const client = createClient(USE_CREDENTIALS);
  try {
    const resp = await client.delete(`devices/${id}`);
    return resp.data && resp.data.data ? resp.data.data : resp.data;
  } catch (err: unknown) {
    if (USE_CREDENTIALS) {
      try {
        const client2 = createClient(false);
        const resp2 = await client2.delete(`devices/${id}`);
        return resp2.data && resp2.data.data ? resp2.data.data : resp2.data;
      } catch (err2: unknown) {
        const aerr = err2 as {
          response?: { data?: Record<string, unknown>; status?: number };
          message?: string;
        };
        const message =
          aerr?.response?.data?.message ?? aerr?.message ?? String(err2);
        const status = aerr?.response?.status;
        throw new Error(
          `Failed to delete device (status ${status}): ${message}`
        );
      }
    }
    const aerr = err as {
      response?: { data?: Record<string, unknown>; status?: number };
      message?: string;
    };
    const message =
      aerr?.response?.data?.message ?? aerr?.message ?? String(err);
    const status = aerr?.response?.status;
    throw new Error(`Failed to delete device (status ${status}): ${message}`);
  }
};

// Preset APIs
export const savePreset = async (preset: {
  name: string;
  devices: Device[];
}) => {
  const payload = preset;
  let res: Response | undefined;

  // --- Attempt 1: WITH credentials ---
  try {
    res = await fetch(`${API_BASE}presets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      ...(USE_CREDENTIALS ? { credentials: "include" } : {}),
    });

    if (!res.ok) throw new Error(`Status ${res.status} ${res.statusText}`);
  } catch (err) {
    console.warn(
      "savePreset: initial POST failed, trying without credentials:",
      err
    );

    // --- Attempt 2: WITHOUT credentials ---
    try {
      res = await fetch(`${API_BASE}presets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Status ${res.status} ${res.statusText}`);
    } catch (err2) {
      console.error(
        "savePreset: POST failed both with and without credentials:",
        err,
        err2
      );
      throw err2;
    }
  }

  // At this point we have a response
  if (!res) throw new Error("No response returned from server");

  if (!res.ok) {
    try {
      const errJson = await res.json();

      // Laravel validation errors (422)
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

  // Parse final response
  try {
    const json = await res.json();
    console.debug("savePreset response:", res.status, json);
    return json ?? {};
  } catch {
    console.debug("savePreset response empty or invalid JSON", res.status);
    return {};
  }
};

export const updatePreset = async (id: string, payload: any) => {
  let res: Response;

  try {
    // Try WITH credentials
    res = await fetch(`${API_BASE}presets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      ...(USE_CREDENTIALS ? { credentials: "include" } : {}),
    });

    if (!res.ok) throw new Error(`Status ${res.status} ${res.statusText}`);
  } catch (err) {
    console.warn(
      "updatePreset: initial PUT failed, trying WITHOUT credentials:",
      err
    );

    try {
      // Try WITHOUT credentials
      res = await fetch(`${API_BASE}presets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Status ${res.status} ${res.statusText}`);
    } catch (err2) {
      console.error(
        "updatePreset: PUT failed both with and without credentials:",
        err,
        err2
      );
      throw err2;
    }
  }

  // At this point res is OK or at least has a response we can read
  try {
    const json = await res.json();

    // Handle Laravel validation error (422)
    if (res.status === 422 && json.errors) {
      const messages = Object.values(json.errors).flat().join(", ");
      throw new Error(messages || "Validation error");
    }

    console.debug("updatePreset response:", res.status, json);

    return json?.data ?? json;
  } catch {
    const fallback = await res.text().catch(() => "");
    throw new Error(`Failed to update preset: ${res.status} ${fallback}`);
  }
};

export const savePresets = async (
  presets: { name: string; devices: Device[] }[]
) => {
  for (const p of presets) await savePreset(p);
};

export const loadDevices = async (): Promise<Device[]> => {
  // Include credentials if the server uses session auth
  let res: Response;
  // Attempt with credentials first, then fallback to no-credentials
  try {
    const attempt = `${API_BASE}devices`;
    if (VERBOSE_API)
      console.debug("fetching devices (credentials):", USE_CREDENTIALS);
    res = await fetch(
      attempt,
      USE_CREDENTIALS ? { credentials: "include" } : {}
    );
    if (!res.ok) throw new Error(`Status ${res.status} ${res.statusText}`);
  } catch (err) {
    console.warn(
      "loadDevices with credentials failed, trying without credentials:",
      err
    );
    // fallback attempt with no credentials
    try {
      res = await fetch(`${API_BASE}devices`);
      if (!res.ok) throw new Error(`Status ${res.status} ${res.statusText}`);
    } catch (err2) {
      console.error("loadDevices network error (both attempts):", err, err2);
      throw new Error(
        `Failed to reach backend (devices): ${
          err instanceof Error ? err.message : String(err)
        }; ${err2 instanceof Error ? err2.message : String(err2)}`
      );
    }
  }
  const json = await res.json();
  console.debug("loadDevices response:", res.status, json);
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
  let res: Response;
  try {
    const attempt = `${API_BASE}presets`;
    if (VERBOSE_API)
      console.debug("fetching presets (credentials):", USE_CREDENTIALS);
    res = await fetch(
      attempt,
      USE_CREDENTIALS ? { credentials: "include" } : {}
    );
    if (!res.ok) throw new Error(`Status ${res.status} ${res.statusText}`);
  } catch (err) {
    console.warn(
      "loadPresets with credentials failed, trying without credentials:",
      err
    );
    try {
      res = await fetch(`${API_BASE}presets`);
      if (!res.ok) throw new Error(`Status ${res.status} ${res.statusText}`);
    } catch (err2) {
      console.error("loadPresets network error (both attempts):", err, err2);
      throw new Error(
        `Failed to reach backend (presets): ${
          err instanceof Error ? err.message : String(err)
        }; ${err2 instanceof Error ? err2.message : String(err2)}`
      );
    }
  }
  const json = await res.json();
  console.debug("loadPresets response:", res.status, json);
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
