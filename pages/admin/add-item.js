import { useState } from "react";
import supabase from "../../lib/supabase";
import { useRouter } from "next/router";

export default function AddItem(){

  const router = useRouter();

  const [itemCode,setItemCode] = useState("");
  const [itemName,setItemName] = useState("");
  const [status,setStatus] = useState("");
  const [ownerId,setOwnerId] = useState("");

  const [message,setMessage] = useState("");

  async function addItem(){

    // =========================
    // CHECK IF OWNER EXISTS
    // =========================
    const { data: owner, error: ownerError } = await supabase
      .from("Owners_Table")
      .select("*")
      .eq("student_id", ownerId.trim());

      console.log("OWNER RESULT:", owner);
      console.log("OWNER ERROR:", ownerError);

    // OWNER NOT FOUND
    if(ownerError || owner.length === 0){

      console.log(ownerError);

      setMessage("Owner student ID not found");
      return;
    }

    // =========================
    // INSERT ITEM
    // =========================
    const { error } = await supabase
      .from("Items_Table")
      .insert([
        {
          item_code: itemCode,
          item_name: itemName,
          status: status,
          owner_id: ownerId.trim()
        }
      ]);

    // INSERT ERROR
    if(error){

      console.log(error);

      setMessage("Failed to add item");
      return;
    }

    // SUCCESS
    setMessage("Item added successfully!");

    // REDIRECT
    setTimeout(()=>{
      router.push("/admin/dashboard");
    },1500);
  }

  return(
    <div style={{padding:"20px"}}>

      <h1>Add Item</h1>

      <input
        type="text"
        placeholder="Item Code"
        value={itemCode}
        onChange={(e)=>setItemCode(e.target.value)}
      />

      <br/><br/>

      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e)=>setItemName(e.target.value)}
      />

      <br/><br/>

      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e)=>setStatus(e.target.value)}
      />

      <br/><br/>

      <input
        type="text"
        placeholder="Owner Student ID"
        value={ownerId}
        onChange={(e)=>setOwnerId(e.target.value)}
      />

      <br/><br/>

      <button onClick={addItem}>
        Save Item
      </button>

      <p>{message}</p>

    </div>
  );
}