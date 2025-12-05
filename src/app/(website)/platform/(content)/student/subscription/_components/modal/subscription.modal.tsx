"use client";

import { useEffect, useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; 
import { Badge } from "@/components/ui/badge"; 
import { plans } from "../plans";
import { PlanCard } from "./components/c.plancard";
import { PurchaseControls } from "./components/c.purchaseControls";

import { useCurrentUserState } from "@/app/auth/session/auth.client.getUser";

import {
  startFreeTierAction,
  purchaseBasicAction,
  getMySubscription,
} from "../../../../db/db.subscription/db.subscription";
import { CustomButton } from "@/components/custom/buttons/button";


export function SubscriptionModalStudent () {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState("BASIC");

  const [current, setCurrent] = useState(null);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  // Load current plan on mount
  useEffect(() => {
    refresh();
  }, []);
  
  async function refresh() {

    const sub = await getMySubscription();
    setCurrent(sub);
  }

  const isAlreadyOnSelected = current?.tier === selectedTier;

  const triggerText = current?.status === "ACTIVE"
    ? `${current.tier} Subscription`
    : "Choose a Plan";

 

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <CustomButton Text={triggerText} />
      </DialogTrigger>

      <DialogContent className="!w-[80vw] !max-w-[80vw] !h-[80vh] p-0 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 rounded-t-lg">
          <DialogHeader className="text-center text-white">
            <DialogTitle className="text-4xl font-bold mb-2">
              Choose Your Learning Journey
            </DialogTitle>

            {current ? (
              <Badge className="bg-black/30 text-white border-0">
                Current: {current.tier}
              </Badge>
            ) : (
              <p className="text-sm text-white/80 mt-2">No active plan</p>
            )}
          </DialogHeader>
        </div>

        {/* BODY */}
        <div className="p-8 flex-1 overflow-y-auto">
          {/* Plans */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-8">
            {Object.entries(plans).map(([tier, plan]) => (
              <PlanCard
                key={tier}
                tier={tier}
                plan={plan}
                isSelected={selectedTier === tier}
                isCurrent={current?.tier === tier}
                onSelect={() => setSelectedTier(tier)}
              />
            ))}
          </div>

          {/* Purchase */}
          <PurchaseControls
            selectedTier={selectedTier}
            isAlreadyOnSelected={isAlreadyOnSelected}
            onActivateFree={() =>
              startTransition(async () => {
                await startFreeTierAction();
                await refresh();
                setMsg("Free activated");
              })
            }
            onActivateBasic={() =>
              startTransition(async () => {
                await purchaseBasicAction();
                await refresh();
                setMsg("Basic activated");
              })
            }
          />

          {/* Messages */}
          {msg && <p className="text-center text-green-600 text-sm">{msg}</p>}
          {err && <p className="text-center text-red-600 text-sm">{err}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

 

export default function SubscriptionModal() {
  const { isAuthenticated } = useCurrentUserState();
  if (!isAuthenticated) {
    return null;
  }
  return <SubscriptionModalStudent />;
}
