import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ReduxProvider } from "@/components/ReduxProvider";
import MobileNav from "@/components/MobileNav";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "MAZLIS NEWS | Independent Investigative Journalism",
    description:
        "A weekly publication dedicated to the intersection of architecture, technology, and political philosophy. Focusing on the systems that define our reality.",
    keywords: ["Journalism", "Technology", "Infrastructure", "Political Philosophy", "Mazlis News"],
    authors: [{ name: "Mazlis Editorial Team" }],
    openGraph: {
        title: "MAZLIS NEWS | Independent Investigative Journalism",
        description: "Focusing on the systems that define our reality.",
        type: "website",
        url: "https://news.mazlis.com",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ReduxProvider>
                        {children}
                        <MobileNav />
                    </ReduxProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
