import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rate Your Day",
  description: "Rate each day from 1 to 5 and see your days in color.",
  applicationName: "Rate Your Day",
  appleWebApp: { capable: true, title: "Rate Your Day", statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#121211" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Nav />
          <main className="mx-auto w-full max-w-4xl px-4 pt-4 pb-28 sm:pt-6 sm:pb-12">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
