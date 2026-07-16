import { BrandLogo } from "@/components/brand-logo";

type HeaderProps = {
  branchName?: string;
};

export function Header({ branchName }: HeaderProps) {
  return (
    <header className="space-y-5 text-center">
      <BrandLogo className="mx-auto" />

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a47b17]">
          Mwangiz Beauty Parlor
        </p>
        <h1 className="text-3xl font-semibold leading-tight text-[#2b1836] sm:text-4xl">
          Welcome to Mwangiz Beauty Parlor
        </h1>
        {branchName ? (
          <p className="mx-auto inline-flex rounded-full bg-[#fff3c6] px-4 py-2 text-sm font-semibold text-[#5f3c14]">
            {branchName}
          </p>
        ) : null}
        <p className="mx-auto max-w-sm text-base leading-7 text-[#6f6077]">
          Thank you for visiting us today.
        </p>
        <p className="mx-auto max-w-sm text-sm leading-6 text-[#766a7c]">
          Your feedback helps us improve our services and create an even better
          experience every time you visit.
        </p>
      </div>
    </header>
  );
}
