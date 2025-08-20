"use client";

import { useState, useEffect } from "react";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "auto" });
};

export function useScrollToTop() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 400px
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { showScrollTop, scrollToTop };
}
