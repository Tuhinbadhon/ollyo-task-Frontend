interface DeviceFanProps {
  id: string;
  settings: {
    power: boolean;
    speed: number;
  };
  onUpdate: (settings: { power: boolean; speed: number }) => void;
  onRemove: () => void;
}

const DeviceFan = ({ settings, onUpdate }: DeviceFanProps) => {
  const handlePowerToggle = () => {
    onUpdate({ ...settings, power: !settings.power });
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...settings, speed: parseInt(e.target.value) });
  };

  // Calculate animation duration based on speed (higher speed = faster rotation)
  const animationDuration =
    settings.speed > 0 ? `${(101 - settings.speed) / 20}s` : "0s";

  return (
    <div className="device-fan w-full max-w-2xl">
      {/* Fan Visualization */}
      <div className="mb-2 h-96  flex items-center justify-center relative overflow-hidden">
        {/* Fan blades */}
        <div className="relative w-72 h-72">
          <style jsx>{`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            style={{
              animation:
                settings.power && settings.speed > 0
                  ? `spin ${animationDuration} linear infinite`
                  : "none",
              opacity: settings.power ? 1 : 0.3,
              transition: settings.power ? "opacity 0.3s" : "opacity 0.3s",
            }}
          >
            {/* Center circle */}
            <circle cx="100" cy="100" r="15" fill="#4a5568" />

            {/* Fan blades - 3 blade design like the image */}
            {[0, 120, 240].map((angle) => (
              <g key={angle} transform={`rotate(${angle} 100 100)`}>
                <ellipse
                  cx="100"
                  cy="50"
                  rx="25"
                  ry="45"
                  fill={settings.power ? "#6b7280" : "#374151"}
                  opacity="0.8"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Controller Panel */}
      <div className="mt-1  bg-[#1a1f26] rounded-2xl p-6 border border-gray-700 shadow-xl max-w-sm mx-auto">
        {/* Power Toggle */}
        <div className="mb-6">
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

        {/* Speed Slider */}
        <div>
          <label className="block mb-2">
            <span className="text-gray-300 font-medium">Speed</span>
            <span className="text-gray-400 ml-2">{settings.speed}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.speed}
            onChange={handleSpeedChange}
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
                ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${settings.speed}%, #374151 ${settings.speed}%, #374151 100%)`
                : "#374151",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DeviceFan;
