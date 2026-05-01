import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import WhyItMatters from "@/components/WhyItMatters";
import ForStudents from "@/components/ForStudents";
import GetInvolvedClients from "@/components/GetInvolvedClients";
import GetInvolvedContributors from "@/components/GetInvolvedContributors";
import ForOrganizations from "@/components/ForOrganizations";
import GetInvolvedForm from "@/components/GetInvolvedForm";
import ScrollGlow from "@/components/ScrollGlow";
import ScrollProgress from "@/components/ScrollProgress";
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
      <ScrollGlow />
      <Navbar />
      <ScrollProgress />
      <Hero />
      <WhatWeDo />
      <WhyItMatters />
      <Diagnostic />
      <ForStudents />
      <GetInvolvedClients />
      <ForOrganizations />
      <GetInvolvedContributors />
      <GetInvolvedForm />
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
