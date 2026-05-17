import { useEffect,useState } from "react";
import supabase from "../../../lib/supabase";
import { useRouter } from "next/router";

export default function EditItem(){

  const router = useRouter();
  const { id } = router.query;

  const [itemCode,setItemCode]=useState("");
  const [itemName,setItemName]=useState("");
  const [status,setStatus]=useState("");

  useEffect(()=>{
    if(id) fetchItem();
  },[id]);

  async function fetchItem(){

    const { data } = await supabase
      .from("Items_Table")
      .select("*")
      .eq("id",id)
      .single();

    if(data){
      setItemCode(data.item_code);
      setItemName(data.item_name);
      setStatus(data.status);
    }
  }

  async function updateItem(){

    await supabase
      .from("Items_Table")
      .update({
        item_code:itemCode,
        item_name:itemName,
        status:status
      })
      .eq("id",id);

    router.push("/admin/dashboard");
  }

  return(
    <div>
      <h2>Edit Item</h2>

      <input
        value={itemCode}
        onChange={e=>setItemCode(e.target.value)}
      />

      <input
        value={itemName}
        onChange={e=>setItemName(e.target.value)}
      />

      <input
        value={status}
        onChange={e=>setStatus(e.target.value)}
      />

      <button onClick={updateItem}>
        Update
      </button>
    </div>
  );
}