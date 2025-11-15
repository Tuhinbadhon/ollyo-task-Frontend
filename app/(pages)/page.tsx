"use client";

import { Modal } from "@/components/ui/modal";
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
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const [devices, setDevices] = useState<Device[]>(() => loadDevices());
  const [presets, setPresets] = useState<Preset[]>(() => loadPresets());
  const [showModal, setShowModal] = useState(false);
  const [presetName, setPresetName] = useState("");

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
    setShowModal(true);
    setPresetName("");
  };

  const handleModalConfirm = () => {
    if (!presetName || devices.length === 0) return;
    const newPreset: Preset = {
      id: `preset-${Date.now()}`,
      name: presetName,
      devices: JSON.parse(JSON.stringify(devices)),
    };
    setPresets([...presets, newPreset]);
    setShowModal(false);
    setPresetName("");
    toast.success("Preset saved");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster position="top-center" />
      <div className="flex min-h-screen bg-[#0a0e13]">
        <Sidebar presets={presets} />
        <div className="mx-5 w-full">
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
        {/* Shadcn Modal */}
        <Modal
          open={showModal}
          title={
            <div className="flex items-center pb-3 border-b border-gray-700 justify-between">
              <span className="text-lg font-bold text-gray-100">
                Give me a name
              </span>
              <button
                className="text-gray-400 hover:text-gray-200 text-2xl font-bold ml-2"
                onClick={() => setShowModal(false)}
                aria-label="Close"
                tabIndex={0}
              >
                &times;
              </button>
            </div>
          }
          onClose={() => setShowModal(false)}
          footer={
            devices.length === 0 ? (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full font-semibold shadow hover:bg-blue-700 "
                onClick={() => setShowModal(false)}
              >
                OK
              </button>
            ) : (
              <div className="flex  gap-3">
                <button
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg w-max  font-semibold shadow hover:bg-gray-800 "
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg w-max font-semibold shadow hover:bg-blue-700 "
                  onClick={handleModalConfirm}
                  disabled={!presetName}
                >
                  Save Preset
                </button>
              </div>
            )
          }
        >
          {devices.length === 0 ? (
            <div className="text-red-500 mb-4 text-center text-lg font-medium">
              Add some devices first!
            </div>
          ) : (
            <>
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-700 my-2 bg-gray-800 text-white text-sm  focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Name it"
              />
              <div className="text-gray-400 text-sm mb-4">
                By adding this effect as a present you can reuse this anytime.
              </div>
            </>
          )}
        </Modal>
      </div>
    </DndProvider>
  );
}
