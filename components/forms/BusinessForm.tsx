'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Building2,
  MapPin,
  Phone,
  Globe,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Search,
  CheckCircle,
} from 'lucide-react'

const STEPS = [
  { id: 1, name: 'Basic Info', icon: Building2 },
  { id: 2, name: 'Location', icon: MapPin },
  { id: 3, name: 'Contact', icon: Phone },
  { id: 4, name: 'Services', icon: Briefcase },
]

const INDUSTRIES = [
  { value: 'treuhand', label: 'Treuhand / Accounting' },
  { value: 'legal', label: 'Legal / Notar / Anwalt' },
  { value: 'healthcare', label: 'Healthcare / Medical' },
  { value: 'dental', label: 'Dental / Zahnarzt' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'real_estate', label: 'Real Estate / Immobilien' },
  { value: 'construction', label: 'Construction / Handwerker' },
  { value: 'hospitality', label: 'Hospitality / Restaurant' },
  { value: 'retail', label: 'Retail / Shop' },
  { value: 'other', label: 'Other' },
]

const SWISS_CANTONS = [
  { value: 'ZH', label: 'Zürich' },
  { value: 'BE', label: 'Bern' },
  { value: 'LU', label: 'Luzern' },
  { value: 'UR', label: 'Uri' },
  { value: 'SZ', label: 'Schwyz' },
  { value: 'OW', label: 'Obwalden' },
  { value: 'NW', label: 'Nidwalden' },
  { value: 'GL', label: 'Glarus' },
  { value: 'ZG', label: 'Zug' },
  { value: 'FR', label: 'Fribourg' },
  { value: 'SO', label: 'Solothurn' },
  { value: 'BS', label: 'Basel-Stadt' },
  { value: 'BL', label: 'Basel-Landschaft' },
  { value: 'SH', label: 'Schaffhausen' },
  { value: 'AR', label: 'Appenzell Ausserrhoden' },
  { value: 'AI', label: 'Appenzell Innerrhoden' },
  { value: 'SG', label: 'St. Gallen' },
  { value: 'GR', label: 'Graubünden' },
  { value: 'AG', label: 'Aargau' },
  { value: 'TG', label: 'Thurgau' },
  { value: 'TI', label: 'Ticino' },
  { value: 'VD', label: 'Vaud' },
  { value: 'VS', label: 'Valais' },
  { value: 'NE', label: 'Neuchâtel' },
  { value: 'GE', label: 'Genève' },
  { value: 'JU', label: 'Jura' },
]

interface FormData {
  name: string
  uid: string
  industry: string
  description: string
  addressStreet: string
  addressCity: string
  addressPostal: string
  addressCanton: string
  phone: string
  email: string
  website: string
  services: string[]
}

