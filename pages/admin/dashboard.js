import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import { useRouter } from "next/router";
import { GrStatusGoodSmall } from "react-icons/gr";
import {
  RiCheckboxCircleLine,
  RiErrorWarningLine
} from "react-icons/ri";

  export default function Dashboard(){

  useEffect(() => {
    checkUser();

    fetchItems();
  }, []);

  async function checkUser(){

    const { data } = await supabase.auth.getUser();

    if(!data.user){
      router.push("/login");
    }
  }

  useEffect(() => {

    let timeout;

    function resetTimer(){

      clearTimeout(timeout);

      timeout = setTimeout(async () => {

        await supabase.auth.signOut();

        alert("Session expired");

        router.push("/login");

      }, 15 * 60 * 1000); // 15 minutes
    }

    // USER ACTIVITY
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeout);

      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };

  }, []);

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const router = useRouter();

  useEffect(()=>{
    fetchItems();
  },[]);

  async function fetchItems(){

    const { data, error } = await supabase
      .from("Items_Table")
      .select("*");

    if(error){
      console.log(error);
      return;
    }

    setItems(data || []);
  }

  async function signOut(){

    const { error } = await supabase.auth.signOut();

    if(error){
      alert("Failed to sign out");
      return;
    }

    router.push("/login");
  }

  async function deleteItem(itemCode){

    const { error } = await supabase
      .from("Items_Table")
      .delete()
      .eq("item_code", itemCode);

    if(error){
      alert("Failed to delete");
      return;
    }

    const user =
    await supabase.auth.getUser();

  await supabase
    .from("Logs_Table")
    .insert([
      {
        action: "Deleted Item",
        item_code: itemCode,
        admin_email:
          user.data.user.email
      }
    ]);

    fetchItems();
  }

  // =========================
  // SEARCH FILTER
  // =========================
  const filteredItems = items.filter(item =>
    item.item_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.owner_id?.toLowerCase().includes(search.toLowerCase()) ||
    item.item_code?.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(
    filteredItems.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return(
    <div
      style={{
        minHeight:"100vh",
        background:
          "linear-gradient(to right, #f3d6d6, #d9f5a3)",
        display:"flex",
        flexDirection:"column"
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

        <div style={{ display:"flex", gap:"15px" }}>

          <button
            style={{
              ...navBtn,
              background:"#222",
              color:"white"
            }}
          >
            Home
          </button>

          <button
            onClick={()=>
              router.push("/admin/add-item")
            }
            style={navBtn}
          >
            Add Item
          </button>

          <button
            onClick={()=>
              router.push("/admin/owners")
            }
            style={navBtn}
          >
            Manage Owners
          </button>

          <button
            onClick={signOut}
            style={{
              ...navBtn,
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
          textAlign:"center",
          marginTop:"30px"
        }}
      >
        <h1
          style={{
            fontSize:"60px",
            margin:0,
            fontWeight:"bold",
            background:
              "linear-gradient(to right, green, maroon)",
            WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent"
          }}
        >
          Home
        </h1>
      </div>

      {/* SEARCH BAR */}
      <div
        style={{
          display:"flex",
          justifyContent:"center",
          marginTop:"20px"
        }}
      >
        <input
          type="text"
          placeholder="Search item name, owner ID, or item code..."
          value={search}
          onChange={(e)=>{
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            width:"400px",
            padding:"12px 20px",
            borderRadius:"25px",
            border:"1px solid #aaa",
            outline:"none",
            fontSize:"14px"
          }}
        />
      </div>

      {/* ITEMS GRID */}
      <div
        style={{
          display:"grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
          gap:"25px",
          padding:"40px"
        }}
      >

        {filteredItems.length === 0 ? (

          <p>No items found.</p>

        ) : (

          currentItems.map(item=>(
            <div
              key={item.item_code}
              style={{
                background:"rgba(255,255,255,0.6)",
                borderRadius:"10px",
                padding:"20px",
                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.2)"
              }}
            >

              <h3 style={{ margin:"5px 0" }}>
                {item.item_name}
              </h3>

              <p style={{ fontSize:"13px" }}>
                Code: {item.item_code}
              </p>

              <p style={{ fontSize:"13px" }}>
                Owner ID: {item.owner_id}
              </p>

              <p style={{ fontSize:"13px" }}>

                {item.status === "Active" &&
                  <GrStatusGoodSmall color="green" />
                }

                {item.status === "Inactive" &&
                  <GrStatusGoodSmall color="red" />
                }

                {item.status === "Lost" &&
                  <RiErrorWarningLine color="red" />
                }

                {item.status === "Found" &&
                  <RiCheckboxCircleLine color="green" />
                }

                {" "}Status: {item.status}
              </p>

              <div style={{ marginTop:"10px" }}>

                <button
                  onClick={()=>
                    router.push(
                      `/admin/edit/${item.item_code}`
                    )
                  }
                  style={smallBtn}
                >
                  Edit
                </button>

                <button
                  onClick={()=>
                    deleteItem(item.item_code)
                  }
                  style={{
                    ...smallBtn,
                    background:"red",
                    color:"white",
                    marginLeft:"10px"
                  }}
                >
                  Delete
                </button>

              </div>

            </div>
          ))

        )}

      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div
          style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            gap:"10px",
            paddingBottom:"40px",
            flexWrap:"wrap"
          }}
        >

          {/* PREVIOUS */}
          <button
            onClick={()=>
              setCurrentPage((prev)=>prev - 1)
            }
            disabled={currentPage === 1}
            style={{
              ...pageBtn,
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            Previous
          </button>

          {/* PAGE NUMBERS */}
          {[...Array(totalPages)].map((_, index)=>(
            <button
              key={index}
              onClick={()=>
                setCurrentPage(index + 1)
              }
              style={{
                ...pageBtn,
                background:
                  currentPage === index + 1
                    ? "#222"
                    : "white",
                color:
                  currentPage === index + 1
                    ? "white"
                    : "black"
              }}
            >
              {index + 1}
            </button>
          ))}

          {/* NEXT */}
          <button
            onClick={()=>
              setCurrentPage((prev)=>prev + 1)
            }
            disabled={
              currentPage === totalPages
            }
            style={{
              ...pageBtn,
              opacity:
                currentPage === totalPages
                  ? 0.5
                  : 1
            }}
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}

/* ========================= */
/* STYLES */
/* ========================= */

const navBtn = {
  padding:"8px 15px",
  border:"1px solid gray",
  borderRadius:"5px",
  background:"#fff",
  cursor:"pointer"
};

const smallBtn = {
  padding:"6px 12px",
  border:"none",
  borderRadius:"5px",
  background:"#333",
  color:"white",
  cursor:"pointer"
};

const pageBtn = {
  padding:"8px 14px",
  border:"1px solid gray",
  borderRadius:"5px",
  background:"white",
  cursor:"pointer",
  fontWeight:"bold"
};