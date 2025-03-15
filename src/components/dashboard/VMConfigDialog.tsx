"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateClientVMIP } from "@/app/action"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface VMConfigDialogProps {
  clientId: string
  currentIP?: string | null
  onUpdate: () => Promise<void>
  initialOpen?: boolean
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined
}

export function VMConfigDialog({ 
  clientId, 
  currentIP, 
  onUpdate,
  initialOpen = false,
  buttonVariant = "default" 
}: VMConfigDialogProps) {
  const [open, setOpen] = useState(initialOpen)
  const [vmIp, setVmIp] = useState(currentIP || '')
  const [vmPassword, setVmPassword] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vmIp) {
      toast.error("VM IP address is required")
      return
    }

    setIsUpdating(true)

    try {
      const result = await updateClientVMIP(clientId, vmIp)
      if (result.success) {
        await onUpdate()
        toast.success("VM settings updated")
        setOpen(false)
      } else {
        throw new Error(result.message || "Failed to update VM IP")
      }
    } catch (error) {
      console.error("Error updating VM settings:", error)
      toast.error("Failed to update VM settings")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size="sm">
          {currentIP ? "Update VM Settings" : "Configure VM"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentIP ? "Update VM Settings" : "Configure VM"}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="vm_ip">VM IP Address</Label>
            <Input 
              id="vm_ip"
              value={vmIp}
              onChange={(e) => setVmIp(e.target.value)}
              placeholder="192.168.1.100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vm_password">VM Password (Optional)</Label>
            <Input 
              id="vm_password"
              type="password"
              value={vmPassword}
              onChange={(e) => setVmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Save VM Settings</span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}