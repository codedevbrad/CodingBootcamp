"use client";

import CartoonCard from "@/components/custom/cartoonCard";

export default function BlockExplainedPage() {
  return (
    <CartoonCard label="Blocks Overview" title="What Are Blocks?">

      <div className="space-y-4 text-gray-700 text-[14px] leading-[1.7]">
        <p>
          Blocks are modular components used to build and customize your
          application. They let you plug in advanced functionality without
          needing tons of complex code.
        </p>

        <p>
          Each block serves a specific purpose — displaying data, handling user
          input, fetching APIs, automating workflows. Combine them to build
          bigger features, dashboards, or entire pages.
        </p>
      </div>
    </CartoonCard>
  );
}
