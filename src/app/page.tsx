import { BrandLogo } from "@/components/brand-logo";

export default function Home() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6">
      <section className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/88 px-6 py-9 text-center shadow-[0_24px_80px_rgba(61,28,82,0.14)] backdrop-blur">
        <BrandLogo className="mx-auto mb-6 size-24" imageClassName="size-20" />
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a47b17]">
          Mwangiz Beauty Parlor
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[#2b1836]">
          Branch link required
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#766a7c]">
          Please scan the QR code at your branch so we know which location you
          are rating.
        </p>
      </section>
    </main>
  );
}
