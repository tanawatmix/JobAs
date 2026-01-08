"use client";
import { useEffect, useState } from "react";

export default function StaffView() {
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    const mockPatients = [
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        dob: "1990-01-15",
        gender: "Male",
        address: "123 Main St",
        emergency_contact_name: "Jane Doe",
        emergency_contact_rel: "Sister",
        status: "filling",
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        first_name: "Alice",
        last_name: "Smith",
        email: "alice@example.com",
        phone: "098-765-4321",
        dob: "1985-05-20",
        gender: "Female",
        address: "456 Oak Ave",
        emergency_contact_name: "Bob Smith",
        emergency_contact_rel: "Brother",
        status: "submitted",
        updated_at: new Date().toISOString(),
      },
    ];

    setPatients(mockPatients);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "filling":
        return "bg-green-100 text-green-800 border-green-300 ring-2 ring-green-400";
      case "submitted":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "inactive":
        return "bg-gray-100 text-gray-600 border-gray-300";
      default:
        return "bg-gray-50 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Staff Dashboard</h1>
        <div className="text-sm text-gray-500">Live Monitoring</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {patients.map((p: any) => (
          <div
            key={p.id}
            className={`bg-white rounded-lg shadow-sm p-5 border transition-all duration-300 ${getStatusColor(
              p.status
            )}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="font-bold text-lg truncate">
                  {p.first_name} {p.last_name}
                </h2>
                <p className="text-xs opacity-75">{p.email || "No email"}</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-white bg-opacity-50">
                {p.status}
              </span>
            </div>

            <hr className="border-black/10 my-2" />

            <div className="space-y-1 text-sm">
              <p>
                <strong>Phone:</strong> {p.phone || "-"}
              </p>
              <p>
                <strong>DOB:</strong> {p.dob || "-"}
              </p>
              <p>
                <strong>Gender:</strong> {p.gender || "-"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                <span className="block truncate">{p.address || "-"}</span>
              </p>

              {p.emergency_contact_name && (
                <div className="mt-2 text-xs bg-black/5 p-2 rounded">
                  <strong>Emergency:</strong> {p.emergency_contact_name} (
                  {p.emergency_contact_rel})
                </div>
              )}
            </div>

            <div className="mt-3 text-right text-[10px] opacity-50">
              Updated: {new Date(p.updated_at).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
