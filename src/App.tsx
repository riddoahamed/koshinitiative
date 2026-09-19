import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index.tsx";

/* ── ONE ROUTE SHOULD NOT PAY FOR ALL OF THEM ────────────────────────────────

   Every page used to be a static import, so opening the homepage downloaded
   the 61-bank rate tables, the quiz scenes, the live-room game, the blog and
   every bank profile before it could paint: one 811 kB bundle for a page that
   needs a fraction of it.

   Index stays eager on purpose. It is the most-hit route and the one whose
   paint we care about, so putting it behind a lazy boundary would only add a
   round trip to the critical path. Everything else loads when it is asked
   for. */
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Vote = lazy(() => import("./pages/Vote.tsx"));
const Start = lazy(() => import("./pages/Start.tsx"));
const Learn = lazy(() => import("./pages/Learn.tsx"));
const InvestKorsi = lazy(() => import("./pages/InvestKorsi"));
const Quiz = lazy(() => import("./pages/Quiz.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const Post = lazy(() => import("./pages/Post.tsx"));
const Feedback = lazy(() => import("./pages/Feedback.tsx"));
const Submit = lazy(() => import("./pages/Submit.tsx"));
const ForOrganizations = lazy(() => import("./pages/ForOrganizations.tsx"));
const FdrRates = lazy(() => import("./pages/FdrRates.tsx"));
const FdrFaq = lazy(() => import("./pages/FdrFaq.tsx"));
const FdrBank = lazy(() => import("./pages/FdrBank.tsx"));

/* ── FOUR PROVIDERS THAT WRAPPED NOTHING ─────────────────────────────────────

   The scaffold this project started from ships a QueryClientProvider, two
   toasters and a TooltipProvider at the root. Nothing here has ever called
   useQuery, toast() or rendered a <Tooltip>: they were pure weight on the
   critical path of every page, and react-query alone is a large dependency to
   carry for zero queries. If any of them is needed later, it can come back at
   the point of use rather than around the whole app. */
const App = () => (
  <BrowserRouter>
        {/* The fallback is deliberately the page background and nothing else.
            A spinner that flashes for 80ms on a fast connection is worse than
            a beat of the colour the page is about to be. */}
        <Suspense fallback={<div className="route-wait" aria-hidden="true" />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/live" element={<Vote />} />
          {/* the beginner path */}
          <Route path="/start" element={<Start />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/investkorsi" element={<InvestKorsi />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/investor-type" element={<Quiz />} />
          {/* programmes for schools, campuses, factory floors and offices */}
          <Route path="/for-organizations" element={<ForOrganizations />} />
          <Route path="/for-schools" element={<ForOrganizations />} />
          {/* the rate table — what every bank pays on a fixed deposit */}
          <Route path="/fdr-rates" element={<FdrRates />} />
          {/* Bangla lives at its own URL so it can be linked, shared and
              indexed. Same component, same data, different dictionary. */}
          <Route path="/bn/fdr-rates" element={<FdrRates />} />
          <Route path="/bn/investkorsi" element={<InvestKorsi />} />
          <Route path="/fdr-rates/faq" element={<FdrFaq />} />
          {/* One page per bank. A model that cites /fdr-rates/brac sends a
              real person there afterwards; without this route they would land
              on a 404, which is worse than never being cited. */}
          <Route path="/fdr-rates/:slug" element={<FdrBank />} />
          <Route path="/fdr" element={<FdrRates />} />
          <Route path="/bank-rates" element={<FdrRates />} />
          {/* writing */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/submit" element={<Submit />} />
          <Route path="/blog/:slug" element={<Post />} />
          <Route path="/feedback" element={<Feedback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
  </BrowserRouter>
);

export default App;
