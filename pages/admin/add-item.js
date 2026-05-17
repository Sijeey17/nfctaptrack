import { useState } from "react";
import supabase from "../../lib/supabase";
import { useRouter } from "next/router";

export default function AddItem(){

  const router = useRouter();

  const [itemCode,setItemCode]=useState("");
  const [itemName,setItemName]=useState("");
  const [status,setStatus]=useState("");
  const [ownerId,setOwnerId]=useState("");

  const [message,setMessage]=useState("");

  // =====================
  // ADD ITEM FUNCTION
  // =====================
  async function addItem(){

    // ⭐ CHECK IF OWNER EXISTS FIRST
    const { data: owner, error: ownerError } = await supabase
      .from("Owners_Table")
      .select("student_id")
      .eq("student_id", Number(ownerId.trim()))
      .single();

    if (!owner) {
      alert("Owner student ID not found");
      return;
    }

    // ⭐ INSERT ITEM
    const { error } = await supabase
      .from("Items_Table")
      .insert([
        {
          item_code:itemCode,
          item_name:itemName,
          status:status,
          owner_id:ownerId
        }
      ]);

    if(error){
      console.error(error);
      setMessage("❌ Failed to add item");
      return;
    }

    setMessage("✅ Item Added Successfully!");

    setTimeout(()=>{
      router.push("/admin/dashboard");
    },1500);
  }

  return(
    <div>

      <h2>Add Item</h2>

      <input
        placeholder="Item Code"
        onChange={e=>setItemCode(e.target.value)}
      />

      <input
        placeholder="Item Name"
        onChange={e=>setItemName(e.target.value)}
      />

      <input
        placeholder="Status"
        onChange={e=>setStatus(e.target.value)}
      />

      {/* ⭐ OWNER STUDENT ID TEXTBOX */}
      <input
        placeholder="Owner Student ID"
        onChange={e=>setOwnerId(e.target.value)}
      />

      <button onClick={addItem}>
        Save Item
      </button>

      <p>{message}</p>

    </div>
  );
}