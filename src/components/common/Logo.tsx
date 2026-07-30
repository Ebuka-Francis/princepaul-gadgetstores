import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex flex-col">
      <h2 className="font-heading text-3xl font-extrabold text-primary">
        PP
      </h2>

      <span className="-mt-1 text-xs font-medium text-muted-foreground">
        PrincePaul Gadgets
      </span>
    </Link>
  );
}