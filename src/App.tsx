import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ToolPlaceholder from "./pages/ToolPlaceholder.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/scam-spotter"
            element={
              <ToolPlaceholder
                title="Scam Spotter"
                description="6 real BD scenarios. Spot scams - halal forex, bKash Ponzis, Telegram crypto - before they spot you."
              />
            }
          />
          <Route
            path="/comparator"
            element={
              <ToolPlaceholder
                title="Savings Comparator"
                description="FDR vs Sanchaypatra vs DPS vs savings - after-tax returns with inflation benchmark."
              />
            }
          />
          <Route
            path="/emi-calculator"
            element={
              <ToolPlaceholder
                title="EMI Calculator"
                description="Bank loans or credit card EMI - iPhone, bike, PC. Monthly payment + total interest before you borrow."
              />
            }
          />
          <Route
            path="/sip-calculator"
            element={
              <ToolPlaceholder
                title="Goal-based SIP"
                description="Studies abroad, wedding, car down payment - exact monthly savings needed to hit your goal."
              />
            }
          />
          <Route
            path="/car-calculator"
            element={
              <ToolPlaceholder
                title="Car Affordability"
                description="EMI + fuel + insurance + maintenance. See the real monthly cost and 5-year ownership bill before buying."
              />
            }
          />
          <Route
            path="/budget-planner"
            element={
              <ToolPlaceholder
                title="Budget Planner"
                description="50% Needs · 30% Wants · 20% Savings. BD-specific categories - see your real savings rate."
              />
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
