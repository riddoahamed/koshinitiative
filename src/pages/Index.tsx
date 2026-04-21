import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import WhyItMatters from "@/components/WhyItMatters";
import ForStudents from "@/components/ForStudents";
import GetInvolvedClients from "@/components/GetInvolvedClients";
import GetInvolvedContributors from "@/components/GetInvolvedContributors";
import GetInvolvedForm from "@/components/GetInvolvedForm";
import Community from "@/components/Community";
import DigitalWaitlist from "@/components/DigitalWaitlist";
import FreeTools from "@/components/FreeTools";
import FreeResources from "@/components/FreeResources";
import CommunityCTA from "@/components/CommunityCTA";
import Footer from "@/components/Footer";
import Diagnostic from "@/components/Diagnostic";
import FloatingPopup from "@/components/FloatingPopup";

const Index = () => {
  return (
    <main className="scroll-smooth">
      <Navbar />
      <Hero />
      <WhatWeDo />
      <WhyItMatters />
      <Diagnostic />
      <ForStudents />
      <GetInvolvedClients />
      <GetInvolvedContributors />
      <GetInvolvedForm />
      <Community />
      <DigitalWaitlist />
      <FreeTools />
      <FreeResources />
      <CommunityCTA />
      <Footer />
      <FloatingPopup />
    </main>
  );
};

export default Index;
