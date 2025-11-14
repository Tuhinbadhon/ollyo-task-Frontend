const Preset = ({ name }: { name: string }) => {
  return (
    <div
      className="preset-item p-2 bg-gray-200 rounded cursor-pointer"
      draggable
    >
      {name}
    </div>
  );
};

export default Preset;
