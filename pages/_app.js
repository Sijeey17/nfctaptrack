import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../app/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const start = () => setIsNavigating(true);
    const finish = () => setIsNavigating(false);
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", finish);
    router.events.on("routeChangeError", finish);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", finish);
      router.events.off("routeChangeError", finish);
    };
  }, [router]);

  return <>
    <Component {...pageProps} />
    {isNavigating && <div className="route-loading" role="status" aria-live="polite"><span className="loading-spinner" /><span>Loading page…</span></div>}
  </>;
}