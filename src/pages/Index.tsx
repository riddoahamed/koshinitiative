import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import FounderSection from "@/components/FounderSection";
import ProofBand from "@/components/ProofBand";
import WhyItMatters from "@/components/WhyItMatters";
import ForStudents from "@/components/ForStudents";
import GetInvolvedClients from "@/components/GetInvolvedClients";
import GetInvolvedContributors from "@/components/GetInvolvedContributors";
import ForOrganizations from "@/components/ForOrganizations";
import ScrollGlow from "@/components/ScrollGlow";
import DigitalWaitlist from "@/components/DigitalWaitlist";
import FreeTools from "@/components/FreeTools";
import FreeResources from "@/components/FreeResources";
import CommunityCTA from "@/components/CommunityCTA";
import Footer from "@/components/Footer";
import Diagnostic from "@/components/Diagnostic";
import FloatingPopup from "@/components/FloatingPopup";
import { resetSeo } from "@/lib/seo";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    resetSeo();

    window.history.scrollRestoration = "manual";
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, []);

  return (
    <main className="scroll-smooth">
      <ScrollGlow />
      <Navbar />
      <Hero />
      <WhatWeDo />
      <ProofBand />
      <WhyItMatters />
      <Diagnostic />
      <DigitalWaitlist />
      <GetInvolvedClients />
      <ForOrganizations />
      <ForStudents />
      <FounderSection />
      <GetInvolvedContributors />
      <FreeTools />
      <FreeResources />
      <CommunityCTA />
      <Footer />
      <FloatingPopup />
    </main>
  );
};

export default Index;
