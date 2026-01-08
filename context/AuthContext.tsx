'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

type UserRole = 'guest' | 'patient' | 'staff'

interface AuthContextType {
  user: UserRole
  login: (role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserRole>('guest')
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('mock_user_role') as UserRole
    if (storedUser) setUser(storedUser)
  }, [])

  const login = (role: UserRole) => {
    setUser(role)
    localStorage.setItem('mock_user_role', role)
    
    if (role === 'patient') router.push('/dashboard/patient')
    if (role === 'staff') router.push('/dashboard/staff')
  }

  const logout = () => {
    setUser('guest')
    localStorage.removeItem('mock_user_role')
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)