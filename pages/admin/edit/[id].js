import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "../../../lib/supabase";
import { GrStatusGoodSmall } from "react-icons/gr"; // Grommet (Perfect for a small dot indicator)
import { RiCheckboxCircleLine, RiErrorWarningLine } from "react-icons/ri"; // Remix Icon
import { MdOutlineLoop } from "react-icons/md"; // Material Design (Pending/In Progress)

export default function EditItem() {

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser(){

    const { data } = await supabase.auth.getUser();

    if(!data.user){
      router.push("/login");
    }
  }

  const router = useRouter();
  const { id } = router.query;

  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(id){
      loadItem();
    }
  }, [id]);

  async function loadItem(){

    const { data, error } = await supabase
      .from("Items_Table")
      .select("*")
      .eq("item_code", id)
      .single();

    if(error){
      console.log(error);
      return;
    }

    setItemCode(data.item_code);
    setItemName(data.item_name);
    setStatus(data.status);

    setLoading(false);
  }

  async function updateItem(){

    const { error } = await supabase
      .from("Items_Table")
      .update({
        item_name: itemName,
        status: status
      })
      .eq("item_code", itemCode);

    if(error){
      alert("Failed to update item");
      console.log(error);
      return;
    }

    alert("Item updated successfully");

    router.push("/admin/dashboard");
  }

  async function signOut(){

    await supabase.auth.signOut();

    router.push("/login");
  }

  if(loading){
    return <h2 style={{ padding:"40px" }}>Loading...</h2>;
  }

  return(
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right, #f7d6d0, #d9f0a3)",
        display: "flex",
        flexDirection: "column"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          backgroundColor: "#eee",
          padding: "12px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ccc"
        }}
      >

        <h2 style={{ margin:0 }}>
          NFC TapTrack
        </h2>

        <div>

          <button
            onClick={()=>router.push("/admin/dashboard")}
            style={navBtn}
          >
            Home
          </button>

          <button
            onClick={()=>router.push("/admin/add-item")}
            style={navBtn}
          >
            Add Item
          </button>

          <button
            onClick={()=>router.push("/admin/owners")}
            style={navBtn}
          >
            Manage Owners
          </button>

          <button
            onClick={signOut}
            style={{
              ...navBtn,
              backgroundColor:"#ff0000",
              color:"white"
            }}
          >
            Sign Out
          </button>

        </div>
      </div>

      {/* TITLE */}
      <h1
        style={{
          textAlign:"center",
          fontSize:"60px",
          marginTop:"30px",
          marginBottom:"20px",
          color:"#3d0000"
        }}
      >
        Edit Item
      </h1>

      {/* FORM */}
      <div
        style={{
          width:"650px",
          margin:"0 auto",
          background:"#f3ebdd",
          padding:"40px",
          borderRadius:"8px",
          border:"1px solid gray",
          boxShadow:"0 4px 10px rgba(0,0,0,0.2)"
        }}
      >

        {/* ITEM CODE */}
        <div style={fieldStyle}>
          <label style={labelStyle}>
            Item Code :
          </label>

          <input
            type="text"
            value={itemCode}
            readOnly
            style={{
              ...inputStyle,
              backgroundColor:"#ddd",
              cursor:"not-allowed"
            }}
          />
        </div>

        {/* ITEM NAME */}
        <div style={fieldStyle}>
          <label style={labelStyle}>
            Item Name :
          </label>

          <input
            type="text"
            value={itemName}
            onChange={(e)=>setItemName(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* STATUS */}
        <div style={fieldStyle}>
          <label style={labelStyle}>
            Status :
          </label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%"
            }}
          >
            <select
              value={status}
              style={inputStyle}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="" disabled hidden>
                Select an option...
              </option>

              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>

            <div style={{ marginLeft: "-35px" }}>
              {status === "" && (
                <GrStatusGoodSmall color="gray" />
              )}

              {status === "Active" && (
                <GrStatusGoodSmall color="green" />
              )}

              {status === "Inactive" && (
                <GrStatusGoodSmall color="red" />
              )}

              {status === "Lost" && (
                <RiErrorWarningLine color="red" />
              )}

              {status === "Found" && (
                <RiCheckboxCircleLine color="green" />
              )}
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div
          style={{
            textAlign:"center",
            marginTop:"30px"
          }}
        >
          <button
            onClick={updateItem}
            style={{
              padding:"12px 40px",
              border:"none",
              borderRadius:"5px",
              backgroundColor:"#222",
              color:"white",
              fontSize:"16px",
              cursor:"pointer"
            }}
          >
            Update Item
          </button>
        </div>

      </div>

      {/* FOOTER */}
      <div
        style={{
          marginTop:"auto",
          padding:"20px",
          display:"flex",
          justifyContent:"space-between",
          fontSize:"14px"
        }}
      >

        <div>
          <h4>Site</h4>
          <p>Home</p>
          <p>Add Item</p>
        </div>

        <div>
          <h4>Help</h4>
          <p>Customer Support</p>
          <p>Terms & Conditions</p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>+63 9123456789</p>
          <p>nfctaptrack@gmail.com</p>
        </div>

      </div>

    </div>
  );
}
const navBtn = {
  marginLeft:"10px",
  padding:"8px 15px",
  border:"1px solid gray",
  borderRadius:"4px",
  cursor:"pointer"
};

const fieldStyle = {
  display: "grid",
  gridTemplateColumns: "180px 1fr",
  alignItems: "center",
  gap: "20px",
  marginBottom: "30px"
};

const labelStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "right"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "5px",
  border: "1px solid gray",
  fontSize: "16px",
  boxSizing: "border-box"
};