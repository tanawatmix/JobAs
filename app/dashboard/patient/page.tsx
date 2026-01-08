"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { savePatient } from "@/utils/mockDatabase";
import { Patient, PatientStatus } from "@/types";

export default function PatientPage() {
  const [sessionId] = useState(
    () => `p-${Math.floor(Math.random() * 1000000000)}`
  );
  const [status, setStatus] = useState<PatientStatus>("inactive");

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Patient>();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "submitted") return;

    const subscription = watch((value) => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      const currentStatus = "filling";
      setStatus(currentStatus);

      savePatient({
        id: sessionId,
        ...value,
        status: currentStatus,
        updated_at: new Date().toISOString(),
      } as Patient);

      typingTimeoutRef.current = setTimeout(() => {
        setStatus("inactive");
        savePatient({
          id: sessionId,
          ...value,
          status: "inactive",
          updated_at: new Date().toISOString(),
        } as Patient);
      }, 3000);
    });
    return () => subscription.unsubscribe();
  }, [watch, sessionId, status]);

  const onSubmit = (data: Patient) => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    setStatus("submitted");

    savePatient({
      ...data,
      id: sessionId,
      status: "submitted",
      updated_at: new Date().toISOString(),
    });
  };

  const labelStyle =
    "block text-sm md:text-base font-medium text-slate-700 mb-1";
  const inputStyle =
    "w-full border border-slate-300 rounded px-3 py-2 text-sm md:text-base text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  if (status === "submitted") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12 text-center max-w-md w-full animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            ส่งข้อมูลเรียบร้อย!
          </h2>
          <p className="text-slate-500 mb-6">
            ขอบคุณสำหรับการลงทะเบียน
            <br />
            เจ้าหน้าที่ได้รับข้อมูลของท่านแล้ว
          </p>

          <div className="bg-slate-50 rounded-lg p-3 mb-6 text-xs text-slate-400 font-mono">
            Session ID: {sessionId}
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow transition-colors"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto font-sans">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-blue-600 p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-white">
            <div className="w-full sm:flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                แบบฟอร์มลงทะเบียน
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                Session ID: {sessionId}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-white/30 whitespace-nowrap">
              สถานะ: {status}
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div>
                  <label className={labelStyle}>
                    ชื่อจริง <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("first_name", { required: true })}
                    className={inputStyle}
                    placeholder="ชื่อจริง"
                  />
                  {errors.first_name && (
                    <span className="text-red-500 text-xs">
                      กรุณากรอกข้อมูล
                    </span>
                  )}
                </div>
                <div>
                  <label className={labelStyle}>
                    นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("last_name", { required: true })}
                    className={inputStyle}
                    placeholder="นามสกุล"
                  />
                </div>
              </div>

              <div>
                <label className={labelStyle}>ชื่อกลาง (ถ้ามี)</label>
                <input {...register("middle_name")} className={inputStyle} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div>
                  <label className={labelStyle}>
                    วัน/เดือน/ปีเกิด <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("dob", { required: true })}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>
                    เพศ <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("gender", { required: true })}
                    className={inputStyle}
                  >
                    <option value="">เลือกเพศ...</option>
                    <option value="Male">ชาย</option>
                    <option value="Female">หญิง</option>
                    <option value="Other">อื่นๆ</option>
                  </select>
                </div>
              </div>

              <div className="bg-red-50 p-3 sm:p-4 rounded border border-red-100 mb-6">
                <h3 className="text-xs sm:text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
                  🏥 ข้อมูลทางการแพทย์ (สำคัญ)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className={labelStyle}>โรคประจำตัว</label>
                    <input
                      {...register("chronic_disease")}
                      className={inputStyle}
                      placeholder="เช่น ความดัน, เบาหวาน"
                    />
                  </div>

                  <div>
                    <label className={labelStyle}>
                      ประวัติการแพ้ (ยา/อาหาร/สารเคมี)
                    </label>
                    <input
                      {...register("allergies")}
                      className={`${inputStyle} border-red-200 focus:border-red-500 focus:ring-red-200`}
                      placeholder="เช่น แพ้ยากลุ่ม Penicillin"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelStyle}>
                  เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("phone", { required: true })}
                  className={inputStyle}
                  placeholder="08x-xxx-xxxx"
                />
              </div>

              <div>
                <label className={labelStyle}>อีเมล</label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className={inputStyle}
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className={labelStyle}>ที่อยู่</label>
                <textarea
                  {...register("address", { required: true })}
                  className={inputStyle}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                <div>
                  <label className={labelStyle}>ภาษาที่ถนัด</label>
                  <input
                    {...register("pref_language")}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>สัญชาติ</label>
                  <input {...register("nationality")} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>ศาสนา</label>
                  <input {...register("religion")} className={inputStyle} />
                </div>
              </div>

              <div className="bg-slate-50 p-3 sm:p-4 rounded border border-slate-100">
                <h3 className="text-xs sm:text-sm font-bold text-slate-700 mb-3">
                  ผู้ติดต่อฉุกเฉิน (Optional)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    {...register("emergency_contact_name")}
                    className={inputStyle}
                    placeholder="ชื่อผู้ติดต่อ"
                  />
                  <input
                    {...register("emergency_contact_rel")}
                    className={inputStyle}
                    placeholder="ความสัมพันธ์"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 sm:py-3 text-sm sm:text-base rounded shadow transition-colors"
              >
                ยืนยันข้อมูล
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
