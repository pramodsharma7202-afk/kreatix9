"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { User, LogOut, Package, Heart, MapPin, Settings } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-neutral-800 animate-pulse" />
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    return (
      <Link href="/login" className="hover:text-neutral-400 transition-colors">
        <User className="w-5 h-5" />
      </Link>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition focus:outline-none focus:ring-2 focus:ring-white/20">
          <span className="text-sm font-medium">
            {session.user.name?.[0]?.toUpperCase() || "U"}
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-neutral-900 border border-neutral-800 rounded-md p-1 shadow-xl z-50 text-neutral-200 text-sm"
          sideOffset={8}
          align="end"
        >
          <div className="px-3 py-2 border-b border-neutral-800 mb-1">
            <p className="font-medium text-white truncate text-[15px]">{session.user.name}</p>
            <p className="text-xs text-neutral-400 truncate mt-0.5">{session.user.email}</p>
          </div>

          {(session.user as any).role === "admin" && (
            <DropdownMenu.Item asChild>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer rounded-sm hover:bg-neutral-800 focus:bg-neutral-800"
              >
                <Settings className="w-4 h-4 text-emerald-400" />
                <span className="text-white">Admin Dashboard</span>
              </Link>
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer rounded-sm hover:bg-neutral-800 focus:bg-neutral-800"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard?tab=orders"
              className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer rounded-sm hover:bg-neutral-800 focus:bg-neutral-800"
            >
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard?tab=wishlist"
              className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer rounded-sm hover:bg-neutral-800 focus:bg-neutral-800"
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard?tab=addresses"
              className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer rounded-sm hover:bg-neutral-800 focus:bg-neutral-800"
            >
              <MapPin className="w-4 h-4" />
              <span>Addresses</span>
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-neutral-800 my-1" />

          <DropdownMenu.Item
            onSelect={(e) => {
              e.preventDefault();
              signOut({ callbackUrl: "/" });
            }}
            className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer rounded-sm hover:bg-neutral-800 focus:bg-neutral-800 text-red-400 hover:text-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
