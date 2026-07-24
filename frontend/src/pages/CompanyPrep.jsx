import { Briefcase } from "lucide-react";

import DashboardLayout from "../app/layouts/DashboardLayout";

const CompanyPrep = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">
          // company prep
        </p>

        <h1 className="mt-2 font-mono text-4xl font-bold">
          Company Prep
        </h1>
      </div>

      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-md border border-dashed border-line bg-panel p-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded border border-amber/40 bg-amber/10 text-amber glow">
          <Briefcase size={26} />
        </span>

        <h2 className="mt-6 font-mono text-2xl font-bold text-ink">
          Coming Soon
        </h2>

        <p className="mt-3 max-w-md text-ink-dim">
          Company-specific interview prep — curated problem sets, and role-based tracks — is on the way.
        </p>

        <p className="mt-6 font-mono text-sm text-ink-faint">
          $ ./company-prep.sh{" "}
          <span className="text-amber">--status</span> building…
          <span className="term-cursor" aria-hidden="true" />
        </p>
      </div>
    </DashboardLayout>
  );
};

export default CompanyPrep;
