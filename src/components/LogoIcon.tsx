/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface LogoIconProps {
  className?: string;
}

export default function LogoIcon({ className = "h-6 w-6" }: LogoIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer Roof */}
      <path d="M3 10.5L12 3.5L21 10.5" />
      
      {/* House Body */}
      <path d="M5 10.5V20.5C5 21.05 5.45 21.5 6 21.5H18C18.55 21.5 19 21.05 19 20.5V10.5" />
      
      {/* Centered Dollar Sign */}
      <path d="M12 7.5V17.5" strokeWidth="2.2" />
      <path d="M14.5 10H11C10.17 10 9.5 10.67 9.5 11.5C9.5 12.33 10.17 13 11 13H13C13.83 13 14.5 13.67 14.5 14.5C14.5 15.33 13.83 16 13 16H9.5" strokeWidth="2.2" />
    </svg>
  );
}
