import React, { JSX, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Zap, Palette, Settings, Sparkles, Users, PackageCheck, Globe2, Gift, PlayCircle, Star, TrendingUp, Shield, Clock } from 'lucide-react';
import { Link } from '../../renderer/Link';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Swiper as SwiperType } from 'swiper/types';
import { getImg } from '../../Components/Utils/StringFormater';
import { AnimationCard } from '../anime/+Page';
import { useSResource } from '../../Components/Utils/useSResource';
import { ClientCall } from '../../Components/Utils/functions';
import { useWindowSize } from '../../Hooks/useWindowSize';

// SVG animé pour les blobs décoratifs avec plus de subtilités
const DecorativeBlob = ({ className, color = 'bg-teal-500', animate = true, fill }: { className?: string, color?: string, animate?: boolean, fill: string }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView && animate) {
      controls.start({
        scale: [1, 1.2, 0.9, 1.1, 1],
        rotate: [0, 15, -10, 20, 0],
        opacity: [0.2, 0.4, 0.3, 0.5, 0.3],
        transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
      });
    }
  }, [controls, inView, animate]);

  return (
    <motion.svg
      ref={ref}
      className={`absolute z-0 ${className}`}
      viewBox="0 0 200 200"
      animate={controls}
      initial={{ opacity: 0, scale: 0.8 }}
      style={{
        filter: `drop-shadow(0px 0px 40px ${fill}40)`,
      }}
    >
      <defs>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: fill, stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: fill, stopOpacity: 0.2 }} />
        </linearGradient>
      </defs>
      <path
        fill="url(#gradient)"
        filter="url(#blur)"
        d="M61.4,-63.9C77.5,-50.9,87.1,-31.3,87.5,-11.7C87.9,7.9,79.2,27.6,65.5,42.7C51.9,57.8,33.3,68.2,13.4,70.8C-6.5,73.4,-27.9,68.2,-44.7,56.2C-61.5,44.2,-73.7,25.4,-76.4,5.2C-79.1,-15,-72.2,-36.5,-57.8,-50.9C-43.4,-65.3,-21.7,-72.6,0.9,-73.7C23.5,-74.8,47,-69.6,61.4,-63.9Z"
        transform="translate(100 100)"
      />
    </motion.svg>
  );
};

