import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";

export function BackLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className={cn("-ml-3", className)}
    >
      <Link href={href}>
        <ArrowLeftIcon /> {children}
      </Link>
    </Button>
  );
}
