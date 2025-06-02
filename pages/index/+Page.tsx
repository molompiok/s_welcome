import React, { JSX, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Zap, Palette, Settings, Sparkles, Users, PackageCheck, Globe2, Gift, PlayCircle } from 'lucide-react';
import { Link } from '../../renderer/Link';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Swiper as SwiperType } from 'swiper/types';
import { getImg } from '../../Components/Utils/StringFormater';
import { AnimationCard } from '../anime/+Page';
import { useSResource } from '../../Components/Utils/useSResource';

// SVG animé pour les blobs décoratifs

const DecorativeBlob = ({ className, color = 'bg-teal-500', animate = true, fill }: { className?: string, color?: string, animate?: boolean, fill: string }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView && animate) {
      controls.start({
        scale: [1, 1.15, 1],
        rotate: [0, 10, -10, 0],
        opacity: [0.3, 0.5, 0.3],
        transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
      });
    }
  }, [controls, inView, animate]);


  return (
    <motion.svg
      ref={ref}
      className={`absolute z-0 ${className} `}
      viewBox="0 0 200 200"
      animate={controls}
      initial={{ opacity: 0, scale: 0.8 }}
      style={{
        filter: `drop-shadow(0px 0px 60px  ${fill})`,
      }}
    >
      <defs>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>
      </defs>
      <path

        fill={`${fill}`} // Translucent fill for glass effect
        fillOpacity="1"
        filter="url(#blur)"
        d="M61.4,-63.9C77.5,-50.9,87.1,-31.3,87.5,-11.7C87.9,7.9,79.2,27.6,65.5,42.7C51.9,57.8,33.3,68.2,13.4,70.8C-6.5,73.4,-27.9,68.2,-44.7,56.2C-61.5,44.2,-73.7,25.4,-76.4,5.2C-79.1,-15,-72.2,-36.5,-57.8,-50.9C-43.4,-65.3,-21.7,-72.6,0.9,-73.7C23.5,-74.8,47,-69.6,61.4,-63.9Z"
        transform="translate(100 100)"
      />
    </motion.svg>
  );
};

