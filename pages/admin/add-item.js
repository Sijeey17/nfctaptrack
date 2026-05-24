import { useState } from "react";
import supabase from "../../lib/supabase";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FaTag, FaIdCard } from 'react-icons/fa';
import { FiMail } from "react-icons/fi";
import { BiRename } from "react-icons/bi";
import { GrStatusGoodSmall } from "react-icons/gr"; // Grommet (Perfect for a small dot indicator)
import { RiCheckboxCircleLine, RiErrorWarningLine } from "react-icons/ri"; // Remix Icon
import { MdOutlineLoop } from "react-icons/md"; // Material Design (Pending/In Progress)

export default function AddItem() {

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

  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [status, setStatus] = useState("");
  const [ownerId, setOwnerId] = useState("");

  const [message, setMessage] = useState("");

  async function addItem() {

    // =========================
    // CHECK IF OWNER EXISTS
    // =========================
    if (!itemCode || !itemName || !status || !ownerId) {
      setMessage("Please fill in all fields");
      return;
    }

    const { data: owner, error: ownerError } = await supabase
      .from("Owners_Table")
      .select("*")
      .eq("student_id", ownerId.trim());

    // OWNER NOT FOUND
    if (ownerError || owner.length === 0) {

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
    if (error) {

      console.log(error);

      setMessage("Failed to add item");
      return;
    }

    // SUCCESS
    setMessage("Item added successfully!");

    // REDIRECT
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 1500);
  }

  async function signOut(){

    const { error } = await supabase.auth.signOut();

    if(error){
      alert("Failed to sign out");
      return;
    }

    router.push("/login");
  }

  useEffect(() => {
  generateItemCode();
  }, []);

  async function generateItemCode() {
    const { data, error } = await supabase
      .from("Items_Table")
      .select("item_code")
      .order("item_code", { ascending: false })
      .limit(1);

    if (error) {
      console.log(error);
      return;
    }

    if (data.length === 0) {
      // FIRST ITEM
      setItemCode("1000");
    } else {
      const lastCode = parseInt(data[0].item_code);
      setItemCode(String(lastCode + 1));
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right, #ffd6d6, #f2ffd1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "10px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ccc"
        }}
      >

        <h2
          style={{
            margin: 0,
            color: "#333"
          }}
        >
          NFC TapTrack
        </h2>

        <div
          style={{
            display: "flex",
            gap: "15px"
          }}
        >

          <button
            onClick={() => router.push("/admin/dashboard")}
            style={navButton}
          >
            Home
          </button>

          <button
            style={{
              ...navButton,
              backgroundColor: "#222",
              color: "white"
            }}
          >
            Add Item
          </button>

          <button
            onClick={() => router.push("/admin/owners")}
            style={navButton}
          >
            Manage Owners
          </button>

          <button
            onClick={signOut}
            style={{
              ...navButton,
              background:"red",
              color:"white"
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* TITLE */}
      <div
        style={{
          textAlign: "center",
          marginTop: "10px"
        }}
      >
        <h1
          style={{
            fontSize: "60px",
            margin: 0,
            fontWeight: "bold",
            background:
              "linear-gradient(to right, #5b0000, #1d5f00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          Add Item
        </h1>
      </div>

      {/* FORM */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
          marginBottom: "10px"
        }}
      >

        <div
          style={{
            width: "700px",
            backgroundColor: "rgba(255,255,255,0.4)",
            border: "1px solid #888",
            borderRadius: "10px",
            padding: "40px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
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
                backgroundColor: "#eee",
                cursor: "not-allowed"
              }}
            />
            <FaTag style={{ marginLeft:"-30px", color:"black" }} />
          </div>

          {/* ITEM NAME */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Item Name :
            </label>

            <input
              type="text"
              placeholder="e.g. Wallet, Keys, etc."
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              style={inputStyle}
            />
            <BiRename style={{ marginLeft:"-30px", color:"black" }} />
          </div>

          {/* STATUS */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Status :
            </label>

            <select
              value={status}
              style={inputStyle}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="" disabled hidden sytle={{color: "gray"}}>Select an option...</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
            {status === "" && <GrStatusGoodSmall color="gray" style={{ marginLeft:"-30px" }} /> || status === "Active" && <GrStatusGoodSmall color="green" style={{ marginLeft:"-30px" }} /> || status === "Inactive" && <GrStatusGoodSmall color="red" style={{ marginLeft:"-30px" }} />}
            {status === "Lost" && <RiErrorWarningLine color="red" style={{ marginLeft:"-30px" }} />}
            {status === "Found" && <RiCheckboxCircleLine color="green" style={{ marginLeft:"-30px" }} />}
          </div>

          {/* OWNER ID */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Owner Student ID :
            </label>

            <input
              type="text"
              placeholder="e.g. 2000123456"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              style={inputStyle}
            />
            <FaIdCard style={{ marginLeft:"-30px", color:"black" }} />
          </div>

          {/* BUTTON */}
          <div
            style={{
              textAlign: "center",
              marginTop: "30px"
            }}
          >

            <button
              onClick={addItem}
              style={{
                padding: "12px 40px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#222",
                color: "white",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Save Item
            </button>

          </div>

          {/* MESSAGE */}
          <p
            style={{
              textAlign: "center",
              marginTop: "30px",
              fontWeight: "bold"
            }}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================= */
/* STYLES */
/* ========================= */

const navButton = {
  padding: "8px 15px",
  border: "1px solid gray",
  borderRadius: "5px",
  backgroundColor: "#ffffff",
  cursor: "pointer"
};

const fieldStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "30px"
};

const labelStyle = {
  width: "180px",
  fontWeight: "bold",
  fontSize: "24px"
};

const inputStyle = {
  flex: 1,
  padding: "12px",
  borderRadius: "5px",
  border: "1px solid gray",
  fontSize: "16px",
};