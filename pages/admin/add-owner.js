import { useState } from "react";
import supabase from "../../lib/supabase";
import { useRouter } from "next/router";

export default function AddOwner(){

  const router = useRouter();

  const [studentId,setStudentId] = useState("");
  const [name,setName] = useState("");
  const [contact,setContact] = useState("");
  const [message,setMessage] = useState("");

  async function addOwner(){

    setMessage("Saving...");

    const { error } = await supabase
      .from("Owners_Table")
      .insert([
        {
          student_id: studentId,
          name: name,
          contact: contact
        }
      ]);

    if(error){
      console.error(error);
      setMessage("❌ Failed to add owner");

      // common error helper
      if(error.code === "23505"){
        setMessage("⚠️ Student ID already exists");
      }

      return;
    }

    setMessage("✅ Owner added successfully!");

    setTimeout(()=>{
      router.push("/admin/dashboard");
    },1500);
  }

  return(
    <div style={{padding:"20px"}}>
      <h2>Add Owner</h2>

      <input
        placeholder="Student ID"
        value={studentId}
        onChange={e=>setStudentId(e.target.value)}
      /><br/><br/>

      <input
        placeholder="Name"
        value={name}
        onChange={e=>setName(e.target.value)}
      /><br/><br/>

      <input
        placeholder="Contact"
        value={contact}
        onChange={e=>setContact(e.target.value)}
      /><br/><br/>

      <button onClick={addOwner}>
        Save Owner
      </button>

      <p>{message}</p>
    </div>
  );
}