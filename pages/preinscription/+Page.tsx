// pages/preinscription/+Page.tsx
import React, { useState, useEffect, JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle, Gift, Users, Clock, CreditCard, Smartphone, TrendingUp, ShieldCheck } from 'lucide-react';
import { useForm, SubmitHandler, UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormReset } from 'react-hook-form'; // Pour la gestion du formulaire
import { useCreatePreinscription, useGetPreinscriptionSummary } from '../../api/ReactSublymusServer';
import { showErrorToast, showToast } from '../../Components/Utils/toastNotifications';
import { CreatePreinscriptionData } from '../../api/SublymusServer';
import { useChildViewer } from '../../Components/ChildViewer/useChildViewer';
import { ChildViewer } from '../../Components/ChildViewer/ChildViewer';
import { HelpButton } from '../../Components/Button/HelpButton';

// Placeholder pour les SVGs décoratifs
const DecorativeBlob = ({ className, color = 'bg-teal-500' }: { className?: string; color?: string }) => (
  <div className={`absolute rounded-full opacity-10 -z-10 ${color} ${className}`}></div>
);

// Types pour le formulaire et les données des fondateurs
type ContributionTier = 'bronze' | 'silver' | 'gold' | 'custom';
type PaymentMethod = 'mtn' | 'orange' | 'moov' | 'wave' | 'visa';

interface PreinscriptionFormData {
  name: string;
  email: string;
  shop_name?: string;
  chosenTier: ContributionTier;
  customAmount?: number;
  display_info: boolean;
  payment_method: PaymentMethod;
  transaction_number?: string; // Pour mobile money
  transaction_id?: string; // Pour mobile money
}

interface FounderData {
  id: string;
  name: string | null; // Peut être null si anonyme
  shop_name: string | null;
  message?: string; // Message du fondateur
  avatar_url?: string; // URL de l'avatar
  contribution_amount: number;
  contributionTier: ContributionTier;
  date: string; // Date de contribution
}

// Données mock pour la liste des fondateurs (à remplacer par un appel API)
const mockFounders: FounderData[] = [
  { id: '1', name: 'Aminata K.', shop_name: 'Amina Mode', message: "Très enthousiaste à l'idée de lancer ma boutique sur Sublymus ! L'AR est une super idée.", avatar_url: 'https://i.pravatar.cc/150?u=amina', contribution_amount: 300000, contributionTier: 'silver', date: '25/07/2024' },
  { id: '2', name: 'Moussa B.', shop_name: 'Tech Solutions CI', message: "Enfin une plateforme pensée pour nous. Hâte de voir le produit final !", avatar_url: 'https://i.pravatar.cc/150?u=moussa', contribution_amount: 1000000, contributionTier: 'gold', date: '24/07/2024' },
  { id: '3', name: null, shop_name: 'Artisanat Divin', message: "Je soutiens ce projet à 100%. Bravo l'équipe !", avatar_url: 'https://i.pravatar.cc/150?u=artisan', contribution_amount: 100000, contributionTier: 'bronze', date: '23/07/2024' },
  { id: '4', name: 'Fatou S.', shop_name: 'Saveurs d\'Afrique', message: "Impatiente de pouvoir gérer mes stocks et paiements plus facilement.", avatar_url: 'https://i.pravatar.cc/150?u=fatou', contribution_amount: 300000, contributionTier: 'silver', date: '22/07/2024' },
  // ... plus de fondateurs
];

// Carte pour un fondateur
const FounderCard: React.FC<Partial<FounderData>> = ({ name, shop_name, message, avatar_url, contribution_amount = 0, contributionTier = 'custom', date }) => {
  const { t } = useTranslation();
  const tierColors: Record<ContributionTier, string> = {
    bronze: 'border-yellow-600',
    silver: 'border-slate-400',
    gold: 'border-amber-400',
    custom: 'border-teal-500'
  };
  return (
    <div className={`flex-shrink-0 w-80 bg-white p-6 rounded-xl shadow-lg border-t-4 ${tierColors[contributionTier]} mx-2`}>
      <div className="flex items-center mb-4">
        <img
          src={avatar_url || `https://ui-avatars.com/api/?name=${name || 'S'}&background=random&size=128`}
          alt={name || 'Fondateur'}
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />
        <div>
          <h4 className="font-semibold text-slate-800">{name || t('preRegistration.anonymousFounder')}</h4>
          {shop_name && <p className="text-xs text-teal-600">{shop_name}</p>}
        </div>
      </div>
      {message && <p className="text-sm text-slate-600 mb-3 italic">"{message}"</p>}
      <div className="text-xs text-slate-500">
        <p>{t('preRegistration.contribution')}: <span className="font-semibold text-slate-700">{contribution_amount.toLocaleString('fr-CI')} FCFA</span></p>
        <p>{t('common.date')}: {date}</p>
      </div>
    </div>
  );
};


export default function PreinscriptionPage() {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });


  const { openChild } = useChildViewer()
  const launchDate = new Date('2025-09-01T00:00:00'); // Date de lancement

  useEffect(() => {
    // Appel API pour récupérer le total collecté et la liste des fondateurs
    // fetch('/api/founders-data').then(res => res.json()).then(data => {
    //   setTotalCollected(data.totalCollected);
    //   setFoundersList(data.founders);
    // });

    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const contributionTiers = [
    { id: 'bronze', name: t('preRegistration.tiers.bronze.name'), amount: 100000, description: t('preRegistration.tiers.bronze.description'), features: [t('preRegistration.tiers.bronze.feature1'), t('preRegistration.tiers.bronze.feature2')], color: 'bg-yellow-500', Icon: Gift },
    { id: 'silver', name: t('preRegistration.tiers.silver.name'), amount: 300000, description: t('preRegistration.tiers.silver.description'), features: [t('preRegistration.tiers.silver.feature1'), t('preRegistration.tiers.silver.feature2'), t('preRegistration.tiers.silver.feature3')], color: 'bg-slate-500', Icon: Users },
    { id: 'gold', name: t('preRegistration.tiers.gold.name'), amount: 1000000, description: t('preRegistration.tiers.gold.description'), features: [t('preRegistration.tiers.gold.feature1'), t('preRegistration.tiers.gold.feature2'), t('preRegistration.tiers.gold.feature3'), t('preRegistration.tiers.gold.feature4')], color: 'bg-amber-400', Icon: TrendingUp },
  ];

  // Hook pour créer une préinscription
  

  // Hook pour récupérer le résumé
  const { data: summaryData, isLoading: isLoadingSummary, error: summaryError } = useGetPreinscriptionSummary({
    refetchInterval: 60000, // Rafraîchir toutes les minutes par exemple
  });

  const totalCollected = summaryData?.data?.total_collected || 0;
  const foundersList = summaryData?.data?.founders || [];
  const tierColors: Record<ContributionTier, string> = {
    bronze: 'border-yellow-600',
    silver: 'border-slate-400',
    gold: 'border-amber-400',
    custom: 'border-teal-500'
  };

  

  function onChooseOk(tier:string) {
    openChild(<ChildViewer>
      <FormPopup selectedTier={tier}  contributionTiers={contributionTiers}/>
  
    </ChildViewer>, {
      background: '#3455'
    })

  }

  console.log(summaryData, foundersList,totalCollected);
  
  return (
    <div className="bg-slate-50 py-16 lg:py-24 relative overflow-hidden">
      <DecorativeBlob className="w-96 h-96 -top-20 -left-40" color="bg-purple-300" />
      <DecorativeBlob className="w-80 h-80 -bottom-32 -right-32 transform rotate-45" color="bg-sky-300" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Entête */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
            {t('preRegistration.title')}
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            {t('preRegistration.subtitle')}
          </p>
        </div>

        {/* Compte à Rebours et Total Collecté */}
        <div className="mb-12 lg:mb-16 p-6 bg-white rounded-xl shadow-xl max-w-3xl mx-auto text-center border-t-4 border-teal-500">
          <h2 className="text-2xl font-semibold text-teal-600 mb-3">{t('preRegistration.launchCountdown')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-800 mb-6">
            <div><span className="text-4xl font-bold">{timeLeft.days}</span><p className="text-xs uppercase">{t('common.days')}</p></div>
            <div><span className="text-4xl font-bold">{timeLeft.hours}</span><p className="text-xs uppercase">{t('common.hours')}</p></div>
            <div><span className="text-4xl font-bold">{timeLeft.minutes}</span><p className="text-xs uppercase">{t('common.minutes')}</p></div>
            <div><span className="text-4xl font-bold">{timeLeft.seconds}</span><p className="text-xs uppercase">{t('common.seconds')}</p></div>
          </div>
          <p className="text-sm text-slate-600">{t('preRegistration.officialLaunchDate', { date: launchDate.toLocaleDateString('fr-CI', { year: 'numeric', month: 'long', day: 'numeric' }) })}</p>
          <hr className="my-6 border-slate-200" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">{t('preRegistration.totalCollected')}</h3>
          <p className="text-5xl font-bold text-teal-500">{totalCollected.toLocaleString('fr-CI')} <span className="text-3xl">FCFA</span></p>
        </div>


        {/* Section des Paliers de Contribution */}
        <div className="mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">{t('preRegistration.chooseYourSupport')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {contributionTiers.map((tier) => (
              <div
                key={tier.id}
                onClick={() => onChooseOk(tier.id)}
                className={`p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-4
                  ${'border-transparent bg-white hover:border-teal-200'}
                `}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white ${tier.color}`}>
                  <tier.Icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-2">{tier.name}</h3>
                <p className="text-4xl font-bold text-slate-900 mb-1">{tier.amount.toLocaleString('fr-CI')} <span className="text-xl font-normal text-slate-500">FCFA</span></p>
                <p className="text-sm text-slate-600 mb-6 h-16">{tier.description}</p> {/* Hauteur fixe pour alignement */}
                <ul className="space-y-2 text-sm text-slate-700 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center"><CheckCircle className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" /> {feature}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={`w-full py-3 px-4 mt-auto rounded-lg font-semibold transition-colors
                    ${`text-white ${tier.color} hover:opacity-90`}
                    `}
                >
                  {t('preRegistration.selectOffer')}
                </button>
              </div>
            ))}
            {/* Option Personnalisée (plus simple pour le moment) */}
            <div
              onClick={() => onChooseOk('custom')}
              className={`p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-4
                ${ 'border-transparent bg-white hover:border-teal-200'}
                col-span-1 md:col-span-2 lg:col-span-1 lg:max-w-sm lg:mx-auto
                `}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white bg-sky-500`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-2">{t('preRegistration.tiers.custom.name')}</h3>
              <p className="text-sm text-slate-600 mb-6 h-16">{t('preRegistration.tiers.custom.description')}</p>
              <ul className="space-y-2 text-sm text-slate-700 mb-8">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" /> {t('preRegistration.tiers.custom.feature1')}</li>
              </ul>
              <button
                type="button"
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors
                    ${`text-white bg-sky-500 hover:opacity-90`}
                    `}
              >
                {t('preRegistration.selectOffer')}
              </button>
            </div>
          </div>
        </div>

        {/* Section "Nos Fondateurs" */}
        <section className="mt-16 lg:mt-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">{t('preRegistration.ourFounders.title')}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t('preRegistration.ourFounders.subtitle')}</p>
          </div>
          {/* Carrousel horizontal */}
          {/* Pour un vrai carrousel, utiliser Swiper.js ou similaire. Ici, un simple overflow. */}
          <div className="relative">
            <div className="flex overflow-x-auto pb-8 -mx-4 px-4 space-x-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-teal-100">
              {foundersList.length > 0 ? foundersList.map(founder => (
                <div key={founder.id} className="snap-center">
                  <FounderCard {...founder} />
                </div>
              )) : (
                <p className="text-center text-slate-500 w-full py-8">{t('preRegistration.ourFounders.noFoundersYet')}</p>
              )}
            </div>
            {/* Indicateurs de scroll (optionnel, si pas de librairie de carrousel) */}
            {foundersList.length > 3 && ( // Afficher seulement si plus de 3 pour que le scroll soit utile
              <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-full justify-between px-0">
                <button className="p-2 bg-white/70 rounded-full shadow-md hover:bg-white transition-colors disabled:opacity-50" disabled>
                  {/* <ChevronLeft className="w-6 h-6 text-slate-700" /> Placeholder for previous */}
                </button>
                <button className="p-2 bg-white/70 rounded-full shadow-md hover:bg-white transition-colors disabled:opacity-50" disabled>
                  {/* <ChevronRight className="w-6 h-6 text-slate-700" /> Placeholder for next */}
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

interface FormPopupProps {
  selectedTier:string,
  contributionTiers: {
    id: string;
    name: string;
    amount: number;
    description: string;
    features: string[];
    color: string;
    Icon: any;
}[]
}

export const FormPopup: React.FC<FormPopupProps> = ({
  contributionTiers,
  selectedTier
}) => {
  const createPreinscriptionMutation = useCreatePreinscription();
    const {register, handleSubmit, watch, formState: { errors }, setValue, reset } = useForm<PreinscriptionFormData>();

const onSubmit: SubmitHandler<PreinscriptionFormData> = async (formData) => {
    // Transformer formData si nécessaire pour correspondre à CreatePreinscriptionData
    const apiData: CreatePreinscriptionData = {
      name: formData.name,
      email: formData.email,
      shop_name: formData.shop_name,
      chosen_tier: selectedTier as any,
      contribution_amount: formData.customAmount || contributionTiers.find(t => t.id === selectedTier)?.amount || 0,
      display_info: formData.display_info,
      payment_method: formData.payment_method,
      transaction_details: { // Construire cet objet basé sur la méthode de paiement
        phoneNumber: formData.transaction_number,
        transaction_id: formData.transaction_id,
        // autres détails si besoin
      }
    };

    try {
      await createPreinscriptionMutation.mutateAsync(apiData);
      showToast(t('preRegistration.submissionSuccess'), 'SUCCESS');
      reset(); // Vider le formulaire
      // Idéalement, passer des infos à la page de remerciement via query params ou state
      const tierName = contributionTiers?.find(t => t.id === selectedTier)?.name || selectedTier;
      window.location.href = `/merci-fondateur?name=${encodeURIComponent(formData.name)}&tier=${encodeURIComponent(tierName)}`;
    } catch (error: any) {
      showErrorToast(error.message || t('preRegistration.submissionError'));
    }
  };
  const { t } = useTranslation();
  const payment_method = watch('payment_method');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-12 p-8 bg-white rounded-xl shadow-xl max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold text-slate-800 mb-6 text-center">{t('preRegistration.formTitle')} <HelpButton/></h3>

      {/* Nom & Email */}
      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">{t('form.name.label')}</label>
          <input
            type="text"
            id="name"
            {...register('name', { required: t('form.name.required') || '' })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">{t('form.email.label')}</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: t('form.email.required') || '',
              pattern: { value: /^\S+@\S+$/i, message: t('form.email.invalid') || '' },
            })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      {/* Nom de la boutique & Montant personnalisé */}
      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="shop_name" className="block text-sm font-medium text-slate-700 mb-1">
            {t('form.shop_name.label')} <span className="text-xs text-slate-500">({t('common.optional')})</span>
          </label>
          <input
            type="text"
            id="shop_name"
            {...register('shop_name')}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        {selectedTier === 'custom' && (
          <div>
            <label htmlFor="customAmount" className="block text-sm font-medium text-slate-700 mb-1">{t('form.customAmount.label')}</label>
            <input
              type="number"
              id="customAmount"
              {...register('customAmount', {
                required: selectedTier === 'custom' ? (t('form.customAmount.required') || false) : false,
                min: { value: 50000, message: t('form.customAmount.min', { amount: 50000 }) || '' },
              })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              placeholder="Min. 50 000 FCFA"
            />
            {errors.customAmount && <p className="text-xs text-red-600 mt-1">{errors.customAmount.message}</p>}
          </div>
        )}
      </div>

      {/* Affichage Infos */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('display_info')}
            className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
            defaultChecked={true}
          />
          <span className="ml-2 text-sm text-slate-700">{t('form.display_info.label')}</span>
        </label>
      </div>

      {/* Moyen de Paiement */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">{t('form.payment_method.label')}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(['mtn', 'orange', 'moov', 'wave', 'visa'] as PaymentMethod[]).map((method) => (
            <label
              key={method}
              className={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-all ${payment_method === method ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500' : 'border-slate-300 hover:border-slate-400'
                }`}
            >
              <input
                type="radio"
                value={method}
                {...register('payment_method', { required: t('form.payment_method.required') || false })}
                className="sr-only"
              />
              {method === 'visa' ? <CreditCard className="w-5 h-5 mr-2 text-blue-600" /> : <Smartphone className="w-5 h-5 mr-2 text-orange-500" />}
              <span className="text-sm font-medium text-slate-700 uppercase">{method}</span>
            </label>
          ))}
        </div>
        {errors.payment_method && <p className="text-xs text-red-600 mt-1">{errors.payment_method.message}</p>}
      </div>

      {/* Champs spécifiques au moyen de paiement */}
      {(payment_method === 'mtn' || payment_method === 'orange' || payment_method === 'moov' || payment_method === 'wave') && (
        <div className="p-4 bg-sky-50 rounded-md mb-6 border border-sky-200">
          <p className="text-sm text-sky-700 mb-2">
            {t('form.mobileMoneyInstructions.line1', {
              method: payment_method.toUpperCase(),
              amount: (watch('customAmount') || 0).toLocaleString('fr-CI'),
              number: t(`paymentNumbers.${payment_method}`),
            })}
          </p>
          <p className="text-xs text-sky-600 mb-4">{t('form.mobileMoneyInstructions.line2')}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="transaction_number" className="block text-xs font-medium text-slate-700 mb-1">
                {t('form.transaction_number.label')}
              </label>
              <input
                type="tel"
                id="transaction_number"
                {...register('transaction_number', { required: t('form.transaction_number.required') || false })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              />
              {errors.transaction_number && <p className="text-xs text-red-600 mt-1">{errors.transaction_number.message}</p>}
            </div>
            <div>
              <label htmlFor="transaction_id" className="block text-xs font-medium text-slate-700 mb-1">
                {t('form.transaction_id.label')} <span className="text-xs text-slate-500">({t('common.optional')})</span>
              </label>
              <input
                type="text"
                id="transaction_id"
                {...register('transaction_id')}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
        </div>
      )}
      {payment_method === 'visa' && (
        <div className="p-4 bg-blue-50 rounded-md mb-6 border border-blue-200">
          <p className="text-sm text-blue-700">
            {t('form.visaInstructions.line1', { amount: (watch('customAmount') || 0).toLocaleString('fr-CI') })}
          </p>
          <p className="mt-2 text-sm font-semibold text-blue-800">{t('paymentNumbers.visa')}</p>
          <p className="text-xs text-blue-600 mt-1">{t('form.visaInstructions.line2')}</p>
        </div>
      )}

      {/* Bouton de soumission */}
      <button
        type="submit"
        className="w-full mt-2 flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {t('preRegistration.submitButton')} <ArrowRight className="ml-2 w-5 h-5" />
      </button>
      <p className="text-xs text-slate-500 mt-4 text-center">{t('preRegistration.dataUsageNote')}</p>
    </form>
  );
};