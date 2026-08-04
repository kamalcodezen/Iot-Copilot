import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/features/landing/components/Hero';
import Statistics from '@/features/landing/components/Statistics';
import Features from '@/features/landing/components/Features';
import HowItWorks from '@/features/landing/components/HowItWorks';
import Benefits from '@/features/landing/components/Benefits';
import AIFeatures from '@/features/landing/components/AIFeatures';
import IoTSection from '@/features/landing/components/IoTSection';
import Solutions from '@/features/landing/components/Solutions';
import Industries from '@/features/landing/components/Industries';
import PopularProjects from '@/features/landing/components/PopularProjects';
import RoadmapPreview from '@/features/landing/components/RoadmapPreview';
import Testimonials from '@/features/landing/components/Testimonials';
import FAQ from '@/features/landing/components/FAQ';
import CTA from '@/features/landing/components/CTA';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <Statistics />
        <Features />
        <HowItWorks />
        <Benefits />
        <AIFeatures />
        <IoTSection />
        <Solutions />
        <Industries />
        <PopularProjects />
        <RoadmapPreview />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
