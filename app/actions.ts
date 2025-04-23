'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const supabase = createServerActionClient({ cookies })
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    return { error: error.message }
  }
  
  // Lấy thông tin profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()
    
  // Chuyển hướng dựa trên role
  if (profile?.role === 'employee') {
    redirect('/employee')
  } else if (profile?.role === 'employer') {
    redirect('/employer')
  } else if (profile?.role === 'admin') {
    redirect('/admin')
  } else {
    redirect('/choose-role')
  }
}

export async function signOut() {
  const supabase = createServerActionClient({ cookies })
  await supabase.auth.signOut()
  redirect('/login')
}
