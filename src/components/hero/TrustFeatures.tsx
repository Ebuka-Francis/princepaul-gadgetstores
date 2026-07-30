import { ShieldCheck, Truck, CreditCard, RefreshCw, Headphones } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Original",
    subtitle: "Products",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "Nationwide",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    subtitle: "Guaranteed",
  },
  {
    icon: RefreshCw,
    title: "7 Days Return",
    subtitle: "Easy Return",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "We're here to help",
    hideOnMobile: true, // Show 4 items on mobile to match screenshot perfectly, 5 on desktop
  },
];

export default function TrustFeatures() {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 lg:py-5 lg:px-6 my-4 lg:my-6">
      {/* Mobile: 4-column grid with vertical dividers | Desktop: 5-column grid */}
      <div className="grid grid-cols-4 lg:grid-cols-5 divide-x divide-gray-100">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center justify-center text-center lg:text-left gap-1.5 lg:gap-3 px-1 sm:px-2 lg:px-4 ${
                feature.hideOnMobile ? "hidden lg:flex" : "flex"
              }`}
            >
              {/* Icon Container */}
              <div className="flex items-center justify-center shrink-0 text-primary">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" strokeWidth={1.75} />
              </div>

              {/* Text Block */}
              <div className="flex flex-col items-center lg:items-start">
                <h4 className="text-[11px] sm:text-xs lg:text-[13px] font-bold text-gray-900 leading-tight">
                  {feature.title}
                </h4>
                <p className="text-[9px] sm:text-[10px] lg:text-[11px] text-gray-500 mt-0.5 font-medium leading-tight">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}