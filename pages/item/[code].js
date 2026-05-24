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

    if(data){
      setItem(data);
    }

    setLoading(false);
  }

  // LOADING UI
  if(loading){
    return(
      <div
        style={{
          minHeight:"100vh",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          background:
            "linear-gradient(to right, #f7f3e8, #d9f0a3)"
        }}
      >
        <h1>Loading...</h1>
      </div>
    );
  }

  // ITEM NOT FOUND UI
  if(!item){
    return(
      <div
        style={{
          minHeight:"100vh",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          background:
            "linear-gradient(to right, #f7f3e8, #d9f0a3)"
        }}
      >
        <div
          style={{
            backgroundColor:"white",
            padding:"40px",
            borderRadius:"15px",
            boxShadow:"0 4px 10px rgba(0,0,0,0.2)",
            textAlign:"center"
          }}
        >
          <h1>Item Not Found</h1>
          <p>The item you scanned does not exist.</p>
        </div>
      </div>
    );
  }

  return(
    <div
      style={{
        minHeight:"100vh",
        background:
          "linear-gradient(to right, #f7f3e8, #d9f0a3)",
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between",
        padding:"20px"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center"
        }}
      >
        <h1
          style={{
            color:"#222",
            fontSize:"32px"
          }}
        >
          NFC TapTrack
        </h1>
      </div>

      {/* CENTER CONTENT */}
      <div
        style={{
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          flex:1
        }}
      >

        <div
          style={{
            width:"700px",
            backgroundColor:"#f8f8e8",
            borderRadius:"15px",
            overflow:"hidden",
            boxShadow:"0 5px 15px rgba(0,0,0,0.2)"
          }}
        >

          {/* IMAGE SECTION */}
          <div
            style={{
              height:"250px",
              backgroundImage:
                "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop')",
              backgroundSize:"cover",
              backgroundPosition:"center",
              position:"relative"
            }}
          >

            <div
              style={{
                position:"absolute",
                inset:0,
                backgroundColor:"rgba(0,0,0,0.45)",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                color:"white",
                textAlign:"center",
                padding:"20px"
              }}
            >
              <h2>Lost Item Detected</h2>

              <p
                style={{
                  maxWidth:"500px",
                  lineHeight:"1.6"
                }}
              >
                This item belongs to someone.
                Please surrender this item to the
                STI COLLEGE CALOOCAN.
              </p>
            </div>

          </div>

          {/* ITEM INFO */}
          <div style={{ padding:"35px" }}>

            <div style={{ marginBottom:"20px" }}>
              <p
                style={{
                  color:"gray",
                  marginBottom:"5px"
                }}
              >
                Item Code
              </p>

              <h2>{item.item_code}</h2>
            </div>

            <div style={{ marginBottom:"20px" }}>
              <p
                style={{
                  color:"gray",
                  marginBottom:"5px"
                }}
              >
                Item Name
              </p>

              <h2>{item.item_name}</h2>
            </div>

            <div
              style={{
                backgroundColor:"#222",
                color:"white",
                padding:"15px",
                borderRadius:"10px",
                textAlign:"center",
                marginTop:"20px"
              }}
            >
              <h2>Status: {item.status}</h2>
            </div>

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div
        style={{
          display:"flex",
          justifyContent:"space-between",
          marginTop:"20px",
          fontSize:"14px",
          color:"#333"
        }}
      >

        <div>
          <h4>Help</h4>
          <p>Customer Support</p>
          <p>Terms & Conditions</p>
          <p>Privacy Policy</p>
        </div>

        <div style={{ textAlign:"center" }}>
          <p>© 2026 NFC TapTrack</p>
          <p>All Rights Reserved</p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>Tel: +63 09123456789</p>
          <p>Email: nfctaptrack@gmail.com</p>
        </div>

      </div>

    </div>
  );
}