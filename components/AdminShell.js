import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiGrid, FiPackage, FiUsers, FiLogOut } from "react-icons/fi";
import supabase from "../lib/supabase";

export default function AdminShell({ children }) {
  const router = useRouter();
  const current = router.pathname;
  useEffect(() => {
    let timeout;
    const reset = () => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        await supabase.auth.signOut();
        window.alert("Your session expired. Please sign in again.");
        router.push("/login");
      }, 15 * 60 * 1000);
    };
    ["mousemove", "keydown", "click"].forEach((event) => window.addEventListener(event, reset));
    reset();
    return () => {
      clearTimeout(timeout);
      ["mousemove", "keydown", "click"].forEach((event) => window.removeEventListener(event, reset));
    };
  }, [router]);
  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }
  const links = [
    ["/admin/dashboard", "Overview", <FiGrid key="grid" />],
    ["/admin/add-item", "Add item", <FiPackage key="package" />],
    ["/admin/owners", "Owners", <FiUsers key="users" />],
  ];
  return <div className="app-shell">
    <aside className="sidebar">
      <Link href="/admin/dashboard" className="brand"><span className="brand-mark">N</span><span><span className="brand-name">TapTrack</span><span className="brand-caption" style={{display:"block"}}>Campus lost &amp; found</span></span></Link>
      <div className="nav-label">WORKSPACE</div>
      <nav>{links.map(([href,label,icon])=><Link key={href} href={href} className={`nav-link ${current===href || (href==="/admin/dashboard" && current.includes("/edit")) ? "active" : ""}`}><span className="nav-icon">{icon}</span>{label}</Link>)}</nav>
      <div className="sidebar-bottom"><div className="profile-row"><div className="avatar">AD</div><div><div className="profile-name">Administrator</div><div className="profile-role">TapTrack workspace</div></div></div></div>
    </aside>
    <main className="main-panel"><header className="topbar"><div className="crumb">Workspace <span style={{padding:"0 7px",color:"#c3ccc6"}}>/</span> {current.includes("owners")?"Owners":current.includes("add-item")?"Add item":current.includes("edit")?"Edit item":"Overview"}</div><div className="top-actions"><span className="top-date">NFC item management</span><button className="button button-quiet button-small" onClick={signOut}><FiLogOut /> Sign out</button></div></header>{children}</main>
  </div>;
}
