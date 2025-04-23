'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh() // Làm mới trang để chuyển hướng qua middleware
  }
  
  return (
    <button 
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
    >
      Đăng xuất
    </button>
  )
}
