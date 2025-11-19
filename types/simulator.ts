export interface DeviceSettings {
  power: boolean;
  brightness?: number;
  color?: string;
  speed?: number;
}

export interface Device {
  id: string; // client-side id used in UI
  serverId?: number; // backend database id (if present)
  name?: string; // human-readable device name
  type: "light" | "fan";
  settings: DeviceSettings;
}

export interface Preset {
  id: string;
  serverId?: number;
  name: string;
  devices: Device[];
}
