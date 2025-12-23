'use client'

import Link from 'next/link'
import { BusinessForm } from '@/components/forms/BusinessForm'

export default function NewBusinessPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/businesses" className="hover:underline">
            Businesses
          </Link>
          <span>/</span>
          <span>New</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Business</h1>
        <p className="text-muted-foreground mt-1">
          Create an entity profile to track AI visibility
        </p>
      </div>

      <BusinessForm />
    </div>
  )
}
