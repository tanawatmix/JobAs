"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface SidebarProps {
  onLoginClick?: () => void;
}

export default function Sidebar({ onLoginClick }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const patientId = searchParams.get("id");

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden fixed top-4 left-4 z-80  "
        >
          ☰
        </button>
      )}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden animate-in fade-in"
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out font-sans
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 
      `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-50">
          <span className="text-blue-600 font-bold text-xl">
            Agnos Hospital
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-2 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 mb-3 px-2">
            เมนูหลัก
          </div>

          {user === "guest" ? (
            <button
              onClick={() => {
                onLoginClick?.();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium border border-dashed border-slate-300"
            >
              🔐 เข้าสู่ระบบ
            </button>
          ) : (
            <>
              {user === "patient" && (
                <>
                  <Link
                    href={
                      patientId
                        ? `/dashboard/patient?id=${patientId}`
                        : "/dashboard/patient"
                    }
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                      pathname === "/dashboard/patient"
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>📝</span> แบบฟอร์ม / แก้ไข
                  </Link>

                  {patientId && (
                    <Link
                      href={`/dashboard/patient/profile?id=${patientId}`}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                        pathname === "/dashboard/patient/profile"
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>👤</span> ข้อมูลส่วนตัว
                    </Link>
                  )}
                </>
              )}

              {user === "staff" && (
                <Link
                  href="/dashboard/staff"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive("/dashboard/staff")
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>🖥️</span> Dashboard
                </Link>
              )}
            </>
          )}
        </nav>

        {user !== "guest" && (
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
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
                className="text-xs text-red-500 hover:underline shrink-0"
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
