
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import AppPromoSection from "@/components/landing/AppPromoSection";
import MenuSection from "@/components/landing/MenuSection";
import OpenHoursSection from "@/components/landing/OpenHoursSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212] text-white font-sans selection:bg-red-500 selection:text-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <AppPromoSection />
      <MenuSection />
      <OpenHoursSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
