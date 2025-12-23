import { Header } from '@/components/dashboard/Header'
import { BusinessForm } from '@/components/forms/BusinessForm'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function NewBusinessPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // Check business limit
  const businessCount = user.businesses?.length || 0
  const limit = user.plan === 'FREE' ? 1 : user.plan === 'STARTER' ? 3 : 10

  if (businessCount >= limit) {
    // TODO: Redirect to upgrade page
    redirect('/dashboard/billing?upgrade=true')
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Add New Business"
        description="Create an entity profile to track AI visibility"
      />

      <div className="p-6">
        <BusinessForm />
      </div>
    </div>
  )
}
