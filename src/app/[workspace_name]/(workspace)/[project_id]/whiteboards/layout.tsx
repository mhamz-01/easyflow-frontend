import { WhiteboardHeader } from "./header";

export default function WhiteboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <WhiteboardHeader />
            <div>{children}</div>
        </>
    );
}