import {
  ShieldCheck,
  Truck,
  Lock,
  ShoppingBag,
  Headphones,
  RefreshCw,
} from "lucide-react";

// Mobile View Features (2x2 Cards)
const mobileFeatures = [
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    subtitle: "Genuine products only",
  },
  {
    icon: Truck,
    title: "Fast & Reliable",
    subtitle: "Delivery nationwide",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    subtitle: "Multiple secure options",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    subtitle: "Hassle-free returns",
  },
];

// Desktop View Features (5 Columns Horizontal Bar)
const desktopFeatures = [
  {
    icon: ShieldCheck,
    title: "Trust You Can Count On",
    subtitle: "We deliver only original and quality gadgets.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    subtitle: "Fast and reliable delivery to your doorstep.",
  },
  {
    icon: ShieldCheck, // or custom badge icon
    title: "Secure & Flexible Payments",
    subtitle: "Pay how you want, 100% secure.",
  },
  {
    icon: ShoppingBag,
    title: "Huge Variety",
    subtitle: "Top brands, latest models, best prices.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    subtitle: "We're always here to help you.",
  },
];

export default function FooterBanner() {
  return (
    <div className="w-full bg-primary text-white py-6 px-4 lg:py-6 lg:px-8 border-t border-blue-900/40">
      <div className="max-w-7xl mx-auto">
        
        {/* --- MOBILE VIEW (< lg): 2x2 Rounded Dark Blue Grid --- */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          {mobileFeatures.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="bg-[#0b2265]/60 rounded-2xl p-4 border border-blue-400/20 flex items-center gap-3"
              >
                {/* Icon */}
                <div className="shrink-0 text-white">
                  <Icon className="w-7 h-7 stroke-[1.75]" />
                </div>

                {/* Text */}
                <div className="flex flex-col">
                  <h4 className="text-xs sm:text-sm font-bold leading-snug text-white">
                    {feature.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-blue-200/80 mt-0.5 leading-tight font-medium">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- DESKTOP VIEW (>= lg): 5 Item Single Horizontal Bar --- */}
        <div className="hidden lg:flex items-center justify-between gap-4">
          {desktopFeatures.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="flex items-center gap-3.5 flex-1 justify-center px-2"
              >
                {/* Icon Container */}
                <div className="shrink-0 text-white p-2 rounded-full border border-blue-400/30 bg-blue-900/20">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>

                {/* Text Block */}
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold leading-tight text-white">
                    {feature.title}
                  </h4>
                  <p className="text-[11px] text-blue-200/70 mt-1 leading-tight font-normal max-w-[180px]">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}