import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "default" | "white"; // color scheme
  size?: "sm" | "md" | "lg"; // size variations
  showText?: boolean; // whether to show text next to logo
  className?: string;
  href?: string;
  isWithinLink?: boolean; // new prop to indicate if the Logo is already within a Link
}

export function Logo({
  variant = "default",
  size = "md",
  showText = true,
  className,
  href = "/",
  isWithinLink = false
}: LogoProps) {
  // Size mapping for the image
  const sizeValues = {
    sm: { width: 80, height: 30 },
    md: { width: 100, height: 40 },
    lg: { width: 120, height: 50 },
  };
  
  const dimensions = sizeValues[size];
  
  const LogoContent = (
    <div className="flex items-center">
      <Image 
        src="/img/LOGO.png" 
        alt="JobFit.AI Logo" 
        width={dimensions.width} 
        height={dimensions.height}
        className="object-contain"
      />
    </div>
  );
  
  // If we're within a link already or no href is provided, just return the content
  if (isWithinLink || !href) {
    return <div className={cn("inline-flex", className)}>{LogoContent}</div>;
  }
  
  // Otherwise, wrap in a Link
  return (
    <Link href={href} className={cn("inline-flex", className)}>
      {LogoContent}
    </Link>
  );
} 