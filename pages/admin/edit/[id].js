import { useRouter } from "next/router"
import { useEffect,useState } from "react"
import supabase from "../../../lib/supabase"

export default function EditItem(){

  const router=useRouter()
  const { id } = router.query

  const [item,setItem]=useState(null)

  useEffect(()=>{
    if(id) fetchItem()
  },[id])

  async function fetchItem(){

    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("id",id)
      .single()

    setItem(data)
  }

  async function updateItem(){

    await supabase
      .from("items")
      .update({
        item_name:item.item_name,
        status:item.status
      })
      .eq("id",id)

    router.push("/admin/dashboard")
  }

  if(!item) return <p>Loading...</p>

  return(
    <div>

      <h2>Edit Item</h2>

      <input
        value={item.item_name}
        onChange={e=>
          setItem({...item,item_name:e.target.value})
        }
      />

      <select
        value={item.status}
        onChange={e=>
          setItem({...item,status:e.target.value})
        }
      >
        <option value="lost">Lost</option>
        <option value="found">Found</option>
        <option value="claimed">Claimed</option>
      </select>

      <button onClick={updateItem}>
        Update
      </button>

    </div>
  )
}