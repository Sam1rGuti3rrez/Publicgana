import Navbar from "../components/layouts/Navbar/Navbar";
import Hero from "../components/sections/Hero/Hero";
import CampaignDistribution from "../components/sections/CampaignDistribution/CampaignDistribution";
import HowItWorks from "../components/sections/HowItWorks/HowItWorks";
import Benefits from "../components/sections/Benefits/Benefits";

function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <CampaignDistribution />
            <HowItWorks />
            <Benefits />
        </>
    );
}

export default Home;