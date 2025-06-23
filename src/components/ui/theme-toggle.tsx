"use client";

import { useLayoutEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    // Проверяем сохраненную тему или системные настройки
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Определяем актуальную тему
    const theme = savedTheme
      ? savedTheme === "dark"
      : systemPrefersDark;

    // Применяем тему
    document.documentElement.classList.toggle("dark", theme);
    setIsDark(theme);
  }, []);

  const toggleTheme = () => {
    if (isDark === null) return;

    const newTheme = !isDark;
    // Сохраняем и применяем новую тему
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
    setIsDark(newTheme);
  };

  // Рендерим кнопку только после инициализации темы
  if (isDark === null) {
    return (
      <button
        className="hover:bg-gray-100 dark:hover:bg-gray-800 opacity-0 p-2 rounded-lg cursor-default"
        aria-hidden="true"
      >
        -
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
