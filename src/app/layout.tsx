import "./globals.css";

export const metadata = {
    title: "New Project",
    description: "Fresh start",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
