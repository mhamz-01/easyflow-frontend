import { DocsHeader } from "./header";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DocsHeader />
      <div>{children}</div>
    </>
  );
}
