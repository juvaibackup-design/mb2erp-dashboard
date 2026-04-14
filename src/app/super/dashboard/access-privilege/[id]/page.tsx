import CreateAccessPage from "../CreateAccessPage";

export default function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { roleName?: string };
}) {
  return (
    <CreateAccessPage
      roleId={Number(params.id)}
      roleName={searchParams.roleName}
    />
  );
}
