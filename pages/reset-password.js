import {useState} from "react";
import {useRouter} from "next/router";
import supabase from "../lib/supabase";

export default function ResetPassword(){
  const router=useRouter();
  const [password,setPassword]=useState("");
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  async function updatePassword(e){e.preventDefault();
    setError("");setMessage("");if(password.length<6){setError("Use at least 6 characters for your password.");
      return;
    }setBusy(true);
    const {error}=await supabase.auth.updateUser({password});
    setBusy(false);if(error){setError(error.message);
      return;
    }setMessage("Password updated. Taking you to sign in…");
    setTimeout(()=>router.push("/login"),1200);
  }
  
  return <main className="login-screen">
    <section className="form-card" style={{width:"min(430px,100%)",padding:30}}>
      <div className="brand" style={{padding:"0 0 24px"}}>
        <span className="brand-mark brand-icon">
          <img src="/taptrack-icon.svg" alt="" />
        </span>
        <span>
          <span className="brand-name">TapTrack</span>
          <span className="brand-caption" style={{display:"block"}}>Campus lost &amp; found</span>
        </span>
      </div>
      <div className="eyebrow">Account security</div>
      <h1 className="page-title" style={{fontSize:23}}>Choose a new password</h1>
      <p className="page-subtitle" style={{marginBottom:22}}>Enter a new password for your administrator account.</p>
      <form onSubmit={updatePassword}>
        <div className="field">
          <label htmlFor="new-password">New password</label>
          <input id="new-password" type="password" minLength={6} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters"/>
        </div>{error&&<div className="notice error">{error}</div>}
        {message&&<div className="notice">{message}</div>}
        <button className="button button-primary" style={{width:"100%",marginTop:18}} disabled={busy}>
          {busy?"Updating…":"Update password"}
        </button>
      </form>
    </section>
  </main>;
}
