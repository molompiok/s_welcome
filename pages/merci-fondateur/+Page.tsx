// pages/merci-fondateur/+Page.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Gift, Mail, MessageCircle } from 'lucide-react';
import { Link } from '../../renderer/Link';

// Placeholder pour les SVGs décoratifs
const DecorativeBlob = ({ className, color = 'bg-teal-500' }: { className?: string; color?: string }) => (
  <div className={`absolute rounded-full opacity-10 -z-10 ${color} ${className}`}></div>
);

export default function MerciFondateurPage() {
  const { t } = useTranslation();
  const [contributorName, setContributorName] = useState('');
  const [contributionTier, setContributionTier] = useState('');

  useEffect(() => {
    // Essayer de récupérer des infos depuis localStorage ou query params si passées après la soumission
    // Exemple simple (à adapter selon ta logique de redirection post-soumission)
    const params = new URLSearchParams(window.location.search);
    setContributorName(params.get('name') || t('merciFondateur.defaultName'));
    setContributionTier(params.get('tier') || t('merciFondateur.defaultTier')); // ex: "Bronze", "Argent", "Or"
  }, [t]);

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <DecorativeBlob className="w-96 h-96 -top-40 -left-40" color="bg-purple-200" />
      <DecorativeBlob className="w-80 h-80 -bottom-40 -right-40 transform rotate-45" color="bg-sky-200" />

      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-2xl text-center relative z-10">
        <div>
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            {t('merciFondateur.title', { name: contributorName })}
          </h2>
          <p className="mt-3 text-slate-600">
            {t('merciFondateur.subtitle', { tier: contributionTier ? t(`merciFondateur.tier.${contributionTier.toLowerCase()}`, {defaultValue: contributionTier}) : ''})}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <p className="text-sm text-slate-700">
            {t('merciFondateur.confirmationDetails')}
          </p>

          <div className="p-4 bg-teal-50 rounded-md border border-teal-200">
            <h3 className="text-md font-semibold text-teal-700 mb-2">{t('merciFondateur.nextSteps.title')}</h3>
            <ul className="list-disc list-inside text-sm text-teal-600 space-y-1 text-left">
              <li>{t('merciFondateur.nextSteps.step1')}</li>
              <li>{t('merciFondateur.nextSteps.step2')}</li>
              <li>{t('merciFondateur.nextSteps.step3')}</li>
            </ul>
          </div>

          <p className="text-sm text-slate-500">
            {t('merciFondateur.followUsPrompt')}
            {/* Ajouter des liens vers vos réseaux sociaux ici */}
            {/* Exemple:
            <div className="mt-2 flex justify-center space-x-4">
              <a href="#" className="text-slate-400 hover:text-teal-500"><Facebook className="w-6 h-6" /></a>
              <a href="#" className="text-slate-400 hover:text-teal-500"><Twitter className="w-6 h-6" /></a>
            </div>
            */}
          </p>

          <Link
            href="/"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            {t('merciFondateur.backToHome')}
          </Link>

          <p className="text-xs text-slate-500">
            {t('merciFondateur.contactSupport', { email: t('contact.info.email.value')})}
            <a href={`mailto:${t('contact.info.email.value')}`} className="font-medium text-teal-600 hover:text-teal-700">
                {t('contact.info.email.value')}
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}