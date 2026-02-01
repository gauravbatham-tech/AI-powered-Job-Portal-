import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "RecruitX",
  description: "AI Powered Job Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
