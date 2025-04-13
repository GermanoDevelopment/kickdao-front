export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
    );
}
