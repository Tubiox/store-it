import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { FilesProvider } from "@/contexts/FilesContext";
import { Suspense } from "react";

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: "StoreIt",
  description: "StoreIt - The only storage solution you need.",
};

function LoadingFallback() {
  return <div className="animate-pulse h-screen bg-neutral-50" />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-poppins antialiased`}
      >
        <Suspense fallback={<LoadingFallback />}>
          <FilesProvider>
            {children}
          </FilesProvider>
        </Suspense>
      </body>
    </html>
  );
}
