const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const LinktreeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.953 15.066l-.038-4.18-4.86 3.212 1.308-2.18L.025 9.7l4.363-.07L2.29 5.363l2.36 1.236L6.713 2.27l2.063 4.32L11.14 5.3l-2.1 4.273 4.34.07-4.337 2.216 1.313 2.18-4.86-3.212-.038 4.18h-2.51l.005.06zm8.086 0l-.037-4.18-4.86 3.212 1.307-2.18-4.337-2.218 4.363-.07-2.098-4.267 2.36 1.236L14.8 2.27l2.063 4.32L19.226 5.3l-2.098 4.273 4.338.07-4.337 2.216 1.313 2.18-4.86-3.212-.038 4.18h-2.505v.06z" />
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
  <div className={`flex gap-4 ${className}`}>
    <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-kosh-mint transition-colors" aria-label="Instagram">
      <InstagramIcon />
    </a>
    <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-kosh-mint transition-colors" aria-label="LinkedIn">
      <LinkedInIcon />
    </a>
    <a href={SOCIAL_LINKS.linktree} target="_blank" rel="noopener noreferrer" className="text-white hover:text-kosh-mint transition-colors" aria-label="Linktree">
      <LinktreeIcon />
    </a>
  </div>
);

export default SocialLinks;
