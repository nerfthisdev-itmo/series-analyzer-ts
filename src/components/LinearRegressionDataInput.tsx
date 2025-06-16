import { useEffect, useState } from "react";

interface Props {
  onSubmit: (x: Array<number>, y: Array<number>, z: Array<number>) => void;
}

export const LinearRegressionDataInput = ({ onSubmit }: Props) => {
  const [rawX, setRawX] = useState("");
  const [rawY, setRawY] = useState("");
  const [rawZ, setRawZ] = useState("");

  // Load saved data on mount
  useEffect(() => {
    const savedX = localStorage.getItem("inputX");
    const savedY = localStorage.getItem("inputY");
    const savedZ = localStorage.getItem("inputZ");
    if (savedX) setRawX(savedX);
    if (savedY) setRawY(savedY);
    if (savedZ) setRawZ(savedZ);
  }, []);

  // Parse input string into number array
  const parseInput = (text: string): Array<number> => {
    return text
      .split(/[\s,]+/)
      .map((n) => parseFloat(n))
      .filter((n) => !isNaN(n));
  };

  // File upload handler
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setter(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      {/* Input for X */}
      <div>
        <label className="block font-bold">Данные X:</label>
        <textarea
          value={rawX}
          onChange={(e) => setRawX(e.target.value)}
          className="p-2 border rounded w-full"
          rows={3}
          placeholder="Пример: 1, 2, 3 или 1 2 3"
        />
        <input
          type="file"
          accept=".txt,.json"
          onChange={(e) => handleFileUpload(e, setRawX)}
          className="mt-1"
        />
      </div>

      {/* Input for Y */}
      <div>
        <label className="block font-bold">Данные Y:</label>
        <textarea
          value={rawY}
          onChange={(e) => setRawY(e.target.value)}
          className="p-2 border rounded w-full"
          rows={3}
          placeholder="Пример: 4, 5, 6 или 4 5 6"
        />
        <input
          type="file"
          accept=".txt,.json"
          onChange={(e) => handleFileUpload(e, setRawY)}
          className="mt-1"
        />
      </div>

      {/* Input for Z */}
      <div>
        <label className="block font-bold">Данные Z:</label>
        <textarea
          value={rawZ}
          onChange={(e) => setRawZ(e.target.value)}
          className="p-2 border rounded w-full"
          rows={3}
          placeholder="Пример: 7, 8, 9 или 7 8 9"
        />
        <input
          type="file"
          accept=".txt,.json"
          onChange={(e) => handleFileUpload(e, setRawZ)}
          className="mt-1"
        />
      </div>

      {/* Submit & Reset Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            const parsedX = parseInput(rawX);
            const parsedY = parseInput(rawY);
            const parsedZ = parseInput(rawZ);

            onSubmit(parsedX, parsedY, parsedZ);

            localStorage.setItem("inputX", rawX);
            localStorage.setItem("inputY", rawY);
            localStorage.setItem("inputZ", rawZ);
          }}
          type="button"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Построить
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("inputX");
            localStorage.removeItem("inputY");
            localStorage.removeItem("inputZ");
            setRawX("");
            setRawY("");
            setRawZ("");
            location.reload();
          }}
          type="button"
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        >
          Сбросить данные
        </button>
      </div>
    </div>
  );
};
