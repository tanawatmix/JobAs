"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { Patient } from "@/types";
import Link from "next/link";

export default function PatientProfile() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("id");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) return;
      const { data } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single();
      if (data) setPatient(data as Patient);
      setLoading(false);
    };
    fetchData();
  }, [patientId]);

  if (loading)
    return (
      <div className="p-6 sm:p-10 text-center text-slate-500">
        กำลังโหลดข้อมูล...
      </div>
    );
  if (!patient)
    return (
      <div className="p-6 sm:p-10 text-center text-red-500">
        ไม่พบข้อมูลผู้ป่วย
      </div>
    );

  const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex flex-col sm:flex-row border-b border-slate-100 py-3 last:border-0 gap-2 sm:gap-0">
      <span className="text-xs sm:text-sm text-slate-500 sm:w-1/3 font-medium sm:font-normal">
        {label}
      </span>
      <span className="text-sm sm:text-base text-slate-800 font-medium sm:w-2/3">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-slate-50 p-3 sm:p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl font-bold">ข้อมูลส่วนตัว</h1>
            <p className="text-slate-300 text-xs sm:text-sm opacity-80 mt-1">
              ID: {patient.id}
            </p>
          </div>

          <Link
            href={`/dashboard/patient?id=${patient.id}&action=edit`}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            ✏️ แก้ไขข้อมูล
          </Link>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">
              ข้อมูลทั่วไป
            </h3>
            <InfoRow
              label="ชื่อ-นามสกุล"
              value={`${patient.first_name} ${
                patient.middle_name ? patient.middle_name + " " : ""
              }${patient.last_name}`}
            />
            <InfoRow label="วันเกิด" value={patient.dob} />
            <InfoRow label="เพศ" value={patient.gender} />
            <InfoRow label="กรุ๊ปเลือด" value={patient.bloodtype} />
            <InfoRow label="สัญชาติ" value={patient.nationality} />
            <InfoRow label="ศาสนา" value={patient.religion} />
            <InfoRow label="ภาษาที่ถนัด" value={patient.pref_language} />
          </div>

          <div className="bg-red-200 p-3 sm:p-4 rounded-lg border border-red-300">
            <h3 className="text-xs sm:text-sm font-bold text-red-500 uppercase tracking-wider mb-4 pb-2 flex items-center gap-2">
              🏥 ข้อมูลทางการแพทย์
            </h3>
            <InfoRow label="โรคประจำตัว" value={patient.chronic_disease} />
            <InfoRow label="ประวัติการแพ้" value={patient.allergies} />
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">
              ข้อมูลการติดต่อ
            </h3>
            <InfoRow label="เบอร์โทรศัพท์" value={patient.phone} />
            <InfoRow label="อีเมล" value={patient.email} />
            <InfoRow label="ที่อยู่" value={patient.address} />
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">
              ผู้ติดต่อฉุกเฉิน
            </h3>
            <InfoRow label="ชื่อ" value={patient.emergency_contact_name} />
            <InfoRow
              label="ความสัมพันธ์"
              value={patient.emergency_contact_rel}
              
            />
            <InfoRow label="เบอร์โทรศัพท์" value={patient.emergency_contact_phone} />
          </div>
        </div>
      </div>
    </div>
  );
}
