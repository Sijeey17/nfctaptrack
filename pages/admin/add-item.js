import { useState } from "react";
import supabase from "../../lib/supabase";
import { useRouter } from "next/router";

export default function AddItem() {

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
    const { data: owner, error: ownerError } = await supabase
      .from("Owners_Table")
      .select("*")
      .eq("student_id", ownerId.trim());

    // OWNER NOT FOUND
    if (ownerError || owner.length === 0) {

      console.log(ownerError);

      setMessage("❌ Owner student ID not found");
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

      setMessage("❌ Failed to add item");
      return;
    }

    // SUCCESS
    setMessage("✅ Item added successfully!");

    // REDIRECT
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 1500);
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
            Dashboard
          </button>

          <button
            onClick={() => router.push("/admin/owners")}
            style={navButton}
          >
            Owner Management
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

        </div>
      </div>

      {/* TITLE */}
      <div
        style={{
          textAlign: "center",
          marginTop: "40px"
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
          marginTop: "20px",
          marginBottom: "40px"
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
              onChange={(e) => setItemCode(e.target.value)}
              style={inputStyle}
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
              onChange={(e) => setItemName(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* STATUS */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Status :
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
          </div>

          {/* OWNER ID */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Owner Student ID :
            </label>

            <input
              type="text"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              style={inputStyle}
            />
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
              marginTop: "20px",
              fontWeight: "bold"
            }}
          >
            {message}
          </p>

        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.5)",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px"
        }}
      >

        <div>
          <h4>Site</h4>
          <p>Dashboard</p>
          <p>Add Item</p>
        </div>

        <div>
          <h4>Help</h4>
          <p>Customer Support</p>
          <p>Terms & Conditions</p>
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

/* ========================= */
/* STYLES */
/* ========================= */

const navButton = {
  padding: "8px 15px",
  border: "1px solid gray",
  borderRadius: "5px",
  backgroundColor: "#eee",
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
  fontSize: "16px"
};