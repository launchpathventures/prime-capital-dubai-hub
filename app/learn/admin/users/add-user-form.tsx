/**
 * CATALYST - Add User Form
 * 
 * Dialog form for inviting new users.
 */

"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { UserPlusIcon, XIcon, SendIcon } from "lucide-react"

export function AddUserForm() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/admin/invite-user', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          setIsOpen(false)
          setSuccess(false)
          window.location.reload()
        }, 1500)
      }
    } catch (err) {
      setError('Failed to invite user')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <UserPlusIcon className="h-4 w-4 mr-2" />
        Add User
      </Button>
    )
  }
  
  return (
    <div className="admin-users-modal-backdrop" onClick={() => setIsOpen(false)}>
      <div className="admin-users-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-users-modal__header">
          <h3>Add New User</h3>
          <button onClick={() => setIsOpen(false)} className="admin-users-modal__close">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="admin-users-modal__body">
            <p className="admin-users-modal__intro">
              Create a new user account with the default password: <strong>Prime$1234!</strong>
              <br />
              <span style={{ fontSize: '0.85em', opacity: 0.8 }}>They should change this after their first login.</span>
            </p>
            
            <div className="admin-users-modal__field">
              <label htmlFor="email">Email Address *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                placeholder="user@example.com"
                className="admin-users-modal__input"
              />
            </div>
            
            <div className="admin-users-modal__field">
              <label htmlFor="full_name">Full Name</label>
              <input 
                type="text" 
                id="full_name" 
                name="full_name" 
                placeholder="Enter full name"
                className="admin-users-modal__input"
              />
            </div>
            
            <div className="admin-users-modal__field">
              <label htmlFor="role">Role</label>
              <select 
                id="role" 
                name="role" 
                defaultValue="learner"
                className="admin-users-modal__select"
              >
                <option value="learner">Learner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            {error && (
              <div className="admin-users-modal__error">
                {error}
              </div>
            )}
            
            {success && (
              <div className="admin-users-modal__success">
                User created successfully!
              </div>
            )}
          </div>
          
          <div className="admin-users-modal__footer">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || success}>
              <SendIcon className="h-4 w-4 mr-2" />
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
