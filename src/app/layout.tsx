import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Latest Pulse Writer",
  description: "Agentic newsroom assistant for newsletter and blog workflows"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
          {children}
        </div>
      </body>
    </html>
  );
}
