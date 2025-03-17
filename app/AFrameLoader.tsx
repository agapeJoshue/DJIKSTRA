'use client'
import { useEffect } from "react";

export default function AFrameLoader() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("aframe")
        .then(() => console.log("AFrame loaded"))
        .catch(err => console.error("Error loading AFrame:", err));
    }
  }, []);

  return null;
}
