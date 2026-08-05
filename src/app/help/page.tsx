import Navbar from "@/features/homepage/Navbar";
import Footer from "@/components/footer/Footer";


export default function HelpCenterPage() {
  const faqs = [
    { q: "Are all your gadgets 100% original?", a: "Yes! We source directly from authorized manufacturers and reputable distributors, ensuring every smartphone, laptop, and accessory is 100% genuine and brand new." },
    { q: "How long does delivery take?", a: "Standard delivery takes 1–3 business days within Lagos, and 3–5 business days for other states across Nigeria." },
    { q: "What payment methods do you accept?", a: "We accept online payments via Paystack (Debit/Credit Cards, Bank Transfer, USSD) as well as direct orders via WhatsApp." },
    { q: "Do items come with a warranty?", a: "Yes, all our electronics come with a standard manufacturer or store warranty ranging from 3 months to 1 year." },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-6 font-sans">
    
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Help Center & FAQs</h1>
          <p className="text-xs text-gray-500 mt-1">Find quick answers to common questions about shopping with us.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-2">
              <h3 className="text-sm font-bold text-gray-900">{faq.q}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
   
    </div>
  );
}