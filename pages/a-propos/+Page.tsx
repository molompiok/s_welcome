// pages/a-propos/+Page.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Target, Users, Rocket, Building, Handshake } from 'lucide-react';

// Placeholder pour les SVGs décoratifs
const DecorativeBlob = ({ className, color = 'bg-teal-500' }: { className?: string; color?: string }) => (
  <div className={`absolute rounded-full opacity-10 -z-10 ${color} ${className}`}></div>
);

interface TeamMemberProps {
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  linkedinUrl?: string; // Optionnel
}

const TeamMemberCard: React.FC<TeamMemberProps> = ({ name, role, imageUrl, bio, linkedinUrl }) => {
  return (
    <div className="text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <img
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover ring-4 ring-teal-200"
        src={imageUrl}
        alt={name}
      />
      <h3 className="text-xl font-semibold text-slate-800 mb-1">{name}</h3>
      <p className="text-teal-600 font-medium text-sm mb-3">{role}</p>
      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{bio}</p>
      {linkedinUrl && (
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700 hover:underline"
        >
          Profil LinkedIn <Rocket className="w-4 h-4 ml-1" />
        </a>
      )}
    </div>
  );
};

export default function AboutPage() {
  const { t } = useTranslation();

  // Informations sur l'équipe - TU DEVRAS METTRE TES VRAIES INFOS ET PHOTOS
  const teamMembers: TeamMemberProps[] = [
    {
      name: "Kouassi Noga Wilfried Lemuel",
      role: t('about.team.role.fullstack'),
      imageUrl: "https://i.pravatar.cc/200?u=wilfried", // REMPLACER PAR VRAIE PHOTO
      bio: t('about.team.wilfried.bio'),
      // linkedinUrl: "#" // REMPLACER PAR VRAI LIEN
    },
    {
      name: "Messah Komlan Simeon",
      role: t('about.team.role.fullstack'),
      imageUrl: "https://i.pravatar.cc/200?u=simeon", // REMPLACER PAR VRAIE PHOTO
      bio: t('about.team.simeon.bio'),
      // linkedinUrl: "#" // REMPLACER PAR VRAI LIEN
    },
  ];

  const values = [
    { Icon: Lightbulb, title: t('about.values.innovation.title'), description: t('about.values.innovation.description') },
    { Icon: Users, title: t('about.values.accessibility.title'), description: t('about.values.accessibility.description') },
    { Icon: Building, title: t('about.values.localAdaptation.title'), description: t('about.values.localAdaptation.description') },
    { Icon: Handshake, title: t('about.values.impact.title'), description: t('about.values.impact.description') },
  ];


  return (
    <div className="bg-slate-50">
      {/* Section Héros de la page À Propos */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-teal-600 to-sky-700 text-white text-center">
        <DecorativeBlob className="w-72 h-72 -top-10 -left-20 opacity-20" color="bg-sky-400" />
        <DecorativeBlob className="w-80 h-80 -bottom-20 -right-10 opacity-20 transform rotate-45" color="bg-purple-400" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">{t('about.hero.title')}</h1>
          <p className="text-xl lg:text-2xl text-teal-100 max-w-3xl mx-auto">
            {t('about.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Section Notre Histoire */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full mb-3 uppercase tracking-wider">
                {t('about.story.tagline')}
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                {t('about.story.title')}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                {t('about.story.paragraph1')}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {t('about.story.paragraph2')}
              </p>
            </div>
            <div className="relative order-first lg:order-last">
              {/* Placeholder pour une image illustrant l'équipe ou le concept */}
              <div className="bg-slate-200 rounded-xl shadow-xl aspect-video lg:aspect-[4/3] flex items-center justify-center">
                <p className="text-slate-500 p-8 text-center">{t('about.story.imagePlaceholder')}</p>
              </div>
              <DecorativeBlob className="w-40 h-40 -bottom-10 -right-10" color="bg-yellow-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Section Mission & Vision */}
      <section className="py-16 lg:py-24 bg-white">
        <DecorativeBlob className="w-96 h-96 -top-40 -left-32 opacity-5" color="bg-teal-400" />
        <DecorativeBlob className="w-72 h-72 -bottom-32 -right-20 opacity-5" color="bg-purple-400" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Mission */}
            <div className="bg-slate-50 p-8 rounded-xl shadow-lg border-l-4 border-teal-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <Lightbulb className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-800">{t('about.mission.title')}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {t('about.mission.text')}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-slate-50 p-8 rounded-xl shadow-lg border-l-4 border-sky-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-800">{t('about.vision.title')}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {t('about.vision.text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Nos Valeurs */}
        <section className="py-16 lg:py-24 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                        {t('about.values.title')}
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {t('about.values.subtitle')}
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                                <value.Icon className="w-8 h-8 text-teal-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">{value.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

      {/* Section L'Équipe (Optionnelle, à commenter si non désirée) */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {t('about.team.title')}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {teamMembers.map((member) => (
              <TeamMemberCard
                key={member.name}
                name={member.name}
                role={member.role}
                imageUrl={member.imageUrl}
                bio={member.bio}
                linkedinUrl={member.linkedinUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section Appel à l'Action */}
      <section className="py-16 lg:py-24 bg-teal-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {t('about.cta.title')}
          </h2>
          <p className="text-lg text-teal-100 mb-10 max-w-2xl mx-auto">
            {t('about.cta.subtitle')}
          </p>
          <a // Changé en <a> car c'est un lien externe pour l'instant
            href={t('about.cta.contactLink')} // Utilisez un mailto: ou le lien vers la page contact
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-teal-700 bg-white hover:bg-teal-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {t('about.cta.buttonText')} <Rocket className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
}