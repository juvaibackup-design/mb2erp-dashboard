import PackageForm from "../PackageForm";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const id = params?.id;

  const isCreate = id === "create";

  return (
    <PackageForm
      type={isCreate ? "create" : "edit"}
      packageId={isCreate ? undefined : Number(id)}
    />
  );
}
