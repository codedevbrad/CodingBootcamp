"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

/**
 * Formats a URL segment into a readable label
 * - Replaces hyphens with spaces
 * - Capitalizes first letter of each word
 * - Handles special cases like dynamic routes
 */
function formatSegment(segment: string): string {
  // Handle dynamic routes - show as-is or format if needed
  if (segment.startsWith("[") && segment.endsWith("]")) {
    return segment.slice(1, -1) // Remove brackets, e.g., [slug] -> slug
  }
  
  // Replace hyphens with spaces and capitalize
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Checks if a segment is a route group (wrapped in parentheses)
 * Route groups are not part of the URL and should be filtered out
 */
function isRouteGroup(segment: string): boolean {
  return segment.startsWith("(") && segment.endsWith(")")
}

/**
 * PlatformBreadcrumb component that displays navigation breadcrumbs
 * Shows the full path from /platform to the current page
 */
export default function PlatformBreadcrumb() {
  const pathname = usePathname()
  
  // Only show breadcrumb if we're on a platform route
  if (!pathname?.startsWith("/platform")) {
    return null
  }

  // Split pathname into segments and filter out empty strings
  const segments = pathname.split("/").filter(Boolean)
  
  // Filter out route groups and build breadcrumb items
  const breadcrumbItems: Array<{ href: string; label: string }> = []
  
  // Always start with Platform
  breadcrumbItems.push({ href: "/platform", label: "Platform" })
  
  // Process segments after /platform
  let currentPath = "/platform"
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i]
    
    // Skip route groups
    if (isRouteGroup(segment)) {
      continue
    }
    
    // Build the path up to this segment
    currentPath += `/${segment}`
    
    // Format the label
    const label = formatSegment(segment)
    
    breadcrumbItems.push({ href: currentPath, label })
  }

  // Don't show breadcrumb if we're just on /platform

  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <Breadcrumb className="mb-4 p-5 px-2">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          
          return (
            <React.Fragment key={item.href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild  className="bg-gray-100 p-1.5 px-3 rounded-md">
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

