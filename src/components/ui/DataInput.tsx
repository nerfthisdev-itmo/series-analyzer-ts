import { useState } from "react";

interface Props {
  onSubmit: (a: Array<number>, b: Array<number>) => void;
}

export const DataInput = ({ onSubmit }: Props) => {
  const [rawA, setRawA] = useState("");
  const [rawB, setRawB] = useState("");

  const parseInput = (text: string): Array<number> => {
    return text
      .split(/[\s,]+/)
      .map((n) => parseFloat(n))
      .filter((n) => !isNaN(n));
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void,
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
    <div className='space-y-4'>
      <div>
        <label className='block font-bold'>Данные A:</label>
        <textarea
          value={rawA}
          onChange={(e) => setRawA(e.target.value)}
          className='w-full border p-2 rounded'
          rows={3}
          placeholder='Пример: 1, 2, 3'
        />
        <input
          type='file'
          accept='.txt,.json'
          onChange={(e) => handleFileUpload(e, setRawA)}
          className='mt-1'
        />
      </div>

      <div>
        <label className='block font-bold'>Данные B:</label>
        <textarea
          value={rawB}
          onChange={(e) => setRawB(e.target.value)}
          className='w-full border p-2 rounded'
          rows={3}
          placeholder='Пример: 3, 2, 1'
        />
        <input
          type='file'
          accept='.txt,.json'
          onChange={(e) => handleFileUpload(e, setRawB)}
          className='mt-1'
        />
      </div>

      <button
        onClick={() => onSubmit(parseInput(rawA), parseInput(rawB))}
        className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
      >
        Построить
      </button>
    </div>
  );
};
