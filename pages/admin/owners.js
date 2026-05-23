import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

export default function OwnersPage() {

  const [owners, setOwners] = useState([]);

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [contact, setContact] = useState("");
  const [searchId, setSearchId] = useState("");
  const [filteredOwners, setFilteredOwners] = useState([]);

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchOwners();
  }, []);

  // =========================
  // FETCH OWNERS
  // =========================
  async function fetchOwners() {

  const { data, error } = await supabase
    .from("Owners_Table")
    .select("*");

    if (error) {
      console.log(error);
      return;
    }

    setOwners(data || []);
    setFilteredOwners(data || []);
  }

  function searchOwner(value) {

  setSearchId(value);

  const filtered = owners.filter((owner) =>
      owner.student_id
        .toLowerCase()
        .includes(value.toLowerCase())
    );

    setFilteredOwners(filtered);
  }

  // =========================
  // ADD OWNER
  // =========================
  async function addOwner() {

    if (!name || !studentId || !contact) {
      alert("Complete all fields");
      return;
    }

    const { error } = await supabase
      .from("Owners_Table")
      .insert([
        {
          name,
          student_id: studentId,
          contact
        }
      ]);

    if (error) {
      alert("Failed to add owner");
      console.log(error);
      return;
    }

    alert("Owner added successfully");

    clearForm();

    fetchOwners();
  }

  // =========================
  // DELETE OWNER + ITEMS
  // =========================
  async function deleteOwner(studentId) {

    const confirmDelete = confirm(
      "Delete this owner and all owned items?"
    );

    if (!confirmDelete) return;

    // DELETE ITEMS
    const { error: itemError } = await supabase
      .from("Items_Table")
      .delete()
      .eq("owner_id", studentId);

    if (itemError) {
      alert("Failed to delete owner's items");
      console.log(itemError);
      return;
    }

    // DELETE OWNER
    const { error: ownerError } = await supabase
      .from("Owners_Table")
      .delete()
      .eq("student_id", studentId);

    if (ownerError) {
      alert("Failed to delete owner");
      console.log(ownerError);
      return;
    }

    alert("Owner and items deleted");

    fetchOwners();
  }

  // =========================
  // LOAD OWNER FOR EDIT
  // =========================
  function editOwner(owner) {

    setEditingId(owner.student_id);

    setName(owner.name);
    setStudentId(owner.student_id);
    setContact(owner.contact);
  }

  // =========================
  // UPDATE OWNER
  // =========================
  async function updateOwner() {

    const { error } = await supabase
      .from("Owners_Table")
      .update({
        name,
        contact
      })
      .eq("student_id", editingId);

    if (error) {
      alert("Failed to update owner");
      console.log(error);
      return;
    }

    // UPDATE ITEMS owner_id IF student_id CHANGED
    if (editingId !== studentId) {

      await supabase
        .from("Items_Table")
        .update({
          owner_id: studentId
        })
        .eq("owner_id", editingId);

      await supabase
        .from("Owners_Table")
        .update({
          student_id: studentId
        })
        .eq("student_id", editingId);
    }

    alert("Owner updated successfully");

    clearForm();

    fetchOwners();
  }

  // =========================
  // CLEAR FORM
  // =========================
  function clearForm() {

    setName("");
    setStudentId("");
    setContact("");

    setEditingId(null);
  }

  return (
    <div style={{ padding: "20px" }}>

      <h1>Owners Management</h1>

      <hr />

      <h2>
        {editingId ? "Update Owner" : "Add Owner"}
      </h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Contact"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />

      <br /><br />

      {editingId ? (
        <button onClick={updateOwner}>
          Update Owner
        </button>
      ) : (
        <button onClick={addOwner}>
          Add Owner
        </button>
      )}

      <button
        onClick={clearForm}
        style={{ marginLeft: "10px" }}
      >
        Clear
      </button>

      <hr />

      <h2>Owners List</h2>

      <input
        type="text"
        placeholder="Search Student ID"
        value={searchId}
        onChange={(e) => searchOwner(e.target.value)}
        style={{
          width: "300px",
          padding: "8px"
        }}
      />

      <br /><br />

      {owners.length === 0 ? (
        <p>No owners found.</p>
      ) : (
        filteredOwners.map((owner) => (

          <div
            key={owner.student_id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px"
            }}
          >

            <h3>{owner.name}</h3>

            <p>
              <b>Student ID:</b> {owner.student_id}
            </p>

            <p>
              <b>Contact:</b> {owner.contact}
            </p>

            <button
              onClick={() => editOwner(owner)}
            >
              Edit
            </button>

            <button
              onClick={() =>
                deleteOwner(owner.student_id)
              }
              style={{
                marginLeft: "10px",
                backgroundColor: "red",
                color: "white"
              }}
            >
              Delete Owner + Items
            </button>

          </div>
        ))
      )}

    </div>
  );
}