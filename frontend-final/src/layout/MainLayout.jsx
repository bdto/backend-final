import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { cn } from '../utils/helpers'

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          collapsed ? 'ml-[72px]' : 'ml-[260px]'
        )}
      >
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
