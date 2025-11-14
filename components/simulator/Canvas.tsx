import { useDrop } from "react-dnd";
import DeviceFan from "./DeviceFan";
import DeviceLight from "./DeviceLight";

interface Device {
  id: string;
  type: string;
  settings: any;
}

interface CanvasProps {
  devices: Device[];
  onDropDevice: (type: string) => void;
  onDropPreset: (preset: any) => void;
  onUpdateDevice: (id: string, settings: any) => void;
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
    <main
      ref={drop}
      className={`flex-1 bg-[#0a0e13] p-8 min-h-[600px] flex flex-col items-center justify-center gap-6 border border-gray-700 rounded-xl transition-all relative ${
        isOver && canDrop ? "ring-2 ring-blue-500/50 bg-[#0f1419]" : ""
      }`}
    >
      <div className="absolute top-6 left-6">
        <h1 className="text-gray-300 text-lg font-medium">Testing Canvas</h1>
      </div>
      <div className="absolute top-6 right-6 flex gap-2">
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

      {devices.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            className="opacity-20"
          >
            <path
              d="M40 10 L40 70 M10 40 L70 40"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-600"
            />
            <circle
              cx="40"
              cy="40"
              r="15"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-600"
            />
          </svg>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 w-full max-w-5xl">
          {devices.map((device) =>
            device.type === "light" ? (
              <DeviceLight
                key={device.id}
                id={device.id}
                settings={device.settings}
                onUpdate={(settings) => onUpdateDevice(device.id, settings)}
                onRemove={() => onRemoveDevice(device.id)}
              />
            ) : (
              <DeviceFan
                key={device.id}
                id={device.id}
                settings={device.settings}
                onUpdate={(settings) => onUpdateDevice(device.id, settings)}
                onRemove={() => onRemoveDevice(device.id)}
              />
            )
          )}
        </div>
      )}
    </main>
  );
};

export default Canvas;
