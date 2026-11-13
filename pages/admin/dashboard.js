import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { FiPackage, FiUsers, FiAlertCircle, FiCheckCircle, FiSearch, FiLink, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import supabase from "../../lib/supabase";
import AdminShell from "../../components/AdminShell";

const PAGE_SIZE = 10;
function badge(status="") { return `status-pill status-${status.toLowerCase()}`; }

export default function Dashboard() {
  const router=useRouter();
  const [items,setItems]=useState([]);
  const [owners,setOwners]=useState([]);
  const [search,setSearch]=useState("");
  const [page,setPage]=useState(1);
  const [selected,setSelected]=useState(null);
  const [copied,setCopied]=useState(false);

  useEffect(()=>{ (async()=>{const {data:{user}}=await supabase.auth.getUser();
  if(!user){
    router.push("/login");
    return;
  }
    const [ir,or]=await Promise.all([supabase.from("Items_Table").select("*"),supabase.from("Owners_Table").select("student_id")]);
      setItems(ir.data||[]);
      setOwners(or.data||[]);
    })();
  },[router]);

  const filtered=useMemo(()=>items.filter(i=>[i.item_name,i.item_code,i.owner_id].some(v=>String(v||"").toLowerCase().includes(search.toLowerCase()))),[items,search]);
  const pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));
  const visible=filtered.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);

  async function deleteItem(code){
    if(!window.confirm(`Delete item ${code}?`))return;
    const {error}=await supabase.from("Items_Table").delete().eq("item_code",code);
    if(error){window.alert("Could not delete the item. Please try again.");
      return;
    }
    const {data:{user}}=await supabase.auth.getUser();await supabase.from("Logs_Table").insert([{action:"Deleted Item",item_code:code,admin_email:user?.email}]);
    setItems(rows=>rows.filter(i=>i.item_code!==code));
  }

  async function copyLink(){
    try {await navigator.clipboard.writeText(`${window.location.origin}/item/${selected.item_code}`);
    setCopied(true);
    setTimeout(()=>setCopied(false),1800);
    } catch {
      window.alert("Could not copy the link. Please copy it manually.");
    }
  }

  const lost=items.filter(i=>i.status==="Lost").length, found=items.filter(i=>i.status==="Found").length;

  return<AdminShell>
    <span className="brand-mark brand-icon">
      <img src="/taptrack-icon.svg" alt="" />
    </span>
    <div className="page-content">
      <div className="page-heading">
        <div>
          <div className="eyebrow">Good day, administrator</div>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">A clear view of registered belongings and their current status.</p>
        </div>
        <button className="button button-primary" onClick={()=>router.push("/admin/add-item")}><FiPlus/> Register an item</button>
      </div>
      <div className="stats-grid">
        {[ ["Registered items",items.length,<FiPackage key="items"/> ,"Across all item statuses"],["Known owners",owners.length,<FiUsers key="owners"/>,"In the owner directory"],["Reported lost",lost,<FiAlertCircle key="lost"/>,"Items needing attention"],["Marked found",found,<FiCheckCircle key="found"/>,"Items already recovered"] ].map(([label,value,icon,note])=>
        <div className="stat-card" key={label}>
          <div className="stat-top">
            <span>{label}</span>
            <span className="stat-icon">{icon}</span>
          </div>
          <div className="stat-value">{value}</div>
          <div className="stat-note">{note}</div>
          </div>
        )}
      </div>
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Item directory</h2>
            <p className="panel-description">Search records, update status, or open the NFC link for a tag.</p>
          </div>
          <div className="toolbar">
            <div className="search-box">
              <FiSearch className="search-symbol"/>
              <input aria-label="Search items" placeholder="Search name, code, or owner ID" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
            </div>
          </div>
        </div>
        <div className="panel-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Item code</th>
                <th>Owner ID</th>
                <th>Status</th>
                <th style={{textAlign:"right"}}>Actions</th>
              </tr>
            </thead>
            <tbody>{visible.map(item=>
              <tr key={item.item_code}>
                <td>
                  <span className="item-name">{item.item_name||"Unnamed item"}</span>
                  <span className="cell-sub">Registered item</span>
                </td>
                <td className="mono">{item.item_code}</td>
                <td className="mono">{item.owner_id||"—"}</td>
                <td><span className={badge(item.status)}>{item.status||"Unknown"}</span></td>
                <td>
                  <div className="actions">
                    <button className="button button-small" title="Edit item" onClick={()=>router.push(`/admin/edit/${item.item_code}`)}>
                      <FiEdit2/> Edit
                    </button>
                    <button className="button button-small" title="NFC link" onClick={()=>setSelected(item)}>
                      <FiLink/> NFC link
                    </button>
                    <button className="button button-small button-danger" title="Delete item" onClick={()=>deleteItem(item.item_code)}>
                      <FiTrash2/>
                    </button>
                  </div>
                </td>
              </tr>)}
            </tbody>
          </table>{visible.length===0&&
          <div className="table-empty">
            {items.length?"No items match your search.":"No items have been registered yet. Add your first item to get started."}
          </div>}
        </div>

        {filtered.length>0&&<div className="pagination">
          <span>
            Showing {Math.min(filtered.length,(page-1)*PAGE_SIZE+1)}–{Math.min(page*PAGE_SIZE,filtered.length)} of {filtered.length} items
          </span>
          <div className="page-numbers">
            <button disabled={page===1} onClick={()=>setPage(page-1)}>
              Previous
            </button>
            <button className="current">{page} / {pages}</button>
            <button disabled={page===pages} onClick={()=>setPage(page+1)}>Next</button>
          </div>
        </div>}
      </section>
      {selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}>
        <section className="modal" onClick={e=>e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <div className="eyebrow">Tag destination</div>
              <h2>NFC link</h2>
            </div>
            <button className="modal-close" onClick={()=>setSelected(null)} aria-label="Close">×</button>
          </div>
          <p className="page-subtitle">Write this link to the NFC tag for <strong>{selected.item_name}</strong>.</p>
          <div className="link-field">{typeof window!=="undefined"?window.location.origin:""}/item/{selected.item_code}</div>
          <div className="form-actions" style={{border:0,margin:0,padding:0}}>
            <button className="button" onClick={()=>setSelected(null)}>Close</button>
            <button className="button button-primary" onClick={copyLink}>
              <FiLink/>
              {copied?"Copied":"Copy link"}
            </button>
          </div>
        </section>
      </div>}
    </div>
  </AdminShell>;
}
