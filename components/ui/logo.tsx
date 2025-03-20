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
  // Size mapping
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };
  
  // Color mapping
  const colorClasses = {
    default: {
      logo: "text-lime-300",
      text: "text-black",
      highlight: "text-lime-300",
    },
    white: {
      logo: "text-white",
      text: "text-white",
      highlight: "text-lime-300",
    },
  };
  
  const logoColors = colorClasses[variant];
  const logoSize = sizeClasses[size];
  
  const LogoContent = (
    <div className="flex items-center gap-1">
      <div className={cn("font-bold", logoSize, logoColors.logo)}>J</div>
      {showText && (
        <div className={cn("font-medium", logoColors.text, {
          "text-base": size === "sm",
          "text-xl": size === "md",
          "text-2xl": size === "lg",
        })}>
          <span>Job</span>
          <span className={cn("font-bold", logoColors.highlight)}>Fit</span>
          <span className={cn("text-xs align-top", logoColors.text)}>.AI</span>
        </div>
      )}
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