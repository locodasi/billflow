export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <div style={{ width: "250px", backgroundColor: "red", padding: "20px", height: "100%" }}>

            </div>
            <main style={{ flex: 1, overflow: "auto" }}>
                {children}
            </main>
        </div>
    );
}