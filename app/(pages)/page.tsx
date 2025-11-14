"use client";

import { Device, Preset } from "@/types/simulator";
import {
  loadDevices,
  loadPresets,
  saveDevices,
  savePresets,
} from "@/utils/storage";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Canvas from "../../components/simulator/Canvas";
import Sidebar from "../../components/simulator/Sidebar";

export default function Page() {
  const [devices, setDevices] = useState<Device[]>(() => loadDevices());
  const [presets, setPresets] = useState<Preset[]>(() => loadPresets());

  // Save to localStorage when devices change
  useEffect(() => {
    saveDevices(devices);
  }, [devices]);

  // Save to localStorage when presets change
  useEffect(() => {
    savePresets(presets);
  }, [presets]);

  const handleDropDevice = (type: string) => {
    const newDevice: Device = {
      id: `${type}-${Date.now()}`,
      type: type as "light" | "fan",
      settings:
        type === "light"
          ? { power: false, brightness: 50, color: "#FFFACD" }
          : { power: false, speed: 50 },
    };
    // Replace all devices with only the newly dropped device
    setDevices([newDevice]);
  };

  const handleDropPreset = (preset: Preset) => {
    setDevices(
      preset.devices.map((d) => ({
        ...d,
        id: `${d.type}-${Date.now()}-${Math.random()}`,
      }))
    );
  };

  const handleUpdateDevice = (id: string, settings: Device["settings"]) => {
    setDevices(devices.map((d) => (d.id === id ? { ...d, settings } : d)));
  };

  const handleRemoveDevice = (id: string) => {
    setDevices(devices.filter((d) => d.id !== id));
  };

  const handleClearAll = () => {
    setDevices([]);
  };

  const handleSavePreset = () => {
    if (devices.length === 0) {
      alert("Add some devices first!");
      return;
    }
    const name = prompt("Enter preset name:");
    if (name) {
      const newPreset: Preset = {
        id: `preset-${Date.now()}`,
        name,
        devices: JSON.parse(JSON.stringify(devices)),
      };
      setPresets([...presets, newPreset]);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen bg-[#0a0e13]">
        <Sidebar presets={presets} />
        <div className="flex-1 flex items-center justify-center p-8">
          <Canvas
            devices={devices}
            onDropDevice={handleDropDevice}
            onDropPreset={handleDropPreset}
            onUpdateDevice={handleUpdateDevice}
            onRemoveDevice={handleRemoveDevice}
            onClearAll={handleClearAll}
            onSavePreset={handleSavePreset}
          />
        </div>
      </div>
    </DndProvider>
  );
}
