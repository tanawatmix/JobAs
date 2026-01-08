'use client'
import Sidebar from '@/components/sidebar'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === 'guest') router.push('/')
  }, [user, router])

  if (user === 'guest') return null

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 w-full md:ml-64 p-4 md:p-8 overflow-y-auto h-screen pt-16 md:pt-8">
        {children}
      </main>
    </div>
  )
}