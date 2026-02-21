import type { Metadata } from "next";
import { Bebas_Neue, Poppins } from "next/font/google";
import "./globals.css";
import QueryClientProviderWrapper from "@/components/QueryClientProviderWrapper";
import { AuthProvider } from "@/context/authContext";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VFC Franchise System",
  description: "Savor the best fried chicken in town!",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const refreshToken = cookieStore.get("refreshToken");

  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${poppins.variable} antialiased`}
      >
        <AuthProvider initialAccessToken={accessToken?.value || null} initialRefreshToken={refreshToken?.value || null}>
          <QueryClientProviderWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors position="top-center" />
            </ThemeProvider>
          </QueryClientProviderWrapper>
        </AuthProvider>


      </body>
    </html>
  );
}