import { useState } from "react"
import supabase from "../../lib/supabase"
import { useRouter } from "next/router"

export default function Login(){

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const router=useRouter()

  async function login(){
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if(!error){
      router.push("/admin/dashboard")
    }
  }

  return(
    <div>
      <h2>Admin Login</h2>

      <input
        placeholder="Email"
        onChange={e=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e=>setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
    </div>
  )
}