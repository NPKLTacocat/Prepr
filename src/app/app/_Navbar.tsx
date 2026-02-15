"use client";

import { useClerk } from "@clerk/nextjs";
import { BrainCircuitIcon, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { UserAvatar } from "@/components/UserAvatar";

export function Navbar({ user }: { user: { name: string; imageUrl: string } }) {
  const { openUserProfile, signOut } = useClerk();

  return (
    <nav className="h-header flex items-center justify-between border-b p-4">
      <Link href={"/app"} className="flex items-center gap-2">
        <BrainCircuitIcon className="size-6 text-primary" />
        <span className="text-lg font-semibold">Prepr</span>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
              <UserAvatar user={user} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openUserProfile()}>
              <User className="mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              <LogOut className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
