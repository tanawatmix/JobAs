"use client";
import { useState, useEffect } from "react";
import { getPatients, clearPatients } from "@/utils/mockDatabase";
import { Patient } from "@/types";

export default function StaffPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const refreshData = () => {
    const data = getPatients();
    setPatients(data);

    if (selectedPatient) {
      const updated = data.find((p) => p.id === selectedPatient.id);
      if (
        updated &&
        JSON.stringify(updated) !== JSON.stringify(selectedPatient)
      ) {
        setSelectedPatient(updated);
      }
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 1000);
    window.addEventListener("storage", refreshData);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", refreshData);
    };
  }, [selectedPatient]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "filling":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 animate-pulse">
            ● กำลังกรอก
          </span>
        );
      case "submitted":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">
            ✓ ส่งแล้ว
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-500">
            Inactive
          </span>
        );
    }
  };

  return (
    <div className="font-sans bg-slate-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Dashboard ติดตามผู้ป่วย
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              คลิกที่บัตรเพื่อดูข้อมูลฉบับเต็ม
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm("ยืนยันล้างข้อมูลทั้งหมด?")) {
                clearPatients();
                refreshData();
              }
            }}
            className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition-colors whitespace-nowrap"
          >
            🗑️ ล้างรายการ
          </button>
        </div>

        {patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
            <div className="text-3xl sm:text-4xl mb-2">📭</div>
            <p className="text-sm sm:text-base">ยังไม่มีข้อมูลผู้ป่วย</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {patients.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`bg-white rounded-xl p-4 sm:p-5 shadow-sm transition-all duration-300 border cursor-pointer hover:shadow-lg hover:scale-[1.02] ${
                  p.status === "filling"
                    ? "border-green-400 ring-2 ring-green-50"
                    : "border-slate-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1">
                      {p.first_name} {p.last_name}
                    </h3>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      ID: {p.id}
                    </div>
                  </div>
                  <div className="shrink-0">{getStatusBadge(p.status)}</div>
                </div>

                <div className="space-y-1 text-xs sm:text-sm text-slate-600 mb-4">
                  <p>📞 {p.phone || "-"}</p>
                  <p>🎂 {p.dob || "-"}</p>
                </div>

                {(p.chronic_disease || p.allergies) && (
                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded font-bold border border-red-100 flex items-center gap-2">
                    <span>⚠️</span> <span>มีประวัติทางการแพทย์</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-right font-medium">
                  คลิกดูรายละเอียด ➜
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedPatient && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative flex flex-col">
              <div className="bg-slate-800 text-white p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start gap-3 sticky top-0 z-10">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {selectedPatient.first_name} {selectedPatient.last_name}
                  </h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 opacity-90 text-xs sm:text-sm font-light">
                    <span className="bg-white/20 px-2 py-0.5 rounded font-mono">
                      ID: {selectedPatient.id}
                    </span>
                    <span className="hidden sm:block">|</span>
                    <span className="flex items-center gap-1">
                      สถานะ: {getStatusBadge(selectedPatient.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto">
                {(selectedPatient.chronic_disease ||
                  selectedPatient.allergies) && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 sm:p-5 rounded-r-lg shadow-sm">
                    <h3 className="text-red-800 font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
                      ⚠️ ข้อมูลทางการแพทย์
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {selectedPatient.chronic_disease && (
                        <div>
                          <p className="text-xs text-red-600 font-bold uppercase tracking-wide mb-1">
                            โรคประจำตัว
                          </p>
                          <p className="text-slate-800 font-medium text-base sm:text-lg">
                            {selectedPatient.chronic_disease}
                          </p>
                        </div>
                      )}
                      {selectedPatient.allergies && (
                        <div>
                          <p className="text-xs text-red-600 font-bold uppercase tracking-wide mb-1">
                            ประวัติการแพ้
                          </p>
                          <div className="bg-red-100/80 text-red-800 font-bold text-base sm:text-lg px-3 py-1 rounded inline-block">
                            {selectedPatient.allergies}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2">
                    ข้อมูลส่วนตัว
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 sm:gap-y-6 gap-x-3 sm:gap-x-4">
                    <div>
                      <p className="label-modal">วันเกิด</p>
                      <p className="val-modal">{selectedPatient.dob}</p>
                    </div>
                    <div>
                      <p className="label-modal">เพศ</p>
                      <p className="val-modal">{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <p className="label-modal">สัญชาติ</p>
                      <p className="val-modal">
                        {selectedPatient.nationality || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="label-modal">ศาสนา</p>
                      <p className="val-modal">
                        {selectedPatient.religion || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="label-modal">ภาษาที่ถนัด</p>
                      <p className="val-modal">
                        {selectedPatient.pref_language || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2">
                    ข้อมูลการติดต่อ
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <p className="label-modal">เบอร์โทรศัพท์</p>
                      <p className="val-modal text-blue-600">
                        {selectedPatient.phone}
                      </p>
                    </div>
                    <div>
                      <p className="label-modal">อีเมล</p>
                      <p className="val-modal">{selectedPatient.email}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="label-modal">ที่อยู่ปัจจุบัน</p>
                      <p className="val-modal bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {selectedPatient.address}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedPatient.emergency_contact_name && (
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
                    <h3 className="text-slate-700 font-bold mb-3 flex items-center gap-2 text-sm sm:text-base">
                      📞 ผู้ติดต่อฉุกเฉิน
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
                      <div>
                        <p className="label-modal">ชื่อ-นามสกุล</p>
                        <p className="val-modal">
                          {selectedPatient.emergency_contact_name}
                        </p>
                      </div>
                      <div>
                        <p className="label-modal">ความสัมพันธ์</p>
                        <p className="val-modal">
                          {selectedPatient.emergency_contact_rel || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-3 sm:p-4 border-t border-slate-200 text-right sticky bottom-0 z-10">
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-100 hover:shadow-md transition-all text-sm sm:text-base"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
            <style jsx>{`
              .label-modal {
                @apply text-xs text-slate-400 mb-1;
              }
              .val-modal {
                @apply text-slate-800 font-medium text-base;
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