export function BusinessForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    uid: '',
    industry: '',
    description: '',
    addressStreet: '',
    addressCity: '',
    addressPostal: '',
    addressCanton: '',
    phone: '',
    email: '',
    website: '',
    services: [],
  })
  const [serviceInput, setServiceInput] = useState('')

  const progress = (step / STEPS.length) * 100

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleUIDLookup = async () => {
    if (!formData.uid) return

    setIsLookingUp(true)
    // TODO: Implement Zefix API lookup
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLookingUp(false)
  }

  const addService = () => {
    if (serviceInput.trim() && !formData.services.includes(serviceInput.trim())) {
      updateField('services', [...formData.services, serviceInput.trim()])
      setServiceInput('')
    }
  }

  const removeService = (service: string) => {
    updateField('services', formData.services.filter(s => s !== service))
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const business = await response.json()
        router.push(`/dashboard/businesses/${business.id}`)
      } else {
        // Handle error
        console.error('Failed to create business')
      }
    } catch (error) {
      console.error('Error creating business:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0 && formData.industry.length > 0
      case 2:
        return formData.addressCity.trim().length > 0
      case 3:
        return true // Contact info is optional
      case 4:
        return true // Services are optional for now
      default:
        return false
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-center gap-2 ${
                s.id === step
                  ? 'text-emerald-400'
                  : s.id < step
                  ? 'text-emerald-400/60'
                  : 'text-slate-500'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  s.id === step
                    ? 'bg-emerald-500 text-white'
                    : s.id < step
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-700 text-slate-500'
                }`}
              >
                {s.id < step ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <s.icon className="h-4 w-4" />
                )}
              </div>
              <span className="hidden sm:block text-sm font-medium">{s.name}</span>
              {i < STEPS.length - 1 && (
                <div className="hidden sm:block w-12 h-0.5 bg-slate-700 mx-2" />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} />
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Tell us about your business. This information will be used to build your entity profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Brigger Treuhand GmbH"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uid">Swiss UID (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="uid"
                  placeholder="CHE-xxx.xxx.xxx"
                  value={formData.uid}
                  onChange={(e) => updateField('uid', e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUIDLookup}
                  disabled={!formData.uid || isLookingUp}
                >
                  {isLookingUp ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Enter your UID to auto-fill company details from the Swiss registry
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => updateField('industry', e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select an industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <textarea
                id="description"
                placeholder="Brief description of what your business does..."
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                className="flex w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Business Location</CardTitle>
            <CardDescription>
              Where is your business located? This helps AI assistants provide accurate recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="addressStreet">Street Address</Label>
              <Input
                id="addressStreet"
                placeholder="e.g., Bahnhofstrasse 42"
                value={formData.addressStreet}
                onChange={(e) => updateField('addressStreet', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="addressPostal">Postal Code</Label>
                <Input
                  id="addressPostal"
                  placeholder="e.g., 8001"
                  value={formData.addressPostal}
                  onChange={(e) => updateField('addressPostal', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressCity">City *</Label>
                <Input
                  id="addressCity"
                  placeholder="e.g., Zürich"
                  value={formData.addressCity}
                  onChange={(e) => updateField('addressCity', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressCanton">Canton</Label>
              <select
                id="addressCanton"
                value={formData.addressCanton}
                onChange={(e) => updateField('addressCanton', e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select a canton</option>
                {SWISS_CANTONS.map((canton) => (
                  <option key={canton.value} value={canton.value}>
                    {canton.label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Contact */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              How can customers reach you? Consistent contact info across the web is crucial for AI visibility.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., +41 44 123 45 67"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., info@company.ch"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-600 bg-slate-700 text-slate-400 text-sm">
                  https://
                </span>
                <Input
                  id="website"
                  placeholder="www.company.ch"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  className="rounded-l-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Services */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Services Offered</CardTitle>
            <CardDescription>
              What services does your business provide? These help AI understand what you do.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Add Services</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Buchhaltung, Steuererklärung, Beratung"
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addService()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addService}>
                  Add
                </Button>
              </div>
            </div>

            {formData.services.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.services.map((service) => (
                  <span
                    key={service}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/20"
                  >
                    {service}
                    <button
                      type="button"
                      onClick={() => removeService(service)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-medium text-white mb-2">Common services for {formData.industry || 'your industry'}:</h4>
              <div className="flex flex-wrap gap-2">
                {formData.industry === 'treuhand' && (
                  <>
                    {['Buchhaltung', 'Steuererklärung', 'Lohnbuchhaltung', 'Revision', 'Unternehmensberatung'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          if (!formData.services.includes(s)) {
                            updateField('services', [...formData.services, s])
                          }
                        }}
                        className="px-2 py-1 rounded bg-slate-700 text-slate-300 text-sm hover:bg-slate-600"
                      >
                        + {s}
                      </button>
                    ))}
                  </>
                )}
                {formData.industry === 'legal' && (
                  <>
                    {['Vertragsrecht', 'Gesellschaftsrecht', 'Erbrecht', 'Immobilienrecht', 'Beglaubigung'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          if (!formData.services.includes(s)) {
                            updateField('services', [...formData.services, s])
                          }
                        }}
                        className="px-2 py-1 rounded bg-slate-700 text-slate-300 text-sm hover:bg-slate-600"
                      >
                        + {s}
                      </button>
                    ))}
                  </>
                )}
                {!formData.industry && (
                  <span className="text-slate-500 text-sm">Select an industry to see suggestions</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {step < STEPS.length ? (
          <Button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Business
                <CheckCircle className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
