"use client";

import { useEffect, useRef } from "react";
import { mountRaceliaApp } from "@/js/index";
import "@/styles/racelia.css";
import "@/styles/footer.css";
import "@/styles/raceliaStyle.css";
import "@/styles/account.css";
import "@/styles/categoryPage.css";
import "@/styles/blogsPage.css";
import "@/styles/productDetail.css";
import "@/styles/dashboard.css";
import "@/styles/dashboard-theme.css";
import "@/styles/shoppingBag.css";
import "@/styles/shoppingBag-theme.css";
import "@/styles/wishlist.css";
import "@/styles/checkout.css";

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || mountedRef.current) return;
    mountedRef.current = true;
    mountRaceliaApp(el);
  }, []);

  return (
    <div
      ref={rootRef}
      id="racelia-app"
      style={{ minHeight: "100vh", width: "100%" }}
    />
  );
}
