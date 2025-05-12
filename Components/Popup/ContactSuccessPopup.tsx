// Components/Landing/ContactSuccessPopup.tsx (ou un autre emplacement approprié)
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, X } from 'lucide-react';
import { useChildViewer } from '../ChildViewer/useChildViewer'; // Ajuste le chemin si nécessaire

interface ContactSuccessPopupProps {
  // Tu pourrais ajouter des props si tu veux personnaliser davantage le message
}

export const ContactSuccessPopup: React.FC<ContactSuccessPopupProps> = () => {
  const { t } = useTranslation();
  const { openChild } = useChildViewer();

  const handleClose = () => {
    openChild(null); // Ferme le ChildViewer
  };

  return (
    <div className="contact-success-popup p-6 sm:p-8 bg-white rounded-xl shadow-2xl max-w-md mx-auto text-center">
      <div className="flex justify-center mb-5">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">
        {t('contact.form.popup.successTitle')}
      </h2>
      <p className="text-slate-600 mb-6">
        {t('contact.form.popup.successMessage')}
      </p>
      <button
        onClick={handleClose}
        className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
      >
        <X className="w-5 h-5 mr-2" />
        {t('contact.form.popup.closeButton')}
      </button>
    </div>
  );
};