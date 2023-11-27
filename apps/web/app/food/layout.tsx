import React from "react"
import { notFound } from "next/navigation"
import { auth } from "@/auth"

import { SiteHeader } from "@/components/navigation/site-header"
import { SiteSidebar } from "@/components/navigation/site-sidebar"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    return notFound()
  }

  const { user } = session

  return (
    <div className="grid flex-1 space-y-6 md:container md:grid-cols-[200px_1fr] md:gap-4">
      <SiteHeader />
      <SiteSidebar user={user} />
      <main className="flex w-full flex-1 flex-col overflow-hidden px-6 md:px-2">
        {children}
      </main>
    </div>
  )
}
