type HeaderProps = {
  branchName?: string;
};

export function Header({ branchName }: HeaderProps) {
  return (
    <header className="space-y-5 text-center">
      <div
        aria-label="Mwangiz Beauty Parlor logo placeholder"
        className="mx-auto grid size-20 place-items-center rounded-[2rem] border border-[#e8d7a3] bg-[#fff8e8] shadow-[0_18px_45px_rgba(98,55,131,0.12)]"
      >
        <div className="grid size-14 place-items-center rounded-2xl bg-[#6d3a8f] text-2xl font-bold text-[#ffd875]">
          M
        </div>
      </div>

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
