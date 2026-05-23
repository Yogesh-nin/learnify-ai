"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useRef } from "react";

function Provider({ children }) {
  const { user, isLoaded } = useUser();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user?.id || syncedRef.current) return;

    const syncKey = `clerk-user-synced:${user.id}`;
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(syncKey)) {
      return;
    }

    syncedRef.current = true;

    axios
      .post("/api/create-user", { user })
      .then(() => {
        sessionStorage.setItem(syncKey, "1");
      })
      .catch((err) => {
        console.error("Failed to sync user:", err);
        syncedRef.current = false;
      });
  }, [isLoaded, user]);

  return <>{children}</>;
}

export default Provider;
