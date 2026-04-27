/**
 * CATALYST - Phone Input
 *
 * Phone number input with a country picker that always emits an E.164
 * formatted string (e.g. "+971501234567"). E.164 is required by AgentCRM's
 * dedup logic — local-format numbers (e.g. "0501234567") will fail to match.
 */

"use client"

import * as React from "react"
import PhoneInputBase, { type Country } from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { cn } from "@/lib/utils"
import "./phone-input.css"

export interface PhoneInputProps {
  id?: string
  value?: string
  onChange: (value: string | undefined) => void
  defaultCountry?: Country
  placeholder?: string
  error?: boolean
  className?: string
  autoFocus?: boolean
  autoComplete?: string
  "aria-invalid"?: boolean
  "aria-describedby"?: string
  "aria-required"?: boolean
}

export function PhoneInput({
  className,
  error,
  defaultCountry = "AE",
  ...props
}: PhoneInputProps) {
  return (
    <PhoneInputBase
      {...props}
      defaultCountry={defaultCountry}
      international
      countryCallingCodeEditable={false}
      data-slot="phone-input"
      className={cn(
        "ui-phone-input",
        error && "ui-phone-input--error",
        className,
      )}
    />
  )
}

export { isValidPhoneNumber } from "react-phone-number-input"
