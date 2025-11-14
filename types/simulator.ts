export interface DeviceSettings {
  power: boolean;
  brightness?: number;
  color?: string;
  speed?: number;
}

export interface Device {
  id: string;
  type: "light" | "fan";
  settings: DeviceSettings;
}

export interface Preset {
  id: string;
  name: string;
  devices: Device[];
}
