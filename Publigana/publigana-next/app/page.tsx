import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import CampaignDistribution from "./components/landing/CampaignDistribution";
import HowItWorks from "./components/landing/HowItWorks";
import Benefits from "./components/landing/Benefits";
import SocialNetworks from "./components/landing/SocialNetworks";
import Contact from "./components/landing/Contact";
import Footer from "./components/landing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0F0626] text-[#F6F1E7]">
      <Navbar />
      <Hero />
      <CampaignDistribution />
      <HowItWorks />
      <Benefits />
      <SocialNetworks />
      <Contact />
      <Footer />
    </main>
  );
}