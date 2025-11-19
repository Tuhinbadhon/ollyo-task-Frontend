/* eslint-disable @typescript-eslint/no-explicit-any */
import { Device, Preset } from "@/types/simulator";
import { useDrop } from "react-dnd";
import DeviceFan from "./DeviceFan";
import DeviceLight from "./DeviceLight";

interface CanvasProps {
  devices: Device[];
  onDropDevice: (type: string) => void;
  onDropPreset: (preset: Preset) => void;
  onUpdateDevice: (id: string, settings: Device["settings"]) => void;
  onRemoveDevice: (id: string) => void;
  onClearAll: () => void;
  onSavePreset: () => void;
}

const Canvas = ({
  devices,
  onDropDevice,
  onDropPreset,
  onUpdateDevice,
  onRemoveDevice,
  onClearAll,
  onSavePreset,
}: CanvasProps) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ["DEVICE", "PRESET"],
    drop: (item: any) => {
      if (item.type) {
        onDropDevice(item.type);
      } else if (item.preset) {
        onDropPreset(item.preset);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div className=" ">
      <div className="flex my-5 justify-between items-center">
        <h1 className="text-gray-300 text-lg font-medium">Testing Canvas</h1>
        <div className="flex gap-2">
          <button
            onClick={onClearAll}
            className="px-4 py-2 bg-[#1e252d] hover:bg-[#2a3039] text-gray-300 text-sm rounded-lg border border-gray-700 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onSavePreset}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            Save Preset
          </button>
        </div>
      </div>
      <div className="flex-1 bg-[#0a101d]  min-h-[600px] flex flex-col gap-6 border border-gray-700 rounded-xl">
        <div
          ref={drop}
          className={`flex-1 flex items-center justify-center transition-all relative ${
            isOver && canDrop ? "ring-2 ring-blue-500/50 bg-[#0f1419]" : ""
          }`}
        >
          {devices.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <h2 className="text-gray-600">Drag anything here</h2>
            </div>
          ) : (
            <div className="w-full flex justify-center items-center ">
              {devices.map((device) =>
                device.type === "light" ? (
                  <DeviceLight
                    key={device.id}
                    id={device.id}
                    name={device.name}
                    settings={device.settings}
                    onUpdate={(settings) => onUpdateDevice(device.id, settings)}
                    onRemove={() => onRemoveDevice(device.id)}
                  />
                ) : (
                  <DeviceFan
                    key={device.id}
                    id={device.id}
                    name={device.name}
                    settings={device.settings}
                    onUpdate={(settings) => onUpdateDevice(device.id, settings)}
                    onRemove={() => onRemoveDevice(device.id)}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
