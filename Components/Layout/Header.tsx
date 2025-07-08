// Components/Landing/Header.tsx
import React, { useState } from 'react';
import { Menu, X, Briefcase, Home, Info, MessageSquare, Gift, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from '../../renderer/Link';
import { usePageContext } from '../../renderer/usePageContext';
import { navigate } from 'vike/client/router'

const SublymusLogoPlaceholder = () => (
  <div className="text-2xl font-bold text-slate-800">
    Sub<span className="text-teal-500">lymus</span>
  </div>
);

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  Icon?: React.ElementType;
  onClick?: () => void; // Pour fermer le menu mobile
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, Icon, onClick }) => {
  const pageContext = usePageContext();
  const isActive = pageContext.urlPathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
        ${isActive
          ? 'bg-teal-50 text-teal-600'
          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        }
      `}
      onClick={onClick}
    >
      <span className='flex items-center'>
        {/* {Icon && <Icon className="w-4 h-4 mr-2" />} */}
        {children}
      </span>
    </Link>
  );
};


export function Header() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pageContext = usePageContext() // Pour obtenir le lang

  const navItems = [
    { href: '/', label: t('header.home'), Icon: Home },
    { href: '/preinscription', label: t('header.preRegistration'), Icon: Gift },
    { href: '/a-propos', label: t('header.about'), Icon: Info },
    { href: '/faq', label: t('header.faq'), Icon: MessageSquare },
    { href: '/contact', label: t('header.contact'), Icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <SublymusLogoPlaceholder />
              {/* <img className="h-8 w-auto" src={SublymusLogo} alt="Sublymus" /> */}
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} Icon={item.Icon}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions Desktop (ex: Connexion / Dashboard Owner) */}
          <div className="hidden md:flex items-center">
            <a
              href={"https://dash.sublymus.com"} // URL vers le dashboard owner
              target='_blank'  
              className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors"
            >
              {t('header.ownerLogin')}
            </a>
          </div>

          {/* Bouton Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">{t('header.openMenu')}</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 p-2 transition transform origin-top-right z-40 shadow-lg ring-1 ring-black ring-opacity-5 bg-white" id="mobile-menu">
          <div className="rounded-lg shadow-lg ">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} onClick={() => {
                  navigate(item.href);
                  setIsMobileMenuOpen(false);
                }}>
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-slate-200">
              {/* TODO: Language switcher mobile */}
              <div className="mt-3 space-y-1">
                <a
                    href="https://dash.sublymus.com" 
                    target='_blank'
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-base font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Espace vendeur
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}