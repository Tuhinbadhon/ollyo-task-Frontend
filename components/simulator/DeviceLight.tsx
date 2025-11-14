interface DeviceLightProps {
  id: string;
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
  { name: "Warm", value: "#FFB84D", class: "bg-orange-300" },
  { name: "Neutral", value: "#FFFACD", class: "bg-yellow-100" },
  { name: "Cool", value: "#E0F7FF", class: "bg-blue-100" },
  { name: "Pink", value: "#FFB6C1", class: "bg-pink-200" },
  { name: "Purple", value: "#DDA0DD", class: "bg-purple-200" },
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
    <div className="device-light w-full max-w-2xl">
      {/* Light Visualization */}
      <div className="mb-6 h-64 rounded-2xl bg-[#0f1419] flex items-center justify-center relative overflow-hidden border border-gray-700">
        {/* Radial glow effect - spreads from center */}
        {settings.power && (
          <>
            <div
              className="absolute inset-0 transition-all duration-300"
              style={{
                background: `radial-gradient(circle at center, ${settings.color} 0%, ${settings.color}99 20%, ${settings.color}66 40%, ${settings.color}33 60%, transparent 80%)`,
                opacity: lightOpacity * 0.8,
              }}
            />
            <div
              className="absolute inset-0 transition-all duration-300 blur-xl"
              style={{
                background: `radial-gradient(circle at center, ${settings.color} 0%, ${settings.color}AA 30%, transparent 70%)`,
                opacity: lightOpacity * 0.6,
              }}
            />
          </>
        )}

        {/* Light bulb */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className="text-8xl transition-all duration-300"
            style={{
              filter: settings.power
                ? `drop-shadow(0 0 ${settings.brightness / 2}px ${
                    settings.color
                  })`
                : "none",
              textShadow: settings.power
                ? `0 0 ${settings.brightness}px ${settings.color}`
                : "none",
            }}
          >
            💡
          </div>
        </div>
      </div>

      {/* Controller Panel */}
      <div className="bg-[#1a1f26] rounded-2xl p-6 border border-gray-700 space-y-6">
        {/* Power Toggle */}
        <div>
          <label className="flex items-center justify-between">
            <span className="text-gray-300 font-medium">Power</span>
            <button
              onClick={handlePowerToggle}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.power ? "bg-blue-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 ${
                  settings.power ? "right-0.5" : "left-0.5"
                }`}
              />
            </button>
          </label>
        </div>

        {/* Brightness Slider */}
        <div>
          <label className="block mb-3">
            <span className="text-gray-300 font-medium">Brightness</span>
            <span className="text-gray-400 ml-2">{settings.brightness}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.brightness}
            onChange={handleBrightnessChange}
            disabled={!settings.power}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-0"
            style={{
              background: settings.power
                ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${settings.brightness}%, #374151 ${settings.brightness}%, #374151 100%)`
                : "#374151",
            }}
          />
        </div>

        {/* Color Temperature */}
        <div>
          <label className="block mb-3 text-gray-300 font-medium">
            Color Temperature
          </label>
          <div className="flex gap-2 flex-wrap">
            {COLOR_TEMPS.map((temp) => (
              <button
                key={temp.name}
                onClick={() => handleColorChange(temp.value)}
                disabled={!settings.power}
                className={`px-4 py-2 rounded-lg border transition-all disabled:opacity-50 ${
                  settings.color === temp.value
                    ? "border-blue-500 bg-[#2a3039]"
                    : "border-gray-600 bg-[#1e252d] hover:bg-[#2a3039]"
                } ${temp.class}`}
                title={temp.name}
                style={{
                  backgroundColor:
                    settings.color === temp.value ? temp.value : undefined,
                  opacity: settings.color === temp.value ? 0.3 : undefined,
                }}
              >
                <span className="text-gray-200 text-sm">{temp.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceLight;
