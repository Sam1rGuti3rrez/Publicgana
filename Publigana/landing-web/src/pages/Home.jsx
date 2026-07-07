import Navbar from "../components/layouts/Navbar/Navbar";
import Hero from "../components/sections/Hero/Hero";
import CampaignDistribution from "../components/sections/CampaignDistribution/CampaignDistribution";

function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <CampaignDistribution />
        </>
    );
}

export default Home;