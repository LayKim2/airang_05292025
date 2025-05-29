import * as React from "react"
import { cn } from "@/app/lib/utils"

const TrendCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/90",
      className
    )}
    {...props}
  />
))
TrendCard.displayName = "TrendCard"

const TrendCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
))
TrendCardContent.displayName = "TrendCardContent"

const TrendCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between mb-4", className)}
    {...props}
  />
))
TrendCardHeader.displayName = "TrendCardHeader"

const TrendCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300",
      className
    )}
    {...props}
  />
))
TrendCardTitle.displayName = "TrendCardTitle"

const TrendCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-gray-600 text-sm line-clamp-3", className)}
    {...props}
  />
))
TrendCardDescription.displayName = "TrendCardDescription"

const TrendCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between pt-4 border-t border-gray-100", className)}
    {...props}
  />
))
TrendCardFooter.displayName = "TrendCardFooter"

export {
  TrendCard,
  TrendCardContent,
  TrendCardHeader,
  TrendCardTitle,
  TrendCardDescription,
  TrendCardFooter,
} 