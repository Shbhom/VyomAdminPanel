"use client"

import { useSearchParams } from "next/navigation"
import { useClient } from "@/hooks/useClient"
// Import View type to ensure consistency
import { View } from "@/types/types"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { SummaryDashboard } from "@/components/clientDashboard/SummaryDashboard"
import { Configuration } from "@/components/clientDashboard/Configuration"
import { MissionUploader } from "@/components/clientDashboard/MissionUploader"
import { FileGallery } from "@/components/clientDashboard/FileGallery" // Add this import

export default function ClientPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const {
    client,droneAssignments,loading,currentView,setCurrentView,refreshClientData
  } = useClient(id, {initialView: 'summary',redirectOnError: true})
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }
  
  return (
    <div className="flex min-h-screen">
      <Sidebar 
        className="w-64" 
        clientName={client?.name || ''}
        onNavigate={(view) => setCurrentView(view)}
        currentView={currentView}
      />
      
      <div className="flex-1 p-4">
        {currentView === 'summary' && (
          <SummaryDashboard 
            client={client} 
            droneAssignments={droneAssignments} 
          />
        )}
        
        {currentView === 'config' && (
          <Configuration  
            clientId={client?.id || ''} 
            vm_ip={client?.vm_ip || ''}
            vm_password={client?.vm_password || null}
            onUpdate={refreshClientData}
          />
        )}
        
        {currentView === 'missions' && (
          <div className="space-y-8">
            <MissionUploader clientId={client?.id || ''} />
            <FileGallery clientId={client?.id || ''} />
          </div>
        )}
      </div>
    </div>
  )
}

