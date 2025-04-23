import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// GET: Kiểm tra session hiện tại
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data } = await supabase.auth.getSession()
  return NextResponse.json({ session: data.session })
}

// POST: Đăng nhập
export async function POST(request: Request) {
  const { email, password } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email, 
    password
  })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ user: data.user })
}
