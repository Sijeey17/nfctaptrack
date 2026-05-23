import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

export default function ItemPage(){

  const router = useRouter();
  const { code } = router.query;

  const [item,setItem] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    if(code){
      loadItem();
    }
  },[code]);

  async function loadItem(){

    const { data, error } = await supabase
      .from("Items_Table")
      .select("*")
      .eq("item_code", code)
      .single();

    console.log(data);
    console.log(error);

    if(data){
      setItem(data);
    }

    setLoading(false);
  }

  if(loading){
    return <h3>Loading...</h3>;
  }

  if(!item){
    return <h3>Item not found.</h3>;
  }

  return(
    <center style={{ padding:"40px" }}>

      <h1>NFC TapTrack</h1>

      <p>
        This item belongs to someone.
      </p>

      <h3>
        Please surrender this item to the SCHOOL SAO OFFICE
      </h3>

      <hr/>

      <p>
        <b>Item Code:</b> {item.item_code}
      </p>

      <p>
        <b>Item Name:</b> {item.item_name}
      </p>

      <h2>
        Status: {item.status}
      </h2>

    </center>
  );
}