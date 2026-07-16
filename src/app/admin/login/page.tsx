import { AdminLoginCard } from "@/components/admin/admin-login-card";

type AdminLoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const denied = params.denied === "1";

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6">
      <AdminLoginCard accessDenied={denied} />
    </div>
  );
}
