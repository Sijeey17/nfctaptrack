import { useRouter } from "next/router";
import { useEffect,useState } from "react";
import supabase from "../../lib/supabase";

export default function ItemPage(){

  const router = useRouter();
  const { code } = router.query;

  const [item,setItem]=useState(null);

  useEffect(()=>{
    if(code) loadItem();
  },[code]);

  async function loadItem(){

    const { data } = await supabase
      .from("Items_Table")
      .select("*")
      .eq("item_code",code)
      .single();

    setItem(data);
  }

  if(!item) return <h3>Loading...</h3>;

  return(
    <center>

      <h2>NFC TapTrack</h2>

      <p>This item belongs to someone.</p>

      <b>
        Please surrender to SCHOOL SAO OFFICE
      </b>

      <p>Item Code: {item.item_code}</p>

      <h3>Status: {item.status}</h3>

    </center>
  );
}