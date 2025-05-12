// Components/Landing/Footer.tsx
import React from 'react';

import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from '../../renderer/Link';
// import SublymusLogoWhite from '../../assets/svg/sublymus-logo-white.svg'; // Tu créeras ce SVG

// Placeholder pour le logo si le SVG n'est pas prêt
const SublymusLogoPlaceholderWhite = () => (
  <div className="text-3xl font-bold text-slate-800">
    Subly<span className="text-teal-600">mus</span>
  </div>
);

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: t('footer.platform'),
      links: [
        { label: t('footer.home'), href: '/' },
        { label: t('footer.preRegistrationOffer'), href: '/preinscription' },
        // { label: t('footer.pricing'), href: '/tarifs' }, // Future page
        { label: t('footer.features'), href: '/#features' }, // Lien vers section de la page d'accueil
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.aboutUs'), href: '/a-propos' },
        { label: t('footer.contactUs'), href: '/contact' },
        { label: t('footer.faq'), href: '/faq' },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { label: t('footer.terms'), href: '/mentions-legales' }, // Ajuster si nom différent
        { label: t('footer.privacy'), href: '/politique-confidentialite' },
      ],
    },
    {
      title: t('footer.resources'),
      links: [
        { label: t('footer.blog'), href: '/blog' }, // Future page
        { label: t('footer.tutorials'), href: '/tutoriels' }, // Future page
      ],
    },
  ];

  const socialLinks = [
    { Icon: Facebook, href: '#', label: 'Facebook' },
    { Icon: Twitter, href: '#', label: 'Twitter' },
    { Icon: Instagram, href: '#', label: 'Instagram' },
    { Icon: Linkedin, href: '#', label: 'LinkedIn' },
    { Icon: Github, href: 'https://github.com/your-org/sublymus', label: 'GitHub' }, // Mettre le vrai lien
  ];

  return (
    <footer className="text-salte-600" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        {t('footer.title')}
      </h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="pb-8 xl:grid xl:grid-cols-5 xl:gap-8">
          {/* Logo et description */}
          <div className="space-y-8 xl:col-span-2">
            <Link href="/">
              <SublymusLogoPlaceholderWhite />
              {/* <img className="h-10" src={SublymusLogoWhite} alt="Sublymus" /> */}
            </Link>
            <p className="text-sm text-salte-600 max-w-xs">
              {t('footer.description')}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex space-x-6">
                {socialLinks.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="text-salte-600 hover:text-teal-600 transition-colors">
                    <span className="sr-only">{item.label}</span>
                    <item.Icon className="h-6 w-6" aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Liens de navigation */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-3 md:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-salte-200 tracking-wider uppercase">
                  {section.title}
                </h3>
                <ul role="list" className="mt-4 space-y-3">
                  {section.links.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-salte-600 hover:text-teal-600 hover:underline transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-salte-700 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-sm text-salte-600 md:mt-0 md:order-1">
            © {currentYear} Sublymus. {t('footer.allRightsReserved')}.
          </p>
          {/* Peut-être un petit sélecteur de langue ici aussi */}
        </div>
      </div>
    </footer>
  );
}