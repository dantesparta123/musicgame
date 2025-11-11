import React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GameButton({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <Button
      className={cn(
        "text-xl px-8 py-6 rounded-xl font-bold shadow-lg",
        "hover:shadow-xl transition-all",
        className
      )}
      size="lg"
      {...props}
    >
      {children}
    </Button>
  );
} 