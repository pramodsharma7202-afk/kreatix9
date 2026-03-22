import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Kreatix9',
  description: 'Find answers to the most commonly asked questions about Kreatix9 — shipping, returns, authentication, and more.',
};

const faqs = [
  {
    question: "How do I know the products are authentic?",
    answer: "Every product on Kreatix9 is sourced directly from authorized distributors or the brand itself. We conduct thorough verification processes for each listing before it goes live."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards (Visa, Mastercard, Amex), and payments are securely processed via Stripe. Your financial data is never stored on our servers."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard domestic shipping takes 3–5 business days. International shipping typically takes 7–14 business days. All orders come with complimentary tracking."
  },
  {
    question: "Can I return or exchange a product?",
    answer: "Yes. We offer a 30-day return window from the date of delivery. Items must be unworn and in original packaging. Please initiate a return from your dashboard."
  },
  {
    question: "How do I become a seller on Kreatix9?",
    answer: "Register for a seller account and submit your application. Our team reviews each seller application within 2–3 business days. Only brands meeting our quality standards are approved to list."
  },
  {
    question: "Is my personal data safe?",
    answer: "Absolutely. We adhere to GDPR and industry-standard data protection practices. Your personal information is encrypted and never shared with third parties without your consent."
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-10 pb-32">
      <div className="container mx-auto px-4 max-w-3xl py-16">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500 mb-4">Support</p>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.1em] mb-4">Frequently Asked</h1>
          <p className="text-neutral-500 font-light">Everything you need to know about Kreatix9.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/30">
              <summary className="flex justify-between items-center px-6 py-5 cursor-pointer list-none hover:bg-neutral-800/30 transition-colors">
                <span className="font-medium tracking-wide text-white">{faq.question}</span>
                <span className="ml-4 text-neutral-500 group-open:rotate-45 transition-transform duration-300 text-2xl leading-none shrink-0">+</span>
              </summary>
              <div className="px-6 pb-6 text-neutral-400 font-light leading-relaxed text-sm border-t border-neutral-800 pt-4">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: { '@type': 'Answer', text: faq.answer },
              })),
            }),
          }}
        />
      </div>
    </div>
  );
}
