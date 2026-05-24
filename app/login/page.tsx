"use client";
import { useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdPerson } from "react-icons/md";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  async function login() {

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    console.log(data);
    console.log(error);

    if (!error) {
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 500);
      console.log(await supabase.auth.getSession());
    } else {
      alert(error.message);
    }
  }

  async function forgotPassword(){
    if(!email){
      alert("Enter your email first");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: "http://localhost:3000/reset-password"
      }
    );

    if(error){
      alert(error.message);
      return;
    }

    alert("Password reset email sent!");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right, #f7f3e8, #d9f0a3)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px"
      }}
    >

      {/* TOP */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "#333"
          }}
        >
          NFC TapTrack
        </h2>
      </div>

      {/* CENTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "40px",
          flex: 1
        }}
      >

        {/* LEFT PANEL */}
        <div
          style={{
            width: "600px",
            height: "350px",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "10px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "75%",
              border: "2px solid white",
              borderRadius: "10px",
              padding: "20px",
              color: "white",
              textAlign: "center",
              backgroundColor: "rgba(0,0,0,0.4)"
            }}
          >
            <h2>Welcome to NFC TapTrack</h2>

            <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
              Manage and track lost items easily using NFC technology.
              Securely identify owners and monitor item status in real-time.
            </p>

            <p style={{ marginTop: "15px", fontSize: "13px" }}>
              Fast. Secure. Smart.
            </p>
          </div>
        </div>

        {/* LOGIN CARD */}
        <div
          style={{
            width: "320px",
            backgroundColor: "#f8f8e8",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}
        >

          <h1
            style={{
              textAlign: "center",
              marginBottom: "40px",
              color: "#111"
            }}
          >
            Login
          </h1>

          {/* EMAIL */}
          <div style={{ marginBottom: "25px" }}>
            <p>Email</p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid gray",
                borderRadius: "5px",
                marginTop: "5px",
                backgroundColor: "white"
              }}>
                <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px"
                }}/>

                <button
                  type="button"
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: "10px",
                    fontSize: "14px",
                    pointerEvents: "none"
                  }}
                >
                  <MdPerson style={{color:"black" }} />
                </button>
            </div>
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: "30px" }}>

            <p>Password</p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid gray",
                borderRadius: "5px",
                marginTop: "5px",
                backgroundColor: "white"
              }}>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e)=>{
                  if(e.key === "Enter"){
                    login();
                  }
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px"
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: "10px",
                  fontSize: "14px"
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={login}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#222",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Sign In
          </button>
          <p
            onClick={forgotPassword}
            style={{
              marginTop:"15px",
              textAlign:"center",
              color:"#333",
              cursor:"pointer",
              textDecoration:"underline",
              fontSize:"14px"
            }}
          >
            Forgot Password?
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          fontSize: "14px",
          color: "#333"
        }}
      >

        <div>
          <h4>Help</h4>
          <p>Customer Support</p>
          <p>Terms & Conditions</p>
          <p>Privacy Policy</p>
        </div>

        <div style={{ textAlign: "center" }}>
          <p>© 2026 NFC TapTrack</p>
          <p>All Rights Reserved</p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>Tel: +63 09123456789</p>
          <p>Email: nfctaptrack@gmail.com</p>
        </div>

      </div>
    </div>
  );
}