// Interface for feature card props
interface FeatureCardProps {
  Icon: React.ElementType;
  title: string;
  description: string;
  iconColor?: string;
  bgColor?: string;
  videoUrl?: string,
  isActive?: boolean,
  onClick?: () => void,
  progress?: number
}

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, description, iconColor, bgColor, videoUrl, isActive, onClick, progress }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (inView) {
      controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' },
      });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={controls}
      onClick={onClick}
      className={`p-6 rounded-2xl shadow-lg transition-all duration-300 h-full ${bgColor} 
            backdrop-blur-sm border border-white/20 relative overflow-hidden cursor-pointer ${isActive ? 'scale-105' : ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-purple-100 opacity-0 transition-opacity duration-300"></div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColor?.replace('text-', 'bg-').replace('600', '100')}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {isActive && (
          <PlayCircle className={`w-6 h-6 ${iconColor} animate-pulse`} />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-50 mb-2 relative z-10">{title}</h3>
      <p className="text-gray-50 text-sm leading-relaxed relative z-10">{description}</p>
      {isActive && (
        <div className="mt-4 relative z-10">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </motion.div>
  );
};





export default function HomePage() {
  const { t } = useTranslation();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const swiperRef = useRef<SwiperType>(null);

  const features = [
    {
      Icon: Palette,
      title: t('home.features.customDesign.title'),
      description: t('home.features.customDesign.description'),
      videoUrl: '/res/video_features/video_1.webm',
      bgColor: 'bg-teal-100/30',
      iconColor: 'text-teal-600'
    },
    {
      Icon: Settings,
      title: t('home.features.easyManagement.title'),
      description: t('home.features.easyManagement.description'),
      videoUrl: '/res/video_features/video_2.webm',
      bgColor: 'bg-blue-100/30',
      iconColor: 'text-blue-600'
    },
    {
      Icon: Sparkles,
      title: t('home.features.arInnovation.title'),
      description: t('home.features.arInnovation.description'),
      videoUrl: '/res/video_features/video_3.webm',
      bgColor: 'bg-purple-100/30',
      iconColor: 'text-purple-600'
    },
    {
      Icon: Users,
      title: t('home.features.socialConnect.title'),
      description: t('home.features.socialConnect.description'),
      videoUrl: '/res/video_features/video_4.webm',
      bgColor: 'bg-pink-100/30',
      iconColor: 'text-pink-600'
    },
    {
      Icon: PackageCheck,
      title: t('home.features.localPayments.title'),
      description: t('home.features.localPayments.description'),
      videoUrl: '/res/video_features/video_5.webm',
      bgColor: 'bg-green-100/30',
      iconColor: 'text-green-600'
    },
    {
      Icon: Globe2,
      title: t('home.features.globalReach.title'),
      description: t('home.features.globalReach.description'),
      videoUrl: '/res/video_features/video_6.webm',
      bgColor: 'bg-yellow-100/30',
      iconColor: 'text-yellow-600'
    },
  ];

  const steps = [
    {
      number: "01",
      title: t('home.howItWorks.step1.title'),
      description: t('home.howItWorks.step1.description'),
    },
    {
      number: "02",
      title: t('home.howItWorks.step2.title'),
      description: t('home.howItWorks.step2.description'),
    },
    {
      number: "03",
      title: t('home.howItWorks.step3.title'),
      description: t('home.howItWorks.step3.description'),
    },
    {
      number: "04",
      title: t('home.howItWorks.step4.title'),
      description: t('home.howItWorks.step4.description'),
    },
  ];

  const imageRef = useRef<HTMLDivElement>(null)

  const { data:featureVideoUrl} = useSResource(features[currentVideoIndex].videoUrl,{
    type:'video'
  })

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    };

    const handleEnded = () => {
      setCurrentVideoIndex((prev) => {
        const nextIndex = (prev + 1) % features.length;
        if (swiperRef.current) {
          swiperRef.current.slideToLoop(nextIndex);
        }
        return nextIndex;
      });
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentVideoIndex]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [currentVideoIndex]);

  const handleCardClick = (index: number) => {
    setCurrentVideoIndex(index);
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index);
    }
  };

  const handleSlideChange = (swiper: any) => {
    setCurrentVideoIndex(swiper.realIndex);
  };

  return (
    <div className="overflow-hidden max-w-[100vw]">
      {/* Section Héros */}
      <section className=" top-welcome relative pt-20 pb-24 lg:pt-32 lg:pb-36 bg-gradient-to-br from-slate-50 to-sky-100">
        <DecorativeBlob fill='#059669' className="w-64 h-64 -top-10 -left-20" color="bg-purple-400" />
        {/* <DecorativeBlob className="w-80 h-80 -bottom-20 -right-20 transform rotate-45" color="bg-teal-400" /> */}
        <DecorativeBlob fill='#D97706' className="w-40 h-40 top-1/2 left-1/4 transform -translate-y-1/2" color="bg-yellow-400" />

        <div className="container mx-auto  relative">
          <div className="w-full p-4 sx:grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center lg:text-left"
            >
              <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full mb-4 uppercase tracking-wider transform transition-transform duration-300 hover:scale-110">
                {t('home.hero.tagline')}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight ">
                {t('home.hero.title.line1')}
                <span className="block text-teal-600">{t('home.hero.title.line2')}</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/preinscription"
                  className="inline-flex items-center justify-center px-2 sx:px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {t('home.hero.ctaPrimary')} <ArrowRight className="inline ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center px-2 sx:px-4 py-3 border border-slate-300 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {t('home.hero.ctaSecondary')}
                </Link>
              </div>
            </motion.div>

            <motion.div
            initial={{ x: -50 }}
              className="relative w-[100vw] sx:w-full"
            >
              <div ref={imageRef} className="w-[100vw] sx:w-full scale-120 sx:scale-100 flex items-center justify-center ">
                <AnimationCard parentRef={imageRef} factor={1}/>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités Clés */}
      <section id="features" className=" features py-16 lg:py-24 bg-white relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="absolute inset-0 w-full h-full object-cover"
          src={featureVideoUrl||''}
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-2 sx:p-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-50 mb-4">{t('home.whySublymus.title')}</h2>
            <p className="text-lg text-gray-50 max-w-2xl mx-auto">{t('home.whySublymus.subtitle')}</p>
          </motion.div>
          <div className="md:hidden">
            <Swiper
              direction="vertical"
              loop={true}
              slidesPerView={3}
              centeredSlides={true}
              spaceBetween={20}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={handleSlideChange}
              className="h-[calc(3*16rem)] sx:h-[calc(3*14rem)]"
            >
              {features.map((feature, index) => (
                <SwiperSlide key={index}>
                  <FeatureCard
                    Icon={feature.Icon}
                    title={feature.title}
                    description={feature.description}
                    iconColor={feature.iconColor}
                    bgColor={feature.bgColor}
                    videoUrl={feature.videoUrl}
                    isActive={index === currentVideoIndex}
                    onClick={() => handleCardClick(index)}
                    progress={index === currentVideoIndex ? progress : 0}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                Icon={feature.Icon}
                title={feature.title}
                description={feature.description}
                iconColor={feature.iconColor}
                bgColor={feature.bgColor}
                videoUrl={feature.videoUrl}
                isActive={index === currentVideoIndex}
                onClick={() => handleCardClick(index)}
                progress={index === currentVideoIndex ? progress : 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section Problème Résolu */}
      <section className="problemes py-16 lg:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-slate-200 rounded-xl shadow-lg aspect-[4/3] sm:aspect-video lg:aspect-[4/3] flex items-center justify-center" 
              style={{
                background:getImg('/res/img/photo_5258017621280946394_y.jpg')
              }}
              >
              </div>
              {/* <DecorativeBlob fill='#DB2777' className="w-48 h-48 -bottom-10 -left-10" color="bg-sky-300" /> */}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full mb-3 uppercase tracking-wider transform transition-transform duration-300 hover:scale-110">
                {t('home.problem.tagline')}
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">{t('home.problem.title')}</h2>
              <ul className="space-y-4 text-slate-600">
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                  <span>{t('home.problem.point1')}</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                  <span>{t('home.problem.point2')}</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                  <span>{t('home.problem.point3')}</span>
                </li>
              </ul>
              <p className="mt-6 text-slate-600">
                {t('home.problem.solutionIntro')} <span className="font-semibold text-teal-600">Sublymus</span>{' '}
                {t('home.problem.solutionOutro')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="step-by-step py-16 lg:py-24 bg-white relative">
        <DecorativeBlob fill='#2563EB' className="w-96 h-96 -top-32 -right-32 transform rotate-12" color="bg-purple-300" />
        <DecorativeBlob fill='#9333EA' className="w-72 h-72 bottom-0 -left-20" color="bg-yellow-300" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{t('home.howItWorks.title')}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t('home.howItWorks.subtitle')}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                className="bg-slate-50 p-6 rounded-xl shadow-md transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-yellow-100 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="flex items-center mb-4 relative z-10">
                  <span className="text-4xl font-bold text-teal-500 mr-4">{step.number}</span>
                  <h3 className="text-xl font-semibold text-slate-800">{step.title}</h3>
                </div>
                <p className="text-slate-600 text-sm relative z-10">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Tarification */}
      <section className="tarification py-16 lg:py-24 bg-gradient-to-br from-teal-600 to-sky-700 text-white">
        <div className="container mx-auto px-2 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">{t('home.pricingSimplified.title')}</h2>
            <p className="text-lg text-teal-100 mb-10 max-w-3xl mx-auto">{t('home.pricingSimplified.subtitle')}</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md p-2  sx:p-8 rounded-xl shadow-xl border border-white/20"
            >
              <h3 className="text-2xl font-semibold mb-2">{t('home.pricingSimplified.free.title')}</h3>
              <p className="text-4xl font-bold mb-4">
                0 <span className="text-base font-normal text-teal-200">{t('home.pricingSimplified.free.forever')}</span>
              </p>
              <p className="text-teal-200 mb-6 text-sm">{t('home.pricingSimplified.free.description')}</p>
              <ul className="space-y-2 text-left mb-8 text-sm">
                <li className="flex items-center">
                  <PackageCheck className="w-5 h-5 text-teal-300 mr-2" /> {t('home.pricingSimplified.free.feature1')}
                </li>
                <li className="flex items-center">
                  <PackageCheck className="w-5 h-5 text-teal-300 mr-2" /> {t('home.pricingSimplified.free.feature2')}
                </li>
                <li className="flex items-center">
                  <PackageCheck className="w-5 h-5 text-teal-300 mr-2" /> {t('home.pricingSimplified.free.feature3')}
                </li>
              </ul>
              <Link
                href="/preinscription"
                className="w-full inline-flex mt-auto items-center justify-center  py-3 border border-transparent text-base font-medium rounded-md text-teal-700 bg-white hover:bg-teal-50 transition-colors duration-300 transform hover:scale-105"
              >
                {t('home.pricingSimplified.free.cta')}
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md p-2  sx:p-8 rounded-xl shadow-xl border border-white/20"
            >
              <h3 className="text-2xl font-semibold mb-2">{t('home.pricingSimplified.premium.title')}</h3>
              <p className="text-4xl font-bold mb-4">
                {t('home.pricingSimplified.premium.price')}{' '}
                <span className="text-base font-normal text-teal-200">/ {t('common.month')}</span>
              </p>
              <p className="text-teal-200 mb-6 text-sm">{t('home.pricingSimplified.premium.description')}</p>
              <ul className="space-y-2 text-left mb-8 text-sm">
                <li className="flex items-center">
                  <Sparkles className="w-5 h-5 text-yellow-300 mr-2" /> {t('home.pricingSimplified.premium.feature1')}
                </li>
                <li className="flex items-center">
                  <Sparkles className="w-5 h-5 text-yellow-300 mr-2" /> {t('home.pricingSimplified.premium.feature2')}
                </li>
                <li className="flex items-center">
                  <Settings className="w-5 h-5 text-yellow-300 mr-2" /> {t('home.pricingSimplified.premium.feature3')}
                </li>
                <li className="flex items-center">
                  <Users className="w-5 h-5 text-yellow-300 mr-2" /> {t('home.pricingSimplified.premium.feature4')}
                </li>
              </ul>
              <Link
                href="/preinscription"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-slate-800 bg-yellow-400 hover:bg-yellow-500 transition-colors duration-300 transform hover:scale-105"
              >
                {t('home.pricingSimplified.premium.cta')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="cree-ton-compte  relative  py-16 lg:py-24 bg-slate-50">
        {/* <DecorativeBlob className="w-52 h-52 top-0 left-10 transform -translate-y-1/2" color="bg-teal-300" /> */}
        <DecorativeBlob fill='#319795' className="w-60 h-60 bottom-0 right-10 transform translate-y-1/2 rotate-45" color="bg-purple-300" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{t('home.ctaBottom.title')}</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">{t('home.ctaBottom.subtitle')}</p>
            <div
              className="inline-flex items-center  px-2  py-4 border border-transparent text-lg font-medium rounded-lg hover:text-white text-white bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 "
            >
              <Link href="/preinscription" className=' hover:text-white text-white hover:bg-teal-700 bg-teal-600'>
              {t('home.ctaBottom.cta')} <Gift className="inline ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}