// Particules flottantes pour plus de subtilité
const FloatingParticles = ({ count = 5 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-white/10 rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 20, -20, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
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
      className={`p-6 rounded-3xl shadow-lg transition-all duration-500 h-full ${bgColor} 
            backdrop-blur-sm border border-white/30 relative overflow-hidden cursor-pointer group
            ${isActive ? 'scale-105 shadow-2xl' : 'hover:scale-102 hover:shadow-xl'}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-teal-100/20 to-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${iconColor?.replace('text-', 'bg-').replace('600', '100')} shadow-lg`}>
          <Icon className={`w-7 h-7 ${iconColor} transition-all duration-300`} />
        </div>
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-2"
          >
            <PlayCircle className={`w-6 h-6 ${iconColor} animate-pulse`} />
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </motion.div>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-50 mb-3 relative z-10 group-hover:text-white transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-100/90 text-sm leading-relaxed relative z-10 group-hover:text-white transition-colors duration-300">
        {description}
      </p>

      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 relative z-10"
        >
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-teal-400 to-cyan-400 h-2 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
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
      videoUrl: '/res/video_features/video_4.webm',
      bgColor: 'bg-gradient-to-br from-teal-500/30 to-cyan-500/30',
      iconColor: 'text-teal-600',
      short: true,
    },
    {
      Icon: Settings,
      title: t('home.features.easyManagement.title'),
      description: t('home.features.easyManagement.description'),
      videoUrl: '/res/video_features/video_7.webm',
      bgColor: 'bg-gradient-to-br from-blue-500/30 to-indigo-500/30',
      iconColor: 'text-blue-600',
      short: true,
    },
    {
      Icon: Sparkles,
      title: t('home.features.arInnovation.title'),
      description: t('home.features.arInnovation.description'),
      videoUrl: '/res/video_features/video_4.webm',
      bgColor: 'bg-gradient-to-br from-purple-500/30 to-pink-500/30',
      iconColor: 'text-purple-600',
      short: true,
    },
    {
      Icon: Users,
      title: t('home.features.socialConnect.title'),
      description: t('home.features.socialConnect.description'),
      videoUrl: '/res/video_features/video_7.webm',
      bgColor: 'bg-gradient-to-br from-pink-500/30 to-rose-500/30',
      iconColor: 'text-pink-600'
    },
    {
      Icon: PackageCheck,
      title: t('home.features.localPayments.title'),
      description: t('home.features.localPayments.description'),
      videoUrl: '/res/video_features/video_4.webm',
      bgColor: 'bg-gradient-to-br from-green-500/30 to-emerald-500/30',
      iconColor: 'text-green-600'
    },
    {
      Icon: Globe2,
      title: t('home.features.globalReach.title'),
      description: t('home.features.globalReach.description'),
      videoUrl: '/res/video_features/video_7.webm',
      bgColor: 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30',
      iconColor: 'text-yellow-600'
    },
  ];

  const steps = [
    {
      number: "01",
      title: t('home.howItWorks.step1.title'),
      description: t('home.howItWorks.step1.description'),
      icon: Star,
      color: "from-teal-400 to-cyan-400"
    },
    {
      number: "02",
      title: t('home.howItWorks.step2.title'),
      description: t('home.howItWorks.step2.description'),
      icon: Palette,
      color: "from-blue-400 to-indigo-400"
    },
    {
      number: "03",
      title: t('home.howItWorks.step3.title'),
      description: t('home.howItWorks.step3.description'),
      icon: TrendingUp,
      color: "from-purple-400 to-pink-400"
    },
    {
      number: "04",
      title: t('home.howItWorks.step4.title'),
      description: t('home.howItWorks.step4.description'),
      icon: Globe2,
      color: "from-green-400 to-emerald-400"
    },
  ];

  const size = useWindowSize()
  const fs = size.width < 768 ? features.filter((f) => f.short) : features;

  const [s] = useState({
    features
  })
  s.features = fs;
  const imageRef = useRef<HTMLDivElement>(null)

  const { data: featureVideoUrl } = useSResource(s.features[currentVideoIndex].videoUrl, {
    type: 'video'
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
        const nextIndex = (prev + 1) % s.features.length;
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
      {/* Section Héros améliorée */}
      <section className="top-welcome relative pt-20 pb-24 lg:pt-32 lg:pb-36 bg-gradient-to-br from-slate-50 via-blue-50 to-sky-100">
        <FloatingParticles count={8} />
        <DecorativeBlob fill='#059669' className="w-72 h-72 -top-10 -left-20" />
        <DecorativeBlob fill='#D97706' className="w-48 h-48 top-1/2 left-1/4 transform -translate-y-1/2" />
        <DecorativeBlob fill='#7C3AED' className="w-56 h-56 top-20 right-10" />

        <div className="container mx-auto relative">
          <div className="w-full p-4 lg:grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center lg:text-left"
            >
              <motion.span
                className="inline-block px-4 py-2 text-xs font-bold text-teal-700 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full mb-6 uppercase tracking-wider shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                ✨ {t('home.hero.tagline')}
              </motion.span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
                {t('home.hero.title.line1')}
                <span className="block bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {t('home.hero.title.line2')}
                </span>
              </h1>

              <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t('home.hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="https://dash.sublymus.com"
                    className="inline-flex items-center justify-center py-4 border border-transparent text-base font-bold rounded-2xl text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <span className='inline-flex  items-center'>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Créez votre boutique
                    </span>
                    <span className='inline-flex  items-center'>
                      gratuitement
                      <ArrowRight className="inline ml-2 w-5 h-5" />
                    </span>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="#features"
                    className="inline-flex items-center justify-center px-6 py-4 border border-slate-300 text-base font-bold rounded-2xl text-slate-700 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-300"
                  >
                    {t('home.hero.ctaSecondary')}
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -50 }}
              className="relative w-[100vw] sx:w-full"
            >
              <div ref={imageRef} className="w-[100vw] sx:w-full scale-120 sx:scale-100 flex items-center justify-center">
                <AnimationCard parentRef={imageRef} factor={1} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités avec plus de subtilités */}
      <section id="features" className="features py-16 lg:py-24 bg-white relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="absolute inset-0 w-full h-full object-cover"
          src={featureVideoUrl || ''}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/30"></div>
        <FloatingParticles count={12} />

        <div className="container mx-auto px-2 sx:p-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 drop-shadow-lg">
              {t('home.whySublymus.title')}
            </h2>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto drop-shadow-md">
              {t('home.whySublymus.subtitle')}
            </p>
          </motion.div>

          <div className="md:hidden">
            <div className="flex flex-col gap-6 h-[calc(3*16rem)] sx:h-[calc(3*14rem)]">
              {fs.map((feature, index) => (
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

      {/* Section Problème avec design amélioré */}
      <section className="problemes py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl shadow-2xl aspect-[4/3] sm:aspect-video lg:aspect-[4/3] flex items-center justify-center overflow-hidden"
                style={{
                  background: getImg('/res/img/photo_5258017621280946394_y.jpg')
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-purple-500/20"></div>
              </div>
              <DecorativeBlob fill='#DB2777' className="w-32 h-32 -bottom-6 -left-6 opacity-60" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.span
                className="inline-block px-4 py-2 text-xs font-bold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4 uppercase tracking-wider shadow-md"
                whileHover={{ scale: 1.05 }}
              >
                🎯 {t('home.problem.tagline')}
              </motion.span>

              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6 leading-tight">
                {t('home.problem.title')}
              </h2>

              <ul className="space-y-4 text-slate-600 mb-6">
                <motion.li
                  className="flex items-start group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <span className="group-hover:text-slate-800 transition-colors">{t('home.problem.point1')}</span>
                </motion.li>

                <motion.li
                  className="flex items-start group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <span className="group-hover:text-slate-800 transition-colors">{t('home.problem.point2')}</span>
                </motion.li>

                <motion.li
                  className="flex items-start group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <span className="group-hover:text-slate-800 transition-colors">{t('home.problem.point3')}</span>
                </motion.li>
              </ul>

              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-2xl border-l-4 border-teal-500 shadow-md">
                <p className="text-slate-700 leading-relaxed">
                  {t('home.problem.solutionIntro')}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
                    {' '}Sublymus{' '}
                  </span>
                  {t('home.problem.solutionOutro')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche avec design amélioré */}
      <section className="step-by-step py-16 lg:py-24 bg-white relative overflow-hidden">
        <FloatingParticles count={6} />
        <DecorativeBlob fill='#2563EB' className="w-96 h-96 -top-32 -right-32 transform rotate-12 opacity-30" />
        <DecorativeBlob fill='#9333EA' className="w-72 h-72 bottom-0 -left-20 opacity-30" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('home.howItWorks.subtitle')}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                <div className="flex flex-col items-center text-center relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  <span className={`text-4xl font-black mb-4 bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                    {step.number}
                  </span>

                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed group-hover:text-slate-700 transition-colors">
                    {step.description}
                  </p>
                </div>

                {/* Effet de brillance */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Tarification améliorée */}
      <section className="tarification py-16 lg:py-24 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white relative overflow-hidden">
        <FloatingParticles count={10} />
        <DecorativeBlob fill='#ffffff' className="w-64 h-64 top-10 right-10 opacity-10" />
        <DecorativeBlob fill='#ffffff' className="w-48 h-48 bottom-10 left-10 opacity-10" />

        <div className="container mx-auto px-2 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-black mb-6 drop-shadow-lg">
              {t('home.pricingSimplified.title')}
            </h2>
            <p className="text-lg text-teal-100 mb-10 max-w-3xl mx-auto drop-shadow-md">
              {t('home.pricingSimplified.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/20 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-teal-300 mr-2" />
                  <h3 className="text-2xl font-bold">{t('home.pricingSimplified.free.title')}</h3>
                </div>

                <p className="text-5xl font-black mb-2">
                  0€
                </p>
                <p className="text-teal-200 mb-6 text-sm font-medium">
                  {t('home.pricingSimplified.free.forever')}
                </p>

                <p className="text-teal-100 mb-6 text-sm leading-relaxed">
                  {t('home.pricingSimplified.free.description')}
                </p>

                <ul className="space-y-3 text-left mb-8 text-sm">
                  <li className="flex items-center">
                    <PackageCheck className="w-5 h-5 text-teal-300 mr-3 flex-shrink-0" />
                    <span>{t('home.pricingSimplified.free.feature1')}</span>
                  </li>
                  <li className="flex items-center">
                    <PackageCheck className="w-5 h-5 text-teal-300 mr-3 flex-shrink-0" />
                    <span>{t('home.pricingSimplified.free.feature2')}</span>
                  </li>
                  <li className="flex items-center">
                    <PackageCheck className="w-5 h-5 text-teal-300 mr-3 flex-shrink-0" />
                    <span>{t('home.pricingSimplified.free.feature3')}</span>
                  </li>
                </ul>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="https://dash.sublymus.com"
                    className="w-full inline-flex items-center justify-center py-4 px-6 border border-transparent text-base font-bold rounded-2xl text-teal-700 bg-white hover:bg-teal-50 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    {t('home.pricingSimplified.free.cta')}
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-yellow-300/30 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-yellow-300 mr-2" />
                  <h3 className="text-2xl font-bold">{t('home.pricingSimplified.premium.title')}</h3>
                  <div className="ml-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                    POPULAIRE
                  </div>
                </div>

                <p className="text-5xl font-black mb-2">
                  {t('home.pricingSimplified.premium.price')}
                </p>
                <p className="text-yellow-200 mb-6 text-sm font-medium">
                  / {t('common.month')}
                </p>

                <p className="text-yellow-100 mb-6 text-sm leading-relaxed">
                  {t('home.pricingSimplified.premium.description')}
                </p>

                <ul className="space-y-3 text-left mb-8 text-sm">
                  <li className="flex items-center">
                    <Sparkles className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span>{t('home.pricingSimplified.premium.feature1')}</span>
                  </li>
                  <li className="flex items-center">
                    <Sparkles className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span>{t('home.pricingSimplified.premium.feature2')}</span>
                  </li>
                  <li className="flex items-center">
                    <Settings className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span>{t('home.pricingSimplified.premium.feature3')}</span>
                  </li>
                  <li className="flex items-center">
                    <Users className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    <span>{t('home.pricingSimplified.premium.feature4')}</span>
                  </li>
                </ul>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="https://dash.sublymus.com"
                    className="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-bold rounded-2xl text-slate-800 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    {t('home.pricingSimplified.premium.cta')}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section finale supprimée conformément à la demande */}
    </div>
  );
} 