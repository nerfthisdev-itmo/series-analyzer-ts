import { useEffect, useState } from "react";

interface Props {
  onSubmit: (a: Array<number>, b: Array<number>) => void;
}

export const DataInput = ({ onSubmit }: Props) => {
  const [rawA, setRawA] = useState("");
  const [rawB, setRawB] = useState("");

  useEffect(() => {
    const savedA = localStorage.getItem("inputA");
    const savedB = localStorage.getItem("inputB");
    if (savedA) setRawA(savedA);
    if (savedB) setRawB(savedB);
  }, []);

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
        <label className='block font-bold'>Данные для частотного анализа:</label>
        <textarea
          value={rawA}
          onChange={(e) => setRawA(e.target.value)}
          className='p-2 border rounded w-full'
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
        <label className='block font-bold'>Данные для интервального анализа:</label>
        <textarea
          value={rawB}
          onChange={(e) => setRawB(e.target.value)}
          className='p-2 border rounded w-full'
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
        onClick={() => {
          const parsedA = parseInput(rawA);
          const parsedB = parseInput(rawB);
          onSubmit(parsedA, parsedB);
          localStorage.setItem("inputA", rawA);
          localStorage.setItem("inputB", rawB);
        }}
        className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white'
      >
        Построить
      </button>
      <button
        className='bg-blue-600 hover:bg-blue-700 ml-2 px-4 py-2 rounded text-white'
        onClick={() => {
          localStorage.clear();
          setRawA("");
          setRawB("");
          location.reload();
        }}
      >
        Сбросить данные
      </button>
    </div>
  );
};
