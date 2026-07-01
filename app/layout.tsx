import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Muhenga Sport",
    template: "%s | Muhenga Sport",
  },
  description: "Premium live sports streaming, match schedules, favorites, and HLS playback.",
  applicationName: "Muhenga Sport",
};

export const viewport: Viewport = {
  themeColor: "#00C853",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="pb-16 pt-5 sm:pt-8">{children}</main>
      </body>
    </html>
  );
}


if (typeof window !== "undefined") {
  const stopHijack = (e) => {
    e.stopImmediatePropagation();
  };

  document.addEventListener("click", stopHijack, true);
}
