"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function MainPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginStep, setLoginStep] = useState<
    "select_role" | "staff_auth" | "patient_auth"
  >("select_role");

  const [staffId, setStaffId] = useState("");
  const [staffPass, setStaffPass] = useState("");

  const [phoneInput, setPhoneInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user === "staff") router.push("/dashboard/staff");
  }, [user, router]);

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffId.trim() !== "" && staffPass === "1234") {
      login("staff");
      router.push("/dashboard/staff");
    } else {
      setErrorMsg("รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  const handlePatientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!phoneInput) return setErrorMsg("กรุณากรอกเบอร์โทรศัพท์");

    setIsLoading(true);

    const { data } = await supabase
      .from("patients")
      .select("id")
      .eq("id", phoneInput.trim())
      .single();

    setIsLoading(false);

    if (data) {
      login("patient");
      router.push(`/dashboard/patient?id=${phoneInput.trim()}`); 
    } else {
      setErrorMsg('ไม่พบประวัติของเบอร์นี้ กรุณากดปุ่ม "ลงทะเบียนใหม่"');
    }
  };

  const handlePatientRegister = async () => {
    setErrorMsg("");
    if (!phoneInput) return setErrorMsg("กรุณากรอกเบอร์โทรศัพท์เพื่อลงทะเบียน");

    setIsLoading(true);

    const { data } = await supabase
      .from("patients")
      .select("id")
      .eq("id", phoneInput.trim())
      .single();

    setIsLoading(false);

    if (data) {
      setErrorMsg('เบอร์นี้ลงทะเบียนไปแล้ว กรุณากดปุ่ม "เข้าสู่ระบบ"');
    } else {
      login("patient", phoneInput.trim());
      router.push(`/dashboard/patient?id=${phoneInput.trim()}`);
    }
  };

  const resetModal = () => {
    setShowLoginModal(false);
    setLoginStep("select_role");
    setStaffId("");
    setStaffPass("");
    setPhoneInput("");
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      <Sidebar onLoginClick={() => setShowLoginModal(true)} />

      <main className="flex-1 flex flex-col items-center justify-center min-h-screen text-center p-6 md:ml-64 transition-all duration-300">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
          <svg
            className="w-10 h-10 md:w-12 md:h-12 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-4">
          ยินดีต้อนรับสู่{" "}
          <span className="text-blue-600 block md:inline">Agnos Hospital</span>
        </h1>
        <p className="text-base md:text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
          ระบบจัดการข้อมูลผู้ป่วยและติดตามสถานะแบบ Real-time{" "}
          <br className="hidden md:block" />
          <span className="text-sm bg-slate-100 px-3 py-1 rounded-full mt-4 inline-block shadow-sm">
            กดปุ่ม <b>เมนู</b> หรือ <b>เข้าสู่ระบบ</b> ด้านซ้ายเพื่อเริ่ม
          </span>
        </p>
      </main>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">เข้าสู่ระบบ</h2>
                <p className="text-blue-100 text-sm">
                  {loginStep === "select_role"
                    ? "เลือกบทบาทของคุณ"
                    : loginStep === "patient_auth"
                    ? "ยืนยันเบอร์โทรศัพท์"
                    : "ยืนยันตัวตนเจ้าหน้าที่"}
                </p>
              </div>
              <button
                onClick={resetModal}
                className="text-white/70 hover:text-white bg-white/10 rounded-full p-1 w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {loginStep === "select_role" && (
                <div className="space-y-4">
                  <button
                    onClick={() => setLoginStep("patient_auth")}
                    className="w-full flex items-center p-4 border rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group shadow-sm"
                  >
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      👤
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="text-lg font-bold">ผู้ป่วย (Patient)</h3>
                      <p className="text-xs text-slate-500">
                        ลงทะเบียน หรือ แก้ไขข้อมูลเดิม
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => setLoginStep("staff_auth")}
                    className="w-full flex items-center p-4 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group shadow-sm"
                  >
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      🔒
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="text-lg font-bold">เจ้าหน้าที่ (Staff)</h3>
                      <p className="text-xs text-slate-500">
                        สำหรับบุคลากรภายใน
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {loginStep === "patient_auth" && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700">
                      เบอร์โทรศัพท์มือถือ
                    </label>
                    <input
                      type="tel"
                      className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-lg tracking-wide"
                      placeholder="08x-xxx-xxxx"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      autoFocus
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-red-500 text-sm bg-red-50 p-2 rounded text-center animate-pulse">
                      {errorMsg}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handlePatientLogin}
                      disabled={isLoading}
                      className="w-full py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-bold shadow-sm disabled:opacity-50"
                    >
                      {isLoading ? "..." : "เข้าสู่ระบบ"}
                    </button>

                    <button
                      onClick={handlePatientRegister}
                      disabled={isLoading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md disabled:opacity-50"
                    >
                      {isLoading ? "..." : "ลงทะเบียนใหม่"}
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-2">
                      ใช้เบอร์โทรศัพท์เป็นรหัสประจำตัวผู้ป่วย (ID)
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginStep("select_role");
                        setErrorMsg("");
                      }}
                      className="text-slate-400 hover:text-slate-600 text-sm font-bold underline"
                    >
                      ย้อนกลับ
                    </button>
                  </div>
                </div>
              )}

              {loginStep === "staff_auth" && (
                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      รหัสพนักงาน
                    </label>
                    <input
                      type="text"
                      className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="เช่น STAFF001"
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      รหัสผ่าน
                    </label>
                    <input
                      type="password"
                      className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="รหัสผ่าน (1234)"
                      value={staffPass}
                      onChange={(e) => setStaffPass(e.target.value)}
                    />
                  </div>
                  {errorMsg && (
                    <p className="text-red-500 text-sm bg-red-50 p-2 rounded text-center">
                      {errorMsg}
                    </p>
                  )}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginStep("select_role");
                        setErrorMsg("");
                      }}
                      className="flex-1 py-3 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                    >
                      ย้อนกลับ
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md"
                    >
                      เข้าสู่ระบบ
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
