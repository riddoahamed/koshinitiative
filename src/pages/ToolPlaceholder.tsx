import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Wrench } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { applySeo } from "@/lib/seo";

interface ToolPlaceholderProps {
  title: string;
  description: string;
}

const ToolPlaceholder = ({ title, description }: ToolPlaceholderProps) => {
  useEffect(() => {
    applySeo({
      title,
      description,
      path: window.location.pathname,
      robots: "noindex, follow",
    });
  }, [title, description]);

  return (
    <main className="min-h-screen bg-kosh-offwhite flex flex-col">
      <Navbar />
      <section className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="max-w-xl text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-kosh-teal/10 mb-6">
            <Wrench className="text-kosh-teal" size={26} />
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-kosh-dark mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-kosh-muted text-base md:text-lg font-sans leading-relaxed mb-8">
            {description}
          </p>
          <p className="text-kosh-muted text-sm font-mono mb-10">
            We're building this tool. Check back soon.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-kosh-teal text-white font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default ToolPlaceholder;
