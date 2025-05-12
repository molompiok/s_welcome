// pages/politique-confidentialite/+Page.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, UserCog } from 'lucide-react'; // UserCog pourrait être intéressant pour les droits des utilisateurs

// Placeholder pour les SVGs décoratifs
const DecorativeBlob = ({ className, color = 'bg-teal-500' }: { className?: string; color?: string }) => (
  <div className={`absolute rounded-full opacity-5 -z-10 ${color} ${className}`}></div>
);

export default function PolitiqueConfidentialitePage() {
  const { t } = useTranslation();

  // REMARQUE IMPORTANTE: Le contenu ci-dessous est un EXEMPLE et doit être
  // adapté et validé par un conseiller juridique.
  const sections = [
    {
      title: t('legal.privacy.section1.title'), // Introduction
      content: [
        t('legal.privacy.section1.point1', { siteName: "Sublymus", companyName: "SUBLYMUS (Nom de l'entreprise)" }),
        t('legal.privacy.section1.point2'),
      ]
    },
    {
      title: t('legal.privacy.section2.title'), // Données collectées
      content: [
        t('legal.privacy.section2.point1'),
        `<ul>
          <li>${t('legal.privacy.section2.item1')}</li>
          <li>${t('legal.privacy.section2.item2')}</li>
          <li>${t('legal.privacy.section2.item3')}</li>
          <li>${t('legal.privacy.section2.item4')}</li>
          <li>${t('legal.privacy.section2.item5')}</li>
        </ul>`, // Exemple avec liste HTML
        t('legal.privacy.section2.point2'),
      ]
    },
    {
      title: t('legal.privacy.section3.title'), // Utilisation des données
      content: [
        t('legal.privacy.section3.point1'),
         `<ul>
          <li>${t('legal.privacy.section3.item1')}</li>
          <li>${t('legal.privacy.section3.item2')}</li>
          <li>${t('legal.privacy.section3.item3')}</li>
          <li>${t('legal.privacy.section3.item4')}</li>
        </ul>`,
      ]
    },
    {
      title: t('legal.privacy.section4.title'), // Partage des données
      content: [
        t('legal.privacy.section4.point1'),
        t('legal.privacy.section4.point2'),
      ]
    },
    {
      title: t('legal.privacy.section5.title'), // Sécurité des données
      content: [
        t('legal.privacy.section5.point1'),
      ]
    },
    {
      title: t('legal.privacy.section6.title'), // Vos droits
      content: [
        t('legal.privacy.section6.point1'),
        `<ul>
          <li>${t('legal.privacy.section6.item1')}</li>
          <li>${t('legal.privacy.section6.item2')}</li>
          <li>${t('legal.privacy.section6.item3')}</li>
          <li>${t('legal.privacy.section6.item4')}</li>
        </ul>`,
        t('legal.privacy.section6.point2', { email: "contact@sublymus.com" }),
      ]
    },
    {
      title: t('legal.privacy.section7.title'), // Cookies
      content: [
        t('legal.privacy.section7.point1'),
        // Plus de détails sur les cookies ici si nécessaire
      ]
    },
    {
      title: t('legal.privacy.section8.title'), // Modifications de cette politique
      content: [
        t('legal.privacy.section8.point1'),
      ]
    },
    {
      title: t('legal.privacy.section9.title'), // Contact
      content: [
        t('legal.privacy.section9.point1', { email: "contact@sublymus.com" }),
      ]
    },
     {
      title: t('legal.mentions.section7.title'), // Date de dernière mise à jour (réutilisation)
      content: [
        t('legal.mentions.section7.point1', { updateDate: "28 Juillet 2024" }), // METTRE LA DATE ACTUELLE
      ]
    }
  ];


  return (
    <div className="bg-white min-h-screen">
      <DecorativeBlob className="w-96 h-96 -top-20 -right-40" color="bg-purple-200" />
      <DecorativeBlob className="w-80 h-80 -bottom-32 -left-32 transform rotate-45" color="bg-teal-200" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-6">
              <ShieldCheck className="w-8 h-8 text-slate-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              {t('legal.privacy.title')}
            </h1>
             <p className="text-sm text-slate-500">
              {t('legal.mentions.lastUpdated', { date: sections.find(s => s.title === t('legal.mentions.section7.title'))?.content[0] || "Date non définie"})}
            </p>
          </div>

          <div className="prose prose-slate max-w-none lg:prose-lg">
            {sections.map((section, index) => (
              <div key={index} className="mb-8 p-6 bg-slate-50 rounded-lg shadow">
                <h2 className="!text-xl !font-semibold !text-teal-700 !mt-0 !mb-4">{section.title}</h2>
                {section.content.map((paragraph, pIndex) => (
                  <div key={pIndex} className="!text-sm !text-slate-700" dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
              </div>
            ))}
            <p className="mt-12 text-xs text-slate-500 text-center">
                {t('legal.mentions.advice')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}