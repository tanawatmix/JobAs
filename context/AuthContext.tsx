"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
type UserRole = "guest" | "patient" | "staff";

interface AuthContextType {
  user: UserRole;
  patientId: string | null;
  login: (role: UserRole, id?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserRole>("guest");
  const [patientId, setPatientId] = useState<string | null>(null);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const storedSession = localStorage.getItem("agnos_session");

      if (storedSession) {
        const { role, id } = JSON.parse(storedSession);

        if (role === "patient" && id) {
          const { data } = await supabase
            .from("patients")
            .select("id")
            .eq("id", id)
            .single();

          if (data) {
            setUser("patient");
            setPatientId(id);
          } else {
            logout();
          }
        } else if (role === "staff") {
          setUser("staff");
        }
      }
      setIsChecking(false);
    };

    checkSession();
  }, []);

  const login = (role: UserRole, id?: string) => {
    setUser(role);
    if (id) setPatientId(id);
    localStorage.setItem(
      "agnos_session",
      JSON.stringify({ role, id: id || null })
    );
  };

  const logout = () => {
    setUser("guest");
    setPatientId(null);
    localStorage.removeItem("agnos_session");
    router.push("/");
  };

  if (isChecking) return null;

  return (
    <AuthContext.Provider value={{ user, patientId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
