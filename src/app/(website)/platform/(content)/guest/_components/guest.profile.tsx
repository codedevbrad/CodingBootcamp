"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomButton } from "@/components/custom/buttons/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { bootcampLoginRedirect } from "@/lib/constants/constant.flows";


export default function GuestProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center gap-3 cursor-pointer bg-gray-100 rounded-md py-1 pr-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage
              src="https://api.dicebear.com/7.x/initials/svg?seed=Guest"
              alt="Guest avatar"
            />
            <AvatarFallback> Guest Account </AvatarFallback>
          </Avatar>

          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold leading-none">Guest</p>
            <p className="text-xs text-muted-foreground">Logged in as Guest</p>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-72 p-3 space-y-3"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="text-sm font-semibold">
          Welcome, Guest 👋
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* CHAT CARD */}
        <Card className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 shadow-sm">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-gray-700 leading-relaxed">
              Create an account to save your learning progress, sync across
              devices, and unlock more features.
            </div>
          </div>
        </Card>

        {/* ACTION BUTTON */}
        <CustomButton
          text="Get Started"
          href={ bootcampLoginRedirect }
          className="w-full justify-center"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
