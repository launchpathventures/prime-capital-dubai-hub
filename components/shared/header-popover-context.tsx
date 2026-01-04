/**
 * CATALYST - Header Popover Context
 *
 * Coordinates header popovers so only one can be open at a time.
 * When one popover opens, others automatically close.
 */

"use client"

import * as React from "react"

type PopoverId = "theme" | "surface" | null

interface HeaderPopoverContextValue {
  activePopover: PopoverId
  setActivePopover: (id: PopoverId) => void
}

const HeaderPopoverContext = React.createContext<HeaderPopoverContextValue | null>(null)

export function HeaderPopoverProvider({ children }: { children: React.ReactNode }) {
  const [activePopover, setActivePopover] = React.useState<PopoverId>(null)

  return (
    <HeaderPopoverContext.Provider value={{ activePopover, setActivePopover }}>
      {children}
    </HeaderPopoverContext.Provider>
  )
}

export function useHeaderPopover(id: Exclude<PopoverId, null>) {
  const context = React.useContext(HeaderPopoverContext)
  
  if (!context) {
    throw new Error("useHeaderPopover must be used within HeaderPopoverProvider")
  }

  return {
    open: context.activePopover === id,
    setOpen: (open: boolean) => context.setActivePopover(open ? id : null),
  }
}
