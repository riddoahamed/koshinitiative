const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const LinktreeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.511 5.853l4.005-4.117 2.325 2.381-4.201 4.005h5.909v3.305h-5.937l4.229 4.108-2.325 2.334-5.741-5.769-5.741 5.769-2.325-2.325 4.229-4.108H2.451V8.122h5.909L4.159 4.117l2.325-2.381 4.005 4.117V0h3.022v5.853zM10.49 16.27h3.022v7.73H10.49v-7.73z" />
  </svg>
);

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/kosh.initiative/",
  linkedin: "https://www.linkedin.com/company/kosh-%E0%A6%95%E0%A7%8B%E0%A6%B7/",
  linktree: "https://linktr.ee/KoshFLI",
};

interface SocialLinksProps {
  className?: string;
}

const SocialLinks = ({ className = "" }: SocialLinksProps) => (
  <div className={`flex gap-5 ${className}`}>
    <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-kosh-mint transition-colors" aria-label="Instagram">
      <InstagramIcon />
    </a>
    <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-kosh-mint transition-colors" aria-label="LinkedIn">
      <LinkedInIcon />
    </a>
    <a href={SOCIAL_LINKS.linktree} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-kosh-mint transition-colors" aria-label="Linktree">
      <LinktreeIcon />
    </a>
  </div>
);

export default SocialLinks;
