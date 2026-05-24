"use client";

import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import { useRouter } from "next/router";
import { FaSearch, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { MdPerson } from "react-icons/md";
import { FaIdCard, FaIdBadge } from "react-icons/fa";
import { FiPhone, FiMail } from "react-icons/fi";

export default function OwnersPage() {

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

  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [contact, setContact] = useState("");
  const [owner_email, setStudentEmail] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchOwners();
  }, []);

  async function fetchOwners() {
    const { data, error } = await supabase
      .from("Owners_Table")
      .select("*");

    if (error) return console.log(error);

    setOwners(data || []);
    setFilteredOwners(data || []);
  }

  // ================= SEARCH =================
  function searchOwner(value) {
    setSearch(value);

    const filtered = owners.filter((owner) =>
      owner.name.toLowerCase().includes(value.toLowerCase()) ||
      owner.student_id.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOwners(filtered);
    setCurrentPage(1);
  }

  // ================= CRUD =================
  async function addOwner() {
    if (!name || !studentId || !contact || !owner_email) {
      alert("Complete all fields");
      return;
    }

    const { error } = await supabase
      .from("Owners_Table")
      .insert([{ name, student_id: studentId, contact, owner_email }]);

    if (error) return alert("Failed to add");

    alert("Owner added");
    clearForm();
    fetchOwners();
  }

  async function deleteOwner(id) {
    if (!confirm("Delete owner + all items?")) return;

    await supabase.from("Items_Table").delete().eq("owner_id", id);
    await supabase.from("Owners_Table").delete().eq("student_id", id);

    fetchOwners();
  }

  function editOwner(o) {
    setEditingId(o.student_id);
    setName(o.name);
    setStudentId(o.student_id);
    setContact(o.contact);
    setStudentEmail(o.owner_email);
  }

  async function updateOwner() {
    await supabase
      .from("Owners_Table")
      .update({ name, contact, owner_email })
      .eq("student_id", editingId);

    alert("Updated");
    clearForm();
    fetchOwners();
  }

  function clearForm() {
    setName("");
    setStudentId("");
    setContact("");
    setStudentEmail("");
    setEditingId(null);
  }

  async function signOut(){

    const { error } = await supabase.auth.signOut();

    if(error){
      alert("Failed to sign out");
      return;
    }

    router.push("/login");
  }

  // ================= PAGINATION =================
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOwners = filteredOwners.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredOwners.length / itemsPerPage);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to right, #f7d6d0, #d9f0a3)",
      paddingBottom: "40px"
    }}>

      {/* HEADER */}
      <div style={{
          backgroundColor: "#f5f5f5",
          padding: "10px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ccc"
      }}>
        <h2 style={{margin: 0,color: "#333"}}>NFC TapTrack</h2>

        <div style={{display: "flex", gap: "15px"}}>
          <button onClick={() => router.push("/admin/dashboard")}style={navButton}>Home</button>
          <button onClick={() => router.push("/admin/add-item")} style={navButton}>Add Item</button>
          <button style={{...navButton, backgroundColor: "#222", color: "white"}}>Manage Owners</button>
          <button onClick={signOut} style={{...navButton, background:"red", color:"white"}}>Sign Out</button>
        </div>
      </div>

      {/* TITLE */}
      <h1 style={{
        textAlign: "center",
        fontSize: "48px",
        marginTop: "30px",
        color: "#4b0000"
      }}>
        Manage Owners
      </h1>

      {/* FORM CARD */}
      <div style={{
        width: "400px",
        margin: "20px auto",
        padding: "20px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
      }}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={input}/>   
        <MdPerson style={{ marginLeft:"-30px", color:"black" }} />
        <input placeholder="Student ID" value={studentId} onChange={e=>setStudentId(e.target.value)} style={input}/>
        <FaIdCard style={{ marginLeft:"-30px", color:"black" }} />
        <input placeholder="Contact" value={contact} onChange={e=>setContact(e.target.value)} style={input}/>
        <FiPhone style={{ marginLeft:"-30px", color:"black" }} />
        <input placeholder="Owner Email" value={owner_email} onChange={e=>setStudentEmail(e.target.value)} style={input}/>
        <FiMail style={{ marginLeft:"-30px", color:"black" }} />
        {editingId ? (
          <button onClick={updateOwner} style={btn}>Update</button>
        ) : (
          <button onClick={addOwner} style={btn}>Add Owner</button>
        )}

        <button onClick={clearForm} style={{...btn, background:"#ccc", marginTop:"5px"}}>
          Clear
        </button>
      </div>

      {/* SEARCH */}
      <div style={{ textAlign:"center", marginBottom:"20px" }}>
        <input 
          placeholder="Search by name or student ID"
          value={search}
          onChange={(e)=>searchOwner(e.target.value)}
          style={{
            width:"300px",
            padding:"10px",
            borderRadius:"20px",
            border:"1px solid gray"
          }}
        />
        <FaSearch style={{ marginLeft:"-30px", color:"gray" }} />
      </div>

      {/* OWNER CARDS */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))",
        gap:"20px",
        padding:"20px"
      }}>
        {currentOwners.map(owner=>(
          <div key={owner.student_id} style={{
            background:"#fff",
            padding:"20px",
            borderRadius:"10px",
            boxShadow:"0 4px 8px rgba(0,0,0,0.2)"
          }}>
            <h3>{owner.name}</h3>
            <p><b>ID:</b> {owner.student_id}</p>
            <p><b>Contact:</b> {owner.contact}</p>
            <p><b>Owner Email:</b> {owner.owner_email}</p>
            <button onClick={()=>editOwner(owner)} style={btnSmall}>Edit</button>
            <button onClick={()=>deleteOwner(owner.student_id)} style={deleteBtn}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div style={{ textAlign:"center", marginTop:"20px" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={()=>setCurrentPage(i+1)}
            style={{
              margin:"5px",
              padding:"8px 12px",
              background: currentPage === i+1 ? "#333" : "#ddd",
              color: currentPage === i+1 ? "#fff" : "#000",
              border:"none",
              borderRadius:"5px"
            }}
          >
            {i+1}
          </button>
        ))}
      </div>

    </div>
  );
}

// STYLES
const input = {
  width:"94.5%",
  padding:"10px",
  marginBottom:"10px",
  borderRadius:"5px",
  border:"1px solid gray"
};

const btn = {
  width:"100%",
  padding:"10px",
  background:"#333",
  color:"#fff",
  border:"none",
  borderRadius:"5px",
  cursor:"pointer"
};

const btnSmall = {
  padding:"6px 10px",
  marginRight:"10px",
  border:"none",
  borderRadius:"5px",
  cursor:"pointer"
};

const deleteBtn = {
  ...btnSmall,
  background:"red",
  color:"#fff"
};

const navButton = {
  padding: "8px 15px",
  border: "1px solid gray",
  borderRadius: "5px",
  backgroundColor: "#ffffff",
  cursor: "pointer"
};