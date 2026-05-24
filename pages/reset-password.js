import { useState } from "react";
import supabase from "../lib/supabase";
import { useRouter } from "next/router";

export default function ResetPassword(){

  const [password,setPassword] = useState("");
  const router = useRouter();

  async function updatePassword(){

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if(error){
      alert(error.message);
      return;
    }

    if(password.length < 6){
        alert("Password must be at least 6 characters");
        return;
    }

    alert("Password updated successfully");

    router.push("/login");
  }

  return(
    <div
      style={{
        minHeight:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:"linear-gradient(to right, #f7d6d0, #d9f0a3)"
      }}
    >

      <div
        style={{
          background:"#fff",
          padding:"40px",
          borderRadius:"10px",
          width:"350px",
          boxShadow:"0 4px 10px rgba(0,0,0,0.2)"
        }}
      >

        <h2 style={{ textAlign:"center" }}>
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          style={{
            width:"100%",
            padding:"12px",
            marginTop:"20px",
            borderRadius:"5px",
            border:"1px solid gray"
          }}
        />

        <button
          onClick={updatePassword}
          style={{
            width:"100%",
            marginTop:"20px",
            padding:"12px",
            border:"none",
            borderRadius:"5px",
            background:"#222",
            color:"white",
            cursor:"pointer"
          }}
        >
          Update Password
        </button>

      </div>

    </div>
  );
}