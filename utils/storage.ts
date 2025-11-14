import { Device, Preset } from "@/types/simulator";

const DEVICES_KEY = "simulator_devices";
const PRESETS_KEY = "simulator_presets";

export const saveDevices = (devices: Device[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
  }
};

export const loadDevices = (): Device[] => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(DEVICES_KEY);
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

export const savePresets = (presets: Preset[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  }
};

export const loadPresets = (): Preset[] => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(PRESETS_KEY);
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};
