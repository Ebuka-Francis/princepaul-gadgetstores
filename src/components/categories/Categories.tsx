import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "smartphones",
    name: "Smartphones",
    shortName: "Phones",
    count: "120+ products",
    image: "/phones.jpg",
    href: "/category/Smartphones & Tablets",
  },
  {
    id: "laptops",
    name: "Laptops",
    shortName: "Laptops",
    count: "80+ products",
    image: "/laptops.jpg",
    href: "/category/laptops",
  },
  {
    id: "gaming",
    name: "Gaming Consoles",
    shortName: "Consoles",
    count: "50+ products",
    image: "/gaming-console.jpg",
    href: "/category/gaming",
  },
  {
    id: "accessories",
    name: "Accessories",
    shortName: "Accessories",
    count: "200+ products",
    image: "/Accessories.jpg",
    href: "/category/accessories",
  },
  {
    id: "smart-gadgets",
    name: "Smart Gadgets",
    shortName: "Gadgets",
    count: "150+ products",
    image: "/smart-gadgets.jpg",
    href: "/category/smart-gadgets",
  },
  // {
  //   id: "other-devices",
  //   name: "Other Devices",
  //   shortName: "Others",
  //   count: "100+ products",
  //   image: "/other-devices.jpg",
  //   href: "/category/other-devices",
  // },
];

export default function CategorySection() {
  return (
    <section className="w-full my-6 lg:my-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
          Shop By Category
        </h2>
        <Link
          href="/category"
          className="text-xs lg:text-sm font-semibold text-primary hover:underline transition-all flex items-center gap-1"
        >
          {/* "View all" on Mobile, "View all categories ->" on Desktop */}
          {/* <span className="md:hidden">View all</span>
          <span className="hidden md:inline">View all categories</span> */}
          {/* <ArrowRight size={14} className="hidden md:inline lg:w-4 lg:h-4" /> */}
        </Link>
      </div>

      {/* Mobile View (< md): 5 Circular Category Avatars */}
      <div className="flex md:hidden items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1 px-0.5">
        {categories.slice(0, 5).map((category) => (
          <Link
            key={`category/${category.id}`}
            href={category.href}
            className="flex flex-col items-center gap-2 shrink-0"
          >
            {/* Circle Wrapper */}
            <div className="relative w-[62px] h-[62px] xs:w-16 xs:h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center p-2.5 shadow-2xs">
              <Image
                src={category.image}
                alt={category.name}
                width={50}
                height={50}
                className="object-contain w-full h-full"
              />
            </div>

            {/* Label */}
            <span className="text-[12px] font-bold text-gray-900 text-center leading-none">
              {category.shortName}
            </span>
          </Link>
        ))}
      </div>

      {/* Desktop View (>= md): 6-Column Card Grid */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="flex items-center gap-3 p-3 bg-slate-50/80 hover:bg-white rounded-xl border border-slate-200/60 hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
          >
            {/* Category Image */}
            <div className="relative w-12 h-12 lg:w-14 lg:h-14 shrink-0 flex items-center justify-center">
              <Image
                src={category.image}
                alt={category.name}
                width={50}
                height={50}
                className="object-contain w-auto h-auto max-h-12 group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Category Info */}
            <div className="flex flex-col min-w-0">
              <h3 className="text-xs lg:text-[13px] font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <span className="text-[10px] lg:text-[11px] text-gray-500 font-medium">
                {category.count}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}