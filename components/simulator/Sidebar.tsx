import { Preset } from "@/types/simulator";
import { useDrag } from "react-dnd";

interface SidebarProps {
  presets: Preset[];
}

const DEVICE_TYPES = [
  { type: "light", label: "Light", icon: "💡" },
  { type: "fan", label: "Fan", icon: "🌀" },
];

const Sidebar = ({ presets }: SidebarProps) => {
  return (
    <aside className="w-64 bg-[#0f1419] p-6 flex flex-col gap-8 border-r border-gray-700">
      <div>
        <h2 className="font-semibold mb-4 text-gray-300 text-sm">Devices</h2>
        <div className="flex flex-col gap-2">
          {DEVICE_TYPES.map((device) => (
            <DraggableDevice
              key={device.type}
              type={device.type}
              label={device.label}
              icon={device.icon}
            />
          ))}
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-300 text-sm">Saved Presets</h2>
        </div>
        <div className="flex flex-col gap-2">
          {presets.length === 0 ? (
            <div className="text-gray-500 text-sm p-3 bg-[#1a1f26] rounded-lg">
              Nothing added yet
            </div>
          ) : (
            presets.map((preset) => (
              <DraggablePreset key={preset.id} preset={preset} />
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

function DraggableDevice({
  type,
  label,
  icon,
}: {
  type: string;
  label: string;
  icon: string;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "DEVICE",
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 rounded-lg cursor-move transition-all flex items-center gap-3 ${
        isDragging
          ? "opacity-50 bg-[#2a3039]"
          : "bg-[#1e252d] hover:bg-[#2a3039]"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-gray-200 text-sm">{label}</span>
    </div>
  );
}

function DraggablePreset({ preset }: { preset: Preset }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "PRESET",
    item: { preset },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 rounded-lg cursor-move transition-all ${
        isDragging
          ? "opacity-50 bg-[#2a3039]"
          : "bg-[#1e252d] hover:bg-[#2a3039]"
      }`}
    >
      <span className="text-gray-200 text-sm">{preset.name}</span>
    </div>
  );
}

export default Sidebar;
