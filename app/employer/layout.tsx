"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ClientFallback } from "./page";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [redirectFailed, setRedirectFailed] = useState(false);
  
  // Only apply this loading logic to the root employer path
  const isRootEmployerPath = pathname === "/employer";
  
  useEffect(() => {
    if (!isRootEmployerPath) {
      setIsLoading(false);
      return;
    }
    
    // If we're still on the root employer path after 1 second,
    // show the client fallback (server redirect might have failed)
    const timer = setTimeout(() => {
      setRedirectFailed(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isRootEmployerPath]);
  
  // Only for the root employer path
  if (isRootEmployerPath && redirectFailed) {
    return <ClientFallback />;
  }
  
  return children;
} 