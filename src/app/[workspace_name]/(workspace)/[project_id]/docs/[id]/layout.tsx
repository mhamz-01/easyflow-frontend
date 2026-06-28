import fs from "fs";
import path from "path";

export default function DocEditorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const css = fs.readFileSync(
    path.join(process.cwd(), "public", "easyflow-editor.css"),
    "utf-8",
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {children}
    </>
  );
}
