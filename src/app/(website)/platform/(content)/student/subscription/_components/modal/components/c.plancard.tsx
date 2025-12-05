"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlanCard({ tier, plan, isSelected, isCurrent, onSelect }) {
  const Icon = plan.icon;

  return (
    <Card
      onClick={onSelect}
      className={cn(
        "relative cursor-pointer transition-all duration-300 border-2",
        isSelected
          ? `${plan.borderColor} ${plan.glowColor} shadow-2xl`
          : "border-muted hover:shadow-lg hover:scale-[1.02]"
      )}
    >
      {/* BADGES */}
      {plan.popular && !isCurrent && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          Most Popular
        </Badge>
      )}

      {plan.premium && !isCurrent && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
          Premium
        </Badge>
      )}

      {isCurrent && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white border-0">
          Current Plan
        </Badge>
      )}

      <CardHeader className="text-center pb-4">
        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.color} mb-4`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
        <p className="text-muted-foreground text-sm">{plan.description}</p>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {plan.features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
