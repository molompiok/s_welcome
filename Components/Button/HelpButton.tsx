// Components/Landing/HelpButton.tsx (ou un autre emplacement approprié)
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LifeBuoy } from 'lucide-react'; // Ou MessageCircleQuestion si tu préfères
import { Link } from '../../renderer/Link';
import { useChildViewer } from '../ChildViewer/useChildViewer';
import { navigate } from 'vike/client/router';

interface HelpButtonProps {
  className?: string; // Pour ajouter des classes Tailwind supplémentaires si besoin
  fixedPosition?: boolean; // Pour le positionner en bas à droite de l'écran
}

export const HelpButton: React.FC<HelpButtonProps> = ({ className = '', fixedPosition = false }) => {
  const { t } = useTranslation();
const {openChild} = useChildViewer();

    
  const baseClasses = "inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-full shadow-lg text-sm font-medium text-white hover:text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-150 ease-in-out transform hover:scale-105";

  const fixedClasses = fixedPosition
    ? "fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8"
    : "";

  return (
    <Link
      href="/contact"
      onClick={()=>{
        openChild(null)
        navigate('/contact')
      }}
      className={`${baseClasses} ${fixedClasses} ${className}`}
      title={t('helpButton.title')} // Pour l'accessibilité
    >
      <LifeBuoy className="w-5 h-5 mr-2 inline " aria-hidden="true" />
      {t('helpButton.text')}
    </Link>
  );
};