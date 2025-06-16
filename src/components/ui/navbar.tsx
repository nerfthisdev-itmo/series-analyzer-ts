"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <nav className='bg-background border-b'>
      <div className='flex justify-between items-center px-4 h-16'>
        <div className='flex space-x-4'>
          <Link
            to='/'
            className={`px-3 py-2 rounded-md ${
              pathname === "/"
                ? "bg-gray-100 dark:bg-gray-800"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            main page
          </Link>
          <Link
            to='/stats'
            className={`px-3 py-2 rounded-md ${
              pathname === "/stats"
                ? "bg-gray-100 dark:bg-gray-800"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            stats
          </Link>
          <Link
            to='/linear-regression'
            className={`px-3 py-2 rounded-md ${
              pathname === "/linear-regression"
                ? "bg-gray-100 dark:bg-gray-800"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            linear regression
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
