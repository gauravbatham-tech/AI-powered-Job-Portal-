'use client';

import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <div className="pt-20">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

