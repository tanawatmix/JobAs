"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Patient } from "@/types";

export default function StaffPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInitialData = async () => {
    const { data } = await supabase
      .from("patients")
      .select("*")
      .order("updated_at", { ascending: false });
    if (data) setPatients(data as Patient[]);
  };

  useEffect(() => {
    fetchInitialData();
    const channel = supabase
      .channel("realtime_patients")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "patients" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPatients((prev) => [payload.new as Patient, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Patient;
            setPatients((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
            setSelectedPatient((curr) =>
              curr?.id === updated.id ? updated : curr
            );
          } else if (payload.eventType === "DELETE") {
            setPatients((prev) => prev.filter((p) => p.id !== payload.old.id));
            setSelectedPatient((curr) =>
              curr?.id === payload.old.id ? null : curr
            );
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || p.phone.includes(query);
  });

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

  const handleClear = async () => {
    if (confirm("ยืนยันล้างข้อมูลทั้งหมด?")) {
      await supabase.from("patients").delete().neq("id", "0");
      setPatients([]);
    }
  };

  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard ติดตามผู้ป่วย
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time Monitoring System
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="ค้นหาชื่อ หรือ เบอร์โทร..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>

          <button
            onClick={handleClear}
            className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded transition-colors whitespace-nowrap"
          >
            🗑️ ล้างรายการ
          </button>
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
          <div className="text-4xl mb-2">📭</div>
          <p>{searchQuery ? "ไม่พบข้อมูลที่ค้นหา" : "ยังไม่มีข้อมูลผู้ป่วย"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPatients.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPatient(p)}
              className={`bg-white rounded-xl p-5 shadow-sm transition-all duration-300 border cursor-pointer hover:shadow-lg hover:scale-[1.02] ${
                p.status === "filling"
                  ? "border-green-400 ring-2 ring-green-50"
                  : "border-slate-200"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                    {p.first_name} {p.last_name}
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    ID: {p.id}
                  </div>
                </div>
                {getStatusBadge(p.status)}
              </div>
              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <p>📞 {p.phone || "-"}</p>
                <p>🎂 {p.dob || "-"}</p>
              </div>
              {(p.chronic_disease || p.allergies) && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded font-bold border border-red-100 flex items-center gap-2">
                  <span>⚠️</span> มีประวัติทางการแพทย์
                </div>
              )}
              <div className="pt-3 border-t border-slate-100 text-[10px] text-right font-medium text-blue-500">
                คลิกดูรายละเอียด ➜
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPatient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col">
            <div className="bg-slate-800 text-white p-6 flex justify-between items-start sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedPatient.first_name} {selectedPatient.last_name}
                </h2>
                <div className="flex items-center gap-2 mt-2 opacity-90 text-sm font-light">
                  <span className="bg-white/20 px-2 py-0.5 rounded font-mono">
                    ID: {selectedPatient.id}
                  </span>
                  <span className="flex items-center gap-1">
                    | สถานะ: {getStatusBadge(selectedPatient.status)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-8 space-y-8 overflow-y-auto">
              {(selectedPatient.chronic_disease ||
                selectedPatient.allergies) && (
                <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg shadow-sm">
                  <h3 className="text-red-800 font-bold text-lg mb-4 flex items-center gap-2">
                    ⚠️ ข้อมูลทางการแพทย์ที่สำคัญ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedPatient.chronic_disease && (
                      <div>
                        <p className="text-xs text-red-600 font-bold uppercase tracking-wide mb-1">
                          โรคประจำตัว
                        </p>
                        <p className="text-slate-800 font-medium text-lg leading-relaxed">
                          {selectedPatient.chronic_disease}
                        </p>
                      </div>
                    )}
                    {selectedPatient.allergies && (
                      <div>
                        <p className="text-xs text-red-600 font-bold uppercase tracking-wide mb-1">
                          ประวัติการแพ้
                        </p>
                        <p className="text-slate-800 font-medium text-lg leading-relaxed">
                          {selectedPatient.allergies}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2">
                  ข้อมูลส่วนตัว
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
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
                    
                    <p className="val-modal">{selectedPatient.religion}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="md:col-span-2">
                    <p className="label-modal">ที่อยู่ปัจจุบัน</p>
                    <p className="val-modal bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {selectedPatient.address}
                    </p>
                  </div>
                </div>
              </div>
              {selectedPatient.emergency_contact_name && (
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h3 className="text-slate-700 font-bold mb-3 flex items-center gap-2">
                    📞 ผู้ติดต่อฉุกเฉิน
                  </h3>
                  <div className="flex flex-col md:flex-row gap-4 md:gap-10">
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
            <div className="bg-slate-50 p-4 border-t border-slate-200 text-right sticky bottom-0 z-10">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-6 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-100 hover:shadow-md transition-all"
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
  );
}
