'use client'

import { useState } from 'react'

interface FaqItem {
  q: string
  a: string
}

interface FaqAccordionProps {
  questions: FaqItem[]
}

export default function FaqAccordion({ questions }: FaqAccordionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {questions.map((faq, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
            className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">{faq.q}</h3>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96' : 'max-h-0'}`}>
            <p className="px-6 pb-5 text-gray-600 leading-relaxed">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
