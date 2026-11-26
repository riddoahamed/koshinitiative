import PageShell from "@/v2/PageShell";
import { Problem, Impact } from "@/v2/Sections";
import { Orgs, Vision, Founder, Join } from "@/v2/Closing";
import { Mission } from "@/v2/Refresh";
import "@/v2/v2.css";

/* Everything about the company, moved off the homepage in the Nov 2026 cut.
   Ids are kept (#story, #inclusion, #join) so old anchors still land. */
const About = () => (
  <PageShell path="/about" backTo="/">
    <Founder />
    <Mission story={false} />
    <Problem />
    <Impact />
    <Vision />
    <Orgs />
    <Join />
  </PageShell>
);

export default About;
