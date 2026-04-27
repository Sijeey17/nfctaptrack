import { useEffect, useState } from "react"
import supabase from "../../lib/supabase"
import { useRouter } from "next/router"

export default function Dashboard(){

  const [items,setItems]=useState([])
  const router=useRouter()

  useEffect(()=>{
    fetchItems()
  },[])

  async function fetchItems(){

    const { data } = await supabase
      .from("items")
      .select(`
        id,
        item_code,
        item_name,
        status,
        owners(name,student_id,contact)
      `)

    setItems(data)
  }

  async function deleteItem(id){

    await supabase
      .from("items")
      .delete()
      .eq("id",id)

    fetchItems()
  }

  return(
    <div>
      <h1>Admin Dashboard</h1>

      <button onClick={()=>router.push("/admin/add-item")}>
        Add Item
      </button>

      {items.map(item=>(
        <div key={item.id}>

          <h3>{item.item_name}</h3>
          <p>ID: {item.item_code}</p>
          <p>Status: {item.status}</p>

          <b>Owner</b>
          <p>{item.owners?.name}</p>

          <button
            onClick={()=>router.push(`/admin/edit/${item.id}`)}
          >
            Edit
          </button>

          <button
            onClick={()=>deleteItem(item.id)}
          >
            Delete
          </button>

          <hr/>
        </div>
      ))}
    </div>
  )
}