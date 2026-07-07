import Navbar from "../components/layouts/Navbar/Navbar";
import Hero from "../components/sections/Hero/Hero";
import CampaignDistribution from "../components/sections/CampaignDistribution/CampaignDistribution";
import HowItWorks from "../components/sections/HowItWorks/HowItWorks";
import Benefits from "../components/sections/Benefits/Benefits";
import SocialNetworks from "../components/sections/SocialNetworks/SocialNetworks";
import Contact from "../components/sections/Contact/Contact";
import Footer from "../components/layouts/Footer/Footer";

function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <CampaignDistribution />
            <HowItWorks />
            <Benefits />
            <SocialNetworks />
            <Contact />
            <Footer />
        </>
    );
}

export default Home;