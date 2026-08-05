export default function WarrantyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6 text-gray-700 text-xs leading-relaxed">
        <h1 className="text-2xl font-extrabold text-gray-900">Warranty Policy</h1>
        <p>Every gadget purchased comes with dedicated protection:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Manufacturer Warranty:</strong> Covers factory defects and hardware malfunctions for up to 1 year (depending on the brand).</li>
          <li><strong>Exclusions:</strong> Physical damage caused by drops, water immersion, unauthorized repairs, or power surges are not covered.</li>
          <li><strong>Claim Support:</strong> Contact our support team with your receipt and order reference to initiate a warranty evaluation.</li>
        </ul>
      </div>
    </div>
  );
}