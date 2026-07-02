import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero/Hero";
import howItWorks from "../components/sections/HowItWorks/HowItWorks";
import Benefits from "../components/sections/Benefits/Benefits";
import Business from "../components/sections/Business/Business";
import FAQ from "../components/sections/FAQ/FAQ";
import Contact from "../components/sections/Contact/Contact";
import Footer from "../components/layout/Footer/Footer";

function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <HowItWorks />
            <Benefits />
            <Business />
            <FAQ />
            <Contact />
            <Footer />
        </>
    );
};

export default Home;