import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { CustomCursor } from "@/components/ui/custom-cursor"; // 👈 Import here
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Uppuluri Parameswari | Scientific Visualist & Frontend Designer",
  description: "Portfolio of Uppuluri Parameswari",
  icons: {
  icon: [
    { url: "/logo.png", sizes: "32x32", type: "image/png" },
    { url: "/logo.png", sizes: "48x48", type: "image/png" },
  ],
  shortcut: "/logo.png",
  apple: [
    { url: "/logo.png", sizes: "180x180", type: "image/png" },
  ],
},
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF9" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0B0E" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth snap-y snap-proximity overflow-x-hidden"
      suppressHydrationWarning
    >
      <body
        className={cn(
          "min-h-screen bg-background text-foreground font-sans transition-colors duration-300 ease-in-out selection:bg-accent-soft selection:text-accent flex flex-col antialiased",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <CustomCursor /> {/* 👈 Rendered here */}
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
