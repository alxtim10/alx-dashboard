import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/sidebar-context";
import { Sidebar } from "@/components/sidebar";
import { Poppins, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });



export const metadata: Metadata = {
  title: "CMS Dashboard",
  description: "Modern content management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(poppins.className, "font-sans", geist.variable)}>
      <body className="antialiased font-sans">
        <SidebarProvider>
          <div className="flex overflow-hidden bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              {children}
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
