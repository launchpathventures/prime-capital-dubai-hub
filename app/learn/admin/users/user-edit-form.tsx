/**
 * CATALYST - User Edit Form
 * 
 * Dialog form for editing user details.
 */

"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { PencilIcon, XIcon, SaveIcon } from "lucide-react"
import type { UserWithEmail } from "./types"

interface UserEditFormProps {
  user: UserWithEmail
}

export function UserEditForm({ user }: UserEditFormProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      if (result.error) {
        setError(result.error)
      } else {
        setIsOpen(false)
        // Refresh the page to show updated data
        window.location.reload()
      }
    } catch (err) {
      setError('Failed to update user')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (!isOpen) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="h-8 w-8 p-0"
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
    )
  }
  
  return (
    <div className="admin-users-modal-backdrop" onClick={() => setIsOpen(false)}>
      <div className="admin-users-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-users-modal__header">
          <h3>Edit User</h3>
          <button onClick={() => setIsOpen(false)} className="admin-users-modal__close">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="user_id" value={user.id} />
          
          <div className="admin-users-modal__body">
            <div className="admin-users-modal__field">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                value={user.email} 
                disabled 
                className="admin-users-modal__input admin-users-modal__input--disabled"
              />
              <span className="admin-users-modal__hint">Email cannot be changed</span>
            </div>
            
            <div className="admin-users-modal__field">
              <label htmlFor="full_name">Full Name</label>
              <input 
                type="text" 
                id="full_name" 
                name="full_name" 
                defaultValue={user.full_name || ""} 
                placeholder="Enter full name"
                className="admin-users-modal__input"
              />
            </div>
            
            <div className="admin-users-modal__field">
              <label htmlFor="role">Role</label>
              <select 
                id="role" 
                name="role" 
                defaultValue={user.role}
                className="admin-users-modal__select"
              >
                <option value="learner">Learner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="admin-users-modal__field">
              <label htmlFor="certification_status">Certification Status</label>
              <select 
                id="certification_status" 
                name="certification_status" 
                defaultValue={user.certification_status || "in_progress"}
                className="admin-users-modal__select"
              >
                <option value="in_progress">In Progress</option>
                <option value="ready">Ready for Assessment</option>
                <option value="certified">Certified</option>
              </select>
            </div>
            
            {error && (
              <div className="admin-users-modal__error">
                {error}
              </div>
            )}
          </div>
          
          <div className="admin-users-modal__footer">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <SaveIcon className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
