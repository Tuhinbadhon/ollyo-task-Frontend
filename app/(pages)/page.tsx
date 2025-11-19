/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Modal } from "@/components/ui/modal";
import { Device, Preset } from "@/types/simulator";
import {
  loadDevices,
  loadPresets,
  savePreset,
  updatePreset,
} from "@/utils/storage";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import toast, { Toaster } from "react-hot-toast";
import Canvas from "../../components/simulator/Canvas";
import Sidebar from "../../components/simulator/Sidebar";

export default function Page() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [editingPresetServerId, setEditingPresetServerId] = useState<
    string | number | null
  >(null);
  const [shouldUpdateExisting, setShouldUpdateExisting] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load devices and presets from backend when component mounts
  useEffect(() => {
    const load = async () => {
      try {
        const [d, p] = await Promise.all([loadDevices(), loadPresets()]);
        setDevices(d ?? []);
        setPresets(p ?? []);
      } catch (err) {
        console.error(err);
        // Show the backend error in the toast for clarity
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load devices/presets from backend";
        toast.error(message);
      }
    };
    load();
  }, []);

  const handleDropDevice = (type: string) => {
    const now = Date.now();
    const newDevice: Device = {
      id: `${type}-${now}`,
      name: `${type}-${type}-${now}`,
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
        serverId: undefined,
        id: `${d.type}-${Date.now()}-${Math.random()}`,
      }))
    );
    // Keep track that the user loaded a server preset so that saving will update instead of create
    setEditingPresetServerId(preset.serverId ?? null);
    setShouldUpdateExisting(true);
    setPresetName(preset.name ?? "");
  };

  const handleUpdateDevice = (id: string, settings: Device["settings"]) => {
    const updated = devices.map((d) => (d.id === id ? { ...d, settings } : d));
    setDevices(updated);
    return;
  };

  const handleRemoveDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  const handleClearAll = () => {
    setDevices([]);
  };

  // Note: debug logs related to preset saving are emitted in the save handler after `devicesPayload` is available
  const handleSavePreset = () => {
    setShowModal(true);
    // If we're not editing an existing preset, clear the name; otherwise keep it prefilled
    if (!editingPresetServerId) setPresetName("");
    // default update toggle when opening modal
    if (editingPresetServerId) setShouldUpdateExisting(true);
  };

  const handleModalConfirm = async () => {
    if (!presetName || devices.length === 0) return;

    try {
      setIsSaving(true);

      const devicesPayload = devices.map(({ type, name, settings }) => ({
        type,
        name,
        settings,
      }));

      console.debug("Saving preset", {
        presetName,
        devicesPayload,
        editingPresetServerId,
        shouldUpdateExisting,
      });

      //   UPDATE EXISTING PRESET

      if (editingPresetServerId && shouldUpdateExisting) {
        const updated = await updatePreset(editingPresetServerId, {
          name: presetName,
          devices: devicesPayload,
        });

        // console.debug("updatePreset returned:", updated);

        const mappedDevices = (updated.devices || devices).map((d: any) => ({
          id: `${d.type}-${d.id ?? Math.random()}`,
          serverId: d.id ?? undefined,
          name: d.name,
          type: d.type,
          settings: d.settings,
        }));

        // Update local list
        setPresets((prev) =>
          prev.map((p) =>
            p.serverId === editingPresetServerId
              ? {
                  ...p,
                  name: updated.name || presetName,
                  devices: mappedDevices,
                }
              : p
          )
        );

        // Refresh from backend
        try {
          const refreshed = await loadPresets();
          if (refreshed) setPresets(refreshed);

          const updatedId = updated.id ?? editingPresetServerId;
          const found = refreshed?.some((p) => p.serverId === updatedId);

          if (!found) {
            toast.error(
              "Server did not persist the updated preset. Check backend logs or CORS/auth."
            );
          }
        } catch (err) {
          console.error("Failed to reload presets after update:", err);
        }
      }

      // ==========================
      //      CREATE NEW PRESET
      // ==========================
      else {
        const newPreset: Preset = {
          id: `preset-temp-${Date.now()}`,
          name: presetName,
          devices: JSON.parse(JSON.stringify(devices)),
        };

        setPresets((prev) => [...prev, newPreset]);

        const res = await savePreset({
          name: presetName,
          devices: devicesPayload,
        });

        const created = res?.data ?? res;

        if (created?.id) {
          const mappedDevices = created.devices.map((d: any) => ({
            id: `${d.type}-${d.id}`,
            serverId: d.id,
            name: d.name,
            type: d.type,
            settings: d.settings,
          }));

          const serverPreset: Preset = {
            id: `preset-${created.id}`,
            serverId: created.id,
            name: created.name,
            devices: mappedDevices,
          };

          // Replace temp preset with server version
          setPresets((prev) =>
            prev.map((p) => (p.id === newPreset.id ? serverPreset : p))
          );

          try {
            const refreshed = await loadPresets();
            if (refreshed) setPresets(refreshed);

            if (
              created.id &&
              !refreshed?.some((p) => p.serverId === created.id)
            ) {
              toast.error(
                "Server did not persist the created preset. Check backend logs or CORS/auth."
              );
            }
          } catch (err) {
            console.error("Failed to reload presets after create:", err);
          }
        }
      }

      // ==========================
      //        CLEANUP
      // ==========================
      setEditingPresetServerId(null);
      setShouldUpdateExisting(true);
      toast.success("Preset successfully saved!");
    } catch (err: unknown) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Failed to save preset to backend"
      );
    } finally {
      setIsSaving(false);
      setShowModal(false);
      setPresetName("");
    }
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
                onClick={() => {
                  setShowModal(false);
                  setEditingPresetServerId(null);
                }}
                aria-label="Close"
                tabIndex={0}
              >
                &times;
              </button>
            </div>
          }
          onClose={() => {
            setShowModal(false);
            setEditingPresetServerId(null);
            setShouldUpdateExisting(true);
          }}
          footer={
            devices.length === 0 ? (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full font-semibold shadow hover:bg-blue-700 "
                onClick={() => {
                  setShowModal(false);
                  setEditingPresetServerId(null);
                  setShouldUpdateExisting(true);
                }}
              >
                OK
              </button>
            ) : (
              <div className="flex  gap-3">
                <button
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg w-max  font-semibold shadow hover:bg-gray-800 "
                  onClick={() => {
                    setShowModal(false);
                    setEditingPresetServerId(null);
                    setShouldUpdateExisting(true);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg w-max font-semibold shadow hover:bg-blue-700 "
                  onClick={handleModalConfirm}
                  disabled={!presetName || isSaving}
                >
                  {isSaving ? "Saving..." : "Save Preset"}
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
              {editingPresetServerId && (
                <div className="mb-2 text-sm text-gray-300 flex items-center gap-2">
                  <input
                    id="updateExisting"
                    type="checkbox"
                    checked={shouldUpdateExisting}
                    onChange={(e) => setShouldUpdateExisting(e.target.checked)}
                    className="accent-blue-500"
                  />
                  <label htmlFor="updateExisting">Update existing preset</label>
                </div>
              )}
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
