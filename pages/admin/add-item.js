import {useEffect,useState} from "react";
import {useRouter} from "next/router";
import {FiCheckCircle} from "react-icons/fi";
import supabase from "../../lib/supabase";
import AdminShell from "../../components/AdminShell";

export default function AddItem(){
  const router=useRouter();
  const [itemCode,setItemCode]=useState("");
  const [itemName,setItemName]=useState("");
  const [status,setStatus]=useState("Active");
  const [ownerId,setOwnerId]=useState("");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);

  useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();
    if(!user){router.push("/login");return;}const {data,error}=await supabase.from("Items_Table").select("item_code").order("item_code",{ascending:false}).limit(1);
    if(error)
      return;
    const last=parseInt(data?.[0]?.item_code,10);
    setItemCode(Number.isFinite(last)?String(last+1):"1000");})();
  },[router]);

  async function addItem(e){e.preventDefault();
    if(!itemCode||!itemName.trim()||!status||!ownerId.trim()){
      setMessage("Fill in each field before saving.");
      return;
    }setBusy(true);
    const {data:owner,error:ownerError}=await supabase.from("Owners_Table").select("student_id").eq("student_id",ownerId.trim());
    if(ownerError||!owner?.length){setBusy(false);setMessage("Owner student ID was not found. Add the owner first.");
      return;
    }
    const {error}=await supabase.from("Items_Table").insert([{item_code:itemCode,item_name:itemName.trim(),status,owner_id:ownerId.trim()}]);
    setBusy(false);
    if(error){setMessage(error.message||"Could not register this item.");
      return;
    }setMessage("Item registered successfully.");
    setTimeout(()=>router.push("/admin/dashboard"),900);
  }

  return <AdminShell>
    <span className="brand-mark brand-icon">
      <img src="/taptrack-icon.svg" alt="" />
    </span>
    <div className="page-content">
      <div className="page-heading">
        <div>
          <div className="eyebrow">Item directory</div>
          <h1 className="page-title">Register an item</h1>
          <p className="page-subtitle">Create an item record and connect it to an owner.</p>
        </div>
      </div>
      <div className="form-layout">
        <section className="form-card">
          <h2>Item details</h2>
          <p className="form-intro">The item code can be written to an NFC sticker after saving.</p>
          <form onSubmit={addItem}>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="item-code">Item code</label>
                <input id="item-code" value={itemCode} readOnly placeholder="Generating…"/>
                <span className="field-help">Generated from the latest registered code.</span>
              </div>
              <div className="field">
                <label htmlFor="item-name">Item name</label>
                <input id="item-name" value={itemName} onChange={e=>setItemName(e.target.value)} placeholder="e.g. Black wallet"/>
              </div>
              <div className="field">
                <label htmlFor="owner-id">Owner student ID</label>
                <input id="owner-id" value={ownerId} onChange={e=>setOwnerId(e.target.value)} placeholder="e.g. 2024001234"/>
              </div>
              <div className="field">
                <label htmlFor="item-status">Current status</label>
                <select id="item-status" value={status} onChange={e=>setStatus(e.target.value)}>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Lost</option>
                  <option>Found</option>
                </select>
              </div>
            </div>
            {message&&(
              <div className={`notice ${message.startsWith("Fill")||message.startsWith("Owner")||message.startsWith("Could")?"error":""}`} role="status">
                {message}
              </div>
            )}
            <div className="form-actions">
              <button type="button" className="button" onClick={()=>router.push("/admin/dashboard")}>
                Cancel
              </button>
              <button className="button button-primary" disabled={busy||!itemCode}>
                <FiCheckCircle/>
                {busy?"Saving…":"Save item"}
              </button>
            </div>
          </form>
        </section>
        <aside className="info-card">
          <h3>Next step: connect the NFC tag</h3>
          <p>Once saved, open the item directory and select its NFC link. Write that URL to a compatible NFC sticker.</p>
          <ul>
            <li>Make sure the owner is in the directory first.</li>
            <li>Use a unique label for each physical item.</li>
            <li>Update an item&apos;s status when it is lost or returned.</li>
          </ul>
        </aside>
      </div>
    </div>
  </AdminShell>;
}
