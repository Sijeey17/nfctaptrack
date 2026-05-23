import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import { useRouter } from "next/router";

export default function Dashboard(){

  const [items,setItems] = useState([]);
  const router = useRouter();

  useEffect(()=>{
    fetchItems();
  },[]);

  async function fetchItems(){

    const { data, error } = await supabase
      .from("Items_Table")
      .select("*");

    if(error){
      console.log(error);
      return;
    }

    setItems(data || []);
  }

  async function signOut(){

  const { error } = await supabase.auth.signOut();

    if(error){
      alert("Failed to sign out");
      return;
    }

    router.push("/login");
  }

  async function deleteItem(itemCode){

    const { error } = await supabase
      .from("Items_Table")
      .delete()
      .eq("item_code", itemCode);

    if(error){
      alert("Failed to delete");
      return;
    }

    alert("Item deleted");

    fetchItems();
  }

  return(
    <div style={{ padding:"20px" }}>

      <h1>Admin Dashboard</h1>

      <button
        onClick={()=>router.push("/admin/add-item")}
      >
        Add Item
      </button>

      <button
        onClick={()=>router.push("/admin/owners")}
        style={{ marginLeft:"10px" }}
      >
        Manage Owners
      </button>

      <button
        onClick={signOut}
        style={{
          marginLeft:"10px",
          backgroundColor:"red",
          color:"white"
        }}
      >
        Sign Out
      </button>

      <hr/>

      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        items.map((item)=>(
          <div
            key={item.item_code}
            style={{
              border:"1px solid gray",
              padding:"10px",
              marginBottom:"10px"
            }}
          >

            <h3>{item.item_name}</h3>

            <p>
              <b>Item Code:</b> {item.item_code}
            </p>

            <p>
              <b>Status:</b> {item.status}
            </p>

            <p>
              <b>Owner Student ID:</b> {item.owner_id}
            </p>

            <button
              onClick={()=>
                router.push(`/admin/edit/${item.item_code}`)
              }
            >
              Edit
            </button>

            <button
              onClick={()=>
                deleteItem(item.item_code)
              }
              style={{ marginLeft:"10px" }}
            >
              Delete
            </button>

          </div>
        ))
      )}

    </div>
  );
}