import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiGrid, FiPackage, FiUsers, FiLogOut } from "react-icons/fi";
import supabase from "../lib/supabase";

function getProfile(user) {
  const metadata = user?.user_metadata || {};
  const emailName = user?.email?.split("@")[0]?.replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const name = metadata.full_name || metadata.name || metadata.display_name || [metadata.first_name, metadata.last_name].filter(Boolean).join(" ") || emailName || "Administrator";
  const rawAvatar = metadata.avatar_url || metadata.picture || metadata.profile_image || metadata.avatar;
  let avatarUrl = "";
  try {
    if (rawAvatar && new URL(rawAvatar).protocol === "https:") avatarUrl = rawAvatar;
  } catch {}
  return { name: String(name).includes("@") ? emailName || "Administrator" : String(name), avatarUrl };
}

export default function AdminShell({ children }) {
  const router = useRouter();
  const current = router.pathname;
  const [profile, setProfile] = useState({ name: "Administrator", avatarUrl: "" });
  const [avatarFailed, setAvatarFailed] = useState(false);

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

  useEffect(() => {
    let active = true;
    const applyUser = (user) => {
      if (!active) return;
      setProfile(getProfile(user));
      setAvatarFailed(false);
    };
    supabase.auth.getUser().then(({ data }) => applyUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => applyUser(session?.user));
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }
  const links = [
    ["/admin/dashboard", "Overview", <FiGrid key="grid" />],
    ["/admin/add-item", "Add item", <FiPackage key="package" />],
    ["/admin/owners", "Owners", <FiUsers key="users" />],
  ];
  const initials = profile.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return <div className="app-shell">
    <aside className="sidebar">
      <Link href="/admin/dashboard" className="brand"><span className="brand-mark">N</span><span><span className="brand-name">TapTrack</span><span className="brand-caption" style={{display:"block"}}>Campus lost &amp; found</span></span></Link>
      <div className="nav-label">WORKSPACE</div>
      <nav>{links.map(([href,label,icon])=><Link key={href} href={href} className={`nav-link ${current===href || (href==="/admin/dashboard" && current.includes("/edit")) ? "active" : ""}`}><span className="nav-icon">{icon}</span>{label}</Link>)}</nav>
      <div className="sidebar-bottom"><div className="profile-row"><div className="avatar profile-avatar">{profile.avatarUrl && !avatarFailed ? <img src={profile.avatarUrl} alt={`${profile.name} profile`} onError={() => setAvatarFailed(true)} /> : initials}</div><div className="profile-copy"><div className="profile-name" title={profile.name}>{profile.name}</div><div className="profile-role">Administrator</div></div></div></div>
    </aside>
    <main className="main-panel"><header className="topbar"><div className="crumb">Workspace <span style={{padding:"0 7px",color:"#c3ccc6"}}>/</span> {current.includes("owners")?"Owners":current.includes("add-item")?"Add item":current.includes("edit")?"Edit item":"Overview"}</div><div className="top-actions"><span className="top-date">NFC item management</span><button className="button button-quiet button-small" onClick={signOut}><FiLogOut /> Sign out</button></div></header>{children}</main>
  </div>;
}
