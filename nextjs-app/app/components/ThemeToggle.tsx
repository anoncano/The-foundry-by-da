'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const preferred = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', preferred === 'dark');
    setTheme(preferred);
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return (
    <button onClick={toggle} className="border px-2 py-1 rounded text-sm">
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
