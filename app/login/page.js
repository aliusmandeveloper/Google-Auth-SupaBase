"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabaseClient"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  useEffect(() => {
    // agar already logged in ho to dashboard bhej dein
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) router.push("/dashboard")
    })
    // optional: listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) router.push("/dashboard")
    })
    return () => listener?.subscription?.unsubscribe?.()
  }, [router])

  async function handleLogin(e) {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      alert(error.message)
      return
    }
    router.push("/dashboard")
  }

  return (
    <div style={{ maxWidth: 480, margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}
