"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SheetContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | undefined>(undefined)

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Sheet({ open: controlledOpen, onOpenChange, children }: SheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const handleOpenChange = onOpenChange || setInternalOpen

  return (
    <SheetContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

interface SheetTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

export function SheetTrigger({ asChild, children }: SheetTriggerProps) {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("SheetTrigger must be used within Sheet")

  const handleClick = () => {
    context.onOpenChange(true)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  }

  return <button onClick={handleClick}>{children}</button>
}

interface SheetContentProps {
  side?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
  children: React.ReactNode
}

export function SheetContent({ side = 'right', className, children }: SheetContentProps) {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("SheetContent must be used within Sheet")

  React.useEffect(() => {
    if (context.open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [context.open])

  if (!context.open) return null

  const sideStyles = {
    right: 'right-0 top-0 h-full animate-in slide-in-from-right',
    left: 'left-0 top-0 h-full animate-in slide-in-from-left',
    top: 'top-0 left-0 w-full animate-in slide-in-from-top',
    bottom: 'bottom-0 left-0 w-full animate-in slide-in-from-bottom'
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={() => context.onOpenChange(false)}
      />
      <div
        className={cn(
          "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
          sideStyles[side],
          className
        )}
      >
        {children}
      </div>
    </>
  )
}

