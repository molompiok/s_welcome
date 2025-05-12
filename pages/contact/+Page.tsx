// pages/contact/+Page.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Mail, Phone, MapPin, Send, Building, MessageSquareHeart } from 'lucide-react';
import { useCreateContactMessage } from '../../api/ReactSublymusServer';
import { CreateContactMessageData } from '../../api/SublymusServer';
import { showErrorToast, showToast } from '../../Components/Utils/toastNotifications';
import { useChildViewer } from '../../Components/ChildViewer/useChildViewer';
import { ContactSuccessPopup } from '../../Components/Popup/ContactSuccessPopup';
// import { Link } from 'vike-react/usePageContext'; // Si besoin de liens internes

// Placeholder pour les SVGs décoratifs
const DecorativeBlob = ({ className, color = 'bg-teal-500' }: { className?: string; color?: string }) => (
  <div className={`absolute rounded-full opacity-10 -z-10 ${color} ${className}`}></div>
);

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  // consent?: boolean; // Optionnel pour consentement RGPD
}

export default function ContactPage() {
  const { t } = useTranslation();
  const { openChild } = useChildViewer()
const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>(); // reset est déjà là

  const createContactMessageMutation = useCreateContactMessage();

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    const apiData: CreateContactMessageData = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
    };

    try {
      await createContactMessageMutation.mutateAsync(apiData);
      showToast(t('contact.form.successMessage'), 'SUCCESS');
       openChild(<ContactSuccessPopup />, {
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)', // Fond un peu plus sombre pour le focus
        blur: 2, // Léger flou sur le fond
      });
      reset(); // <--- ICI pour vider le formulaire
    } catch (error: any) {
      showErrorToast(error.message || t('contact.form.errorMessage'));
    }
  };

  const contactInfo = [
    { Icon: Mail, title: t('contact.info.email.title'), value: t('contact.info.email.value'), href: `mailto:${t('contact.info.email.value')}` },
    { Icon: Phone, title: t('contact.info.phone.title'), value: t('contact.info.phone.value'), href: `tel:${t('contact.info.phone.value').replace(/\s/g, '')}` },
    { Icon: MapPin, title: t('contact.info.address.title'), value: t('contact.info.address.value'), isText: true }, // Ou lien vers Google Maps si pertinent
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Section Héros de la page Contact */}
      <section className="relative py-20 lg:py-28 bg-white">
        <DecorativeBlob className="w-80 h-80 -top-20 -left-32 opacity-20" color="bg-sky-200" />
        <DecorativeBlob className="w-96 h-96 -bottom-40 -right-40 opacity-20 transform rotate-45" color="bg-purple-200" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-6">
              <MessageSquareHeart className="w-8 h-8 text-teal-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
              {t('contact.hero.title')}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('contact.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contenu Principal : Formulaire et Infos de Contact */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-10 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Formulaire de Contact */}
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-6">
                  {t('contact.form.title')}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                      {t('form.name.label')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name', { required: t('form.name.required') })}
                      className={`w-full px-3 py-2.5 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      {t('form.email.label')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email', {
                        required: t('form.email.required'),
                        pattern: { value: /^\S+@\S+$/i, message: t('form.email.invalid') },
                      })}
                      className={`w-full px-3 py-2.5 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                      {t('contact.form.subject.label')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      {...register('subject', { required: t('contact.form.subject.required') })}
                      className={`w-full px-3 py-2.5 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.subject ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                      {t('contact.form.message.label')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      {...register('message', { required: t('contact.form.message.required') })}
                      className={`w-full px-3 py-2.5 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${errors.message ? 'border-red-500' : 'border-slate-300'}`}
                    ></textarea>
                    {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>}
                  </div>

                  {/* Optionnel: Case à cocher pour consentement RGPD */}
                  {/* <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="consent"
                        type="checkbox"
                        {...register('consent', { required: t('contact.form.consent.required') })}
                        className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-slate-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="consent" className="font-medium text-slate-700">
                        {t('contact.form.consent.label')} <span className="text-red-500">*</span>
                      </label>
                      {errors.consent && <p className="text-xs text-red-600">{errors.consent.message}</p>}
                    </div>
                  </div> */}

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Send className="w-5 h-5 mr-2" />
                      )}
                      {isSubmitting ? t('contact.form.sending') : t('contact.form.submitButton')}
                    </button>
                  </div>
                </form>
              </div>

              {/* Informations de Contact */}
              <div className="mt-10 lg:mt-0">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-6">
                  {t('contact.info.title')}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-8">
                  {t('contact.info.description')}
                </p>
                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <div key={info.title} className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                        <info.Icon className="w-6 h-6 text-teal-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-slate-800">{info.title}</h3>
                        {info.isText ? (
                          <p className="text-slate-600">{info.value}</p>
                        ) : (
                          <a
                            href={info.href}
                            className="text-teal-600 hover:text-teal-700 hover:underline break-all"
                          >
                            {info.value}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Optionnel: Liens vers réseaux sociaux ici aussi */}
                {/* <div className="mt-10 pt-8 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">{t('contact.info.social.title')}</h3>
                  <div className="flex space-x-4">
                     Ajouter les icônes sociales comme dans le Footer
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Optionnel: Carte Google Maps */}
      {/* <section className="py-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-96 bg-slate-200 rounded-xl shadow-lg flex items-center justify-center">
             Intégrer Google Maps iframe ici si pertinent
            <p className="text-slate-500">{t('contact.mapPlaceholder')}</p>
          </div>
        </div>
      </section> */}
      {/* Espace en bas */}
      <div className="py-8"></div>
    </div>
  );
}