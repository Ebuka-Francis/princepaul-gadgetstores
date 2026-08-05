export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6 text-gray-700 text-xs leading-relaxed">
        <h1 className="text-2xl font-extrabold text-gray-900">Shipping & Delivery</h1>
        <p>We offer reliable nationwide delivery across Nigeria.</p>
        <h3 className="text-sm font-bold text-gray-900 mt-4">Delivery Timelines:</h3>
        <p><strong>Lagos Deliveries:</strong> 1 to 3 business days.</p>
        <p><strong>Interstate Deliveries:</strong> 3 to 5 business days handled via trusted logistics partners.</p>
        <p>Shipping fees are calculated at checkout based on your delivery address location.</p>
      </div>
    </div>
  );
}