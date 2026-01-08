"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  onLoginClick?: () => void;
}

export default function Sidebar({ onLoginClick }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname.includes(path);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors ${
          isOpen ? "hidden" : ""
        }`}
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-black/50 z-30 md:hidden animate-in fade-in"
          role="presentation"
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 z-40 h-screen w-64 sm:w-56 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative
      `}
      >
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-50 shrink-0">
          <span className="text-blue-600 font-bold  truncate">
            Agnos Hospital
          </span>
          <button
            onClick={closeMenu}
            className="md:hidden text-slate-400 hover:text-slate-600 transition-colors shrink-0 ml-2"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 p-3 sm:p-4 space-y-1 mt-2 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 mb-3 px-2">
            เมนูหลัก
          </div>

          {user === "guest" ? (
            <button
              onClick={() => {
                onLoginClick?.();
                closeMenu();
              }}
              className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium border border-dashed border-slate-300 transition-colors"
            >
              🔐 เข้าสู่ระบบ
            </button>
          ) : (
            <>
              {user === "patient" && (
                <Link
                  href="/dashboard/patient"
                  onClick={closeMenu}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/patient")
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  📝 ลงทะเบียน
                </Link>
              )}
              {user === "staff" && (
                <Link
                  href="/dashboard/staff"
                  onClick={closeMenu}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/staff")
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  🖥️ Dashboard
                </Link>
              )}
            </>
          )}
        </nav>

        {user !== "guest" && (
          <div className="p-3 sm:p-4 border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                {user === "patient" ? "P" : "S"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {user === "patient" ? "ผู้ป่วย" : "เจ้าหน้าที่"}
                </p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{" "}
                  Online
                </p>
              </div>
              <button
                onClick={logout}
                className="text-xs text-red-500 hover:underline shrink-0 transition-colors"
                aria-label="Logout"
              >
                ออก
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
