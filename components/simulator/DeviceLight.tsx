// Updated DeviceLight Component with fixed z-index, cleaner layout, and improved glow aesthetics
import React from "react";

interface DeviceLightProps {
  id: string;
  name?: string;
  settings: {
    power: boolean;
    brightness: number;
    color: string;
  };
  onUpdate: (settings: {
    power: boolean;
    brightness: number;
    color: string;
  }) => void;
  onRemove: () => void;
}

const COLOR_TEMPS = [
  { name: "Warm", value: "#FFB84D" },
  { name: "Neutral", value: "#FFFACD" },
  { name: "Cool", value: "#E0F7FF" },
  { name: "Pink", value: "#FFB6C1" },
];

const DeviceLight = ({ settings, onUpdate }: DeviceLightProps) => {
  const handlePowerToggle = () => {
    onUpdate({ ...settings, power: !settings.power });
  };

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...settings, brightness: parseInt(e.target.value) });
  };

  const handleColorChange = (color: string) => {
    onUpdate({ ...settings, color });
  };

  const lightOpacity = settings.power ? settings.brightness / 100 : 0;

  return (
    <div className="device-ligh overflow-hiddent w-full max-w-md mx-auto relative p-4">
      {/* Light Visualization */}
      <div className="relative flex items-center justify-center mb-10 mt-6 h-64 overflow-visible">
        {/* Glow Layers */}
        {settings.power && (
          <>
            <div
              className="absolute inset-0 z-0 pointer-events-none transition-all duration-500"
              style={{
                background: `radial-gradient(circle, ${settings.color} 0%, ${settings.color}99 25%, transparent 70%)`,
                opacity: lightOpacity * 0.9,
                filter: "blur(25px)",
              }}
            />
            <div
              className="absolute inset-0 z-0 pointer-events-none transition-all duration-500"
              style={{
                background: `radial-gradient(circle, ${settings.color} 0%, transparent 60%)`,
                opacity: lightOpacity * 0.5,
                filter: "blur(50px)",
              }}
            />
          </>
        )}

        {/* Light bulb */}
        <div className="relative z-20 flex flex-col items-center">
          <div
            className="text-9xl transition-all duration-700 transform hover:scale-110"
            style={{
              transform: "rotate(180deg)",
              filter: settings.power
                ? `drop-shadow(0 0 ${settings.brightness * 1.5}px ${
                    settings.color
                  })`
                : "grayscale(100%) brightness(0.5)",
            }}
          >
            💡
          </div>
        </div>
      </div>

      {/* Controller Panel */}

      <div className="mt-1  bg-linear-to-br from-[#1a1f26] to-[#141921] rounded-2xl p-6 border border-gray-700 shadow-2xl space-y-2 relative z-30">
        {/* Power Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300 font-medium text-lg">Power</span>
          <button
            onClick={handlePowerToggle}
            className={`w-12 h-6 rounded-full transition-all duration-300 relative shadow-inner ${
              settings.power
                ? "bg-linear-to-r from-blue-500 to-blue-600"
                : "bg-gray-600"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-all duration-300 absolute top-0.5 shadow-lg ${
                settings.power ? "right-0.5 scale-105" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Color Temperature */}
        <div>
          <label className="block mb-2 text-gray-300 font-medium text-lg">
            Color Temperature
          </label>
          <div className="grid grid-cols-4 gap-3">
            {COLOR_TEMPS.map((temp) => (
              <button
                key={temp.name}
                onClick={() => handleColorChange(temp.value)}
                disabled={!settings.power}
                className={`h-12 rounded-xl border shadow-md transition-all hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-40 ${
                  settings.color === temp.value
                    ? "border-blue-400 ring-2 ring-blue-500/60 scale-105"
                    : "border-gray-600 bg-[#1e252d] hover:bg-[#2a3039]"
                }`}
                style={{ backgroundColor: temp.value }}
                title={temp.name}
              />
            ))}
          </div>
        </div>

        {/* Brightness Slider */}
        <div>
          <label className="block mb-2 text-gray-300 font-medium text-lg">
            Brightness{" "}
            <span className="text-gray-400">({settings.brightness}%)</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.brightness}
            onChange={handleBrightnessChange}
            disabled={!settings.power}
            className="w-full h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-40
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-moz-range-thumb]:w-5
              [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white"
            style={{
              background: settings.power
                ? `linear-gradient(to right, ${settings.color} 0%, ${settings.color} ${settings.brightness}%, #374151 ${settings.brightness}%, #374151 100%)`
                : "#374151",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DeviceLight;
