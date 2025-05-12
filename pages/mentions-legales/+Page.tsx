// pages/mentions-legales/+Page.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, ShieldQuestion } from 'lucide-react';

// Placeholder pour les SVGs décoratifs
const DecorativeBlob = ({ className, color = 'bg-teal-500' }: { className?: string; color?: string }) => (
  <div className={`absolute rounded-full opacity-5 -z-10 ${color} ${className}`}></div>
);

export default function MentionsLegalesPage() {
  const { t } = useTranslation();

  // REMARQUE IMPORTANTE: Le contenu ci-dessous est un EXEMPLE et doit être
  // adapté et validé par un conseiller juridique.
  const sections = [
    {
      title: t('legal.mentions.section1.title'), // Éditeur du Site
      content: [
        t('legal.mentions.section1.point1', { companyName: "SUBLYMUS (Nom de l'entreprise à créer)", address: "Votre Adresse Complète, Abidjan, Côte d'Ivoire", rccm: "RCCM N° XXXXXX (si applicable)", capital: "Capital Social de XXXXX FCFA (si applicable)" }),
        t('legal.mentions.section1.point2', { email: "contact@sublymus.com", phone: "+225 XX XX XX XX" }),
        t('legal.mentions.section1.point3', { directorName: "Nom du Directeur de la Publication" }),
      ]
    },
    {
      title: t('legal.mentions.section2.title'), // Hébergement
      content: [
        t('legal.mentions.section2.point1', { hostName: "Nom de l'Hébergeur (Ex: Vercel, Netlify, AWS, Contabo)", hostAddress: "Adresse de l'Hébergeur", hostContact: "Contact de l'Hébergeur" }),
      ]
    },
    {
      title: t('legal.mentions.section3.title'), // Propriété Intellectuelle
      content: [
        t('legal.mentions.section3.point1', { siteName: "Sublymus" }),
        t('legal.mentions.section3.point2'),
      ]
    },
    {
      title: t('legal.mentions.section4.title'), // Responsabilité
      content: [
        t('legal.mentions.section4.point1', { siteName: "Sublymus" }),
        t('legal.mentions.section4.point2'),
        t('legal.mentions.section4.point3'),
      ]
    },
    {
      title: t('legal.mentions.section5.title'), // Données Personnelles
      content: [
        t('legal.mentions.section5.point1', { privacyPolicyLink: "/politique-confidentialite" }),
      ]
    },
    {
      title: t('legal.mentions.section6.title'), // Droit Applicable et Juridiction
      content: [
        t('legal.mentions.section6.point1'),
      ]
    },
    {
      title: t('legal.mentions.section7.title'), // Date de dernière mise à jour
      content: [
        t('legal.mentions.section7.point1', { updateDate: "28 Juillet 2024" }), // METTRE LA DATE ACTUELLE
      ]
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <DecorativeBlob className="w-96 h-96 -top-20 -left-40" color="bg-sky-200" />
      <DecorativeBlob className="w-80 h-80 -bottom-32 -right-32 transform rotate-45" color="bg-purple-200" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-6">
              <FileText className="w-8 h-8 text-slate-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              {t('legal.mentions.title')}
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
                  <p key={pIndex} className="!text-sm !text-slate-700" dangerouslySetInnerHTML={{ __html: paragraph }} />
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