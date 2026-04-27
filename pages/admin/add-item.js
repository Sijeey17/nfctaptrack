import { useState } from "react"
import supabase from "../../lib/supabase"
import { useRouter } from "next/router"

export default function AddItem(){

  const router = useRouter()

  const [itemName,setItemName]=useState("")
  const [itemCode,setItemCode]=useState("")
  const [ownerName,setOwnerName]=useState("")
  const [studentID,setStudentID]=useState("")
  const [contact,setContact]=useState("")

  async function addItem(){

    // create owner
    const { data: owner } =
      await supabase
        .from("owners")
        .insert({
          name:ownerName,
          student_id:studentID,
          contact
        })
        .select()
        .single()

    // create item
    await supabase
      .from("items")
      .insert({
        item_name:itemName,
        item_code:itemCode,
        owner_id:owner.id
      })

    router.push("/admin/dashboard")
  }

  return(
    <div>

      <h2>Add Item</h2>

      <input placeholder="Item Name"
        onChange={e=>setItemName(e.target.value)} />

      <input placeholder="Item Code"
        onChange={e=>setItemCode(e.target.value)} />

      <h3>Owner Info</h3>

      <input placeholder="Owner Name"
        onChange={e=>setOwnerName(e.target.value)} />

      <input placeholder="Student ID"
        onChange={e=>setStudentID(e.target.value)} />

      <input placeholder="Contact"
        onChange={e=>setContact(e.target.value)} />

      <button onClick={addItem}>
        Save
      </button>

    </div>
  )
}