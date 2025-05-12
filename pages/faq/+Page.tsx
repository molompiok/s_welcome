// pages/faq/+Page.tsx
import React, { useState, useMemo } from 'react'; // Ajout de useMemo
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, HelpCircle, BookOpen, TerminalSquare, DollarSign, Settings, Zap, ShieldCheck, Search } from 'lucide-react'; // Ajout de Search
import { Link } from '../../renderer/Link';


// Placeholder pour les SVGs décoratifs
const DecorativeBlob = ({ className, color = 'bg-teal-500' }: { className?: string; color?: string }) => (
  <div className={`absolute rounded-full opacity-10 -z-10 ${color} ${className}`}></div>
);

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  tutorialLink?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onToggle, tutorialLink }) => {
  const { t } = useTranslation();
  return (
    <div className="border-b border-slate-200">
      <h2>
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 px-1 text-left font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-300 rounded-md"
          onClick={onToggle}
          aria-expanded={isOpen}
        >
          <span className="text-base md:text-lg">{title}</span>
          {isOpen ? <ChevronUp className="w-5 h-5 text-teal-600" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>
      </h2>
      {isOpen && (
        <div className="py-4 px-1 prose prose-sm sm:prose-base max-w-none text-slate-600">
          {children}
          {tutorialLink && (
            <p className="mt-3">
              <Link href={tutorialLink} className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700 hover:underline font-medium">
                <BookOpen className="w-4 h-4 mr-1.5" />
                {t('faq.seeTutorial')}
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default function FaqPage() {
  const { t } = useTranslation();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // Pour la barre de recherche

  const handleToggle = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const allFaqCategories = useMemo(() => [ // Utiliser useMemo pour ne pas recalculer à chaque render si les traductions ne changent pas
    {
      id: 'general',
      title: t('faq.categories.general.title'),
      Icon: HelpCircle,
      questions: [
        { id: 'q1', question: t('faq.categories.general.q1.question'), answer: t('faq.categories.general.q1.answer') },
        { id: 'q2', question: t('faq.categories.general.q2.question'), answer: t('faq.categories.general.q2.answer') },
        { id: 'q3', question: t('faq.categories.general.q3.question'), answer: t('faq.categories.general.q3.answer') },
      ],
    },
    {
      id: 'features-pricing',
      title: t('faq.categories.featuresPricing.title'),
      Icon: Settings,
      questions: [
        { id: 'q4', question: t('faq.categories.featuresPricing.q4.question'), answer: t('faq.categories.featuresPricing.q4.answer'), tutorialLink: '/tutoriels/creer-boutique-gratuite' },
        { id: 'q5', question: t('faq.categories.featuresPricing.q5.question'), answer: t('faq.categories.featuresPricing.q5.answer') },
        { id: 'q6', question: t('faq.categories.featuresPricing.q6.question'), answer: t('faq.categories.featuresPricing.q6.answer'), tutorialLink: '/tutoriels/utiliser-realite-augmentee' },
        { id: 'q7', question: t('faq.categories.featuresPricing.q7.question'), answer: t('faq.categories.featuresPricing.q7.answer') },
      ],
    },
    {
      id: 'api',
      title: t('faq.categories.api.title'),
      Icon: TerminalSquare,
      questions: [
        { id: 'api_q1', question: t('faq.categories.api.q1.question'), answer: t('faq.categories.api.q1.answer'), tutorialLink: '/api-documentation' },
        { id: 'api_q2', question: t('faq.categories.api.q2.question'), answer: t('faq.categories.api.q2.answer') },
        { id: 'api_q3', question: t('faq.categories.api.q3.question'), answer: t('faq.categories.api.q3.answer') },
      ],
    },
    {
      id: 'preinscription',
      title: t('faq.categories.preinscription.title'),
      Icon: DollarSign,
      questions: [
        { id: 'q8', question: t('faq.categories.preinscription.q8.question'), answer: t('faq.categories.preinscription.q8.answer') },
        { id: 'q9', question: t('faq.categories.preinscription.q9.question'), answer: t('faq.categories.preinscription.q9.answer') },
        { id: 'q10', question: t('faq.categories.preinscription.q10.question'), answer: t('faq.categories.preinscription.q10.answer') },
      ],
    },
    {
      id: 'technical',
      title: t('faq.categories.technical.title'),
      Icon: Zap,
      questions: [
        { id: 'q11', question: t('faq.categories.technical.q11.question'), answer: t('faq.categories.technical.q11.answer') },
        { id: 'q12', question: t('faq.categories.technical.q12.question'), answer: t('faq.categories.technical.q12.answer') },
      ],
    },
  ], [t]); // Dépendance à `t` pour la mémoïsation si les traductions changent

  const filteredFaqCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return allFaqCategories;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allFaqCategories
      .map(category => ({
        ...category,
        questions: category.questions.filter(
          q =>
            q.question.toLowerCase().includes(lowerSearchTerm) ||
            q.answer.toLowerCase().includes(lowerSearchTerm)
        ),
      }))
      .filter(category => category.questions.length > 0);
  }, [allFaqCategories, searchTerm]);

  return (
    <div className="bg-slate-50 min-h-screen relative overflow-hidden"> {/* Ajout de relative et overflow-hidden */}
      {/* Section En-tête de la page FAQ - TA MODIFICATION */}
      <section className="pt-16 pb-10 lg:pt-24 lg:pb-16 bg-white relative"> {/* Changé le fond pour faire ressortir les blobs */}
        <DecorativeBlob className="w-80 h-80 -top-20 -left-32 opacity-20" color="bg-purple-200" />
        <DecorativeBlob className="w-96 h-96 -bottom-40 -right-40 opacity-20 transform rotate-45" color="bg-sky-200" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 lg:mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-6">
                    <HelpCircle className="w-8 h-8 text-teal-600" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
                    {t('faq.hero.title')}
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    {t('faq.hero.subtitle')}
                </p>
            </div>

            <div className="mb-10 lg:mb-12 max-w-2xl mx-auto">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                        type="search"
                        name="search-faq"
                        id="search-faq"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm shadow-sm"
                        placeholder={t('faq.searchPlaceholder')}
                    />
                </div>
            </div>
        </div>
      </section>

      {/* Contenu FAQ */}
      <section className="py-12 lg:py-16"> {/* Ajusté le padding top */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {filteredFaqCategories.length > 0 ? (
              filteredFaqCategories.map((category) => (
                <div key={category.id} className="mb-10">
                  <div className="flex items-center mb-6">
                    <category.Icon className="w-8 h-8 text-teal-600 mr-3" />
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">{category.title}</h2>
                  </div>
                  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl space-y-1">
                    {category.questions.map((item) => (
                      <AccordionItem
                        key={item.id}
                        title={item.question}
                        isOpen={openAccordion === item.id}
                        onToggle={() => handleToggle(item.id)}
                        tutorialLink={item.tutorialLink}
                      >
                        <p dangerouslySetInnerHTML={{ __html: item.answer }} />
                      </AccordionItem>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">{t('faq.noResults.title')}</h3>
                <p className="text-slate-500">{t('faq.noResults.message')}</p>
              </div>
            )}
          </div>

          {/* Section "Vous ne trouvez pas votre réponse ?" */}
          <div className="mt-16 text-center max-w-xl mx-auto p-8 bg-white rounded-xl shadow-xl border border-slate-200"> {/* Changé fond pour contraste */}
            <ShieldCheck className="w-12 h-12 text-teal-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-slate-800 mb-3">{t('faq.stillHaveQuestions.title')}</h3>
            <p className="text-slate-600 mb-6">
              {t('faq.stillHaveQuestions.subtitle')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 shadow-md transition-colors"
            >
              {t('faq.stillHaveQuestions.cta')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}