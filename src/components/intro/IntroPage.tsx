'use client';

import { useState, useEffect } from 'react';

interface IntroPageProps {
  onComplete: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(-1); // Start with -1 for cannon animation
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [showCannonAnimation, setShowCannonAnimation] = useState(true);

  const teamMembers = [
    'Tawhidul Hasan',
    'Arka Braja Prasad Nath',
    'Sarwad Hossain Siddiqui',
    'Shormi Ghosh',
    'Adiba Tahsin',
  ];

  const slogans = ['Launch.', 'Observe.', 'Learn.'];

  // Step progression
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep === -1) {
        // After cannon animation, hide it and start intro
        setShowCannonAnimation(false);
        setCurrentStep(0);
      } else if (currentStep === 0) {
        setCurrentStep(1); // Show slogan typing
      }
    }, currentStep === -1 ? 2600 : 500); // 2.6 seconds for cannon animation (slightly after 2.5s animation)

    return () => clearTimeout(timer);
  }, [currentStep]);

  // Typewriter effect
  useEffect(() => {
    if (currentStep === 1 && currentWordIndex < slogans.length) {
      const word = slogans[currentWordIndex];
      if (currentCharIndex < word.length) {
        const typer = setTimeout(() => {
          const updated = [...typedWords];
          updated[currentWordIndex] = (updated[currentWordIndex] || '') + word[currentCharIndex];
          setTypedWords(updated);
          setCurrentCharIndex((prev) => prev + 1);
        }, 100);
        return () => clearTimeout(typer);
      } else {
        // Move to next word
        const next = setTimeout(() => {
          setCurrentWordIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }, 300);
        return () => clearTimeout(next);
      }
    } else if (currentWordIndex === slogans.length && currentStep === 1) {
      // Wait a moment after typing is complete, then show "Get Started" button and subtitle
      setTimeout(() => {
        setShowGetStarted(true);
        setCurrentStep(2);
      }, 800);
    }
  }, [currentCharIndex, currentWordIndex, currentStep, typedWords]);

  // Handle transition from subtitle to team members
  useEffect(() => {
    if (currentStep === 2) {
      // Wait a moment then show team members
      const timer = setTimeout(() => setCurrentStep(3), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="fixed inset-0 bg-black flex items-start justify-center z-50 overflow-hidden font-squid-body pt-8">

      <div className="absolute inset-0">
        <img src="/images/bg.png" alt="Background" className="w-full h-full object-cover animate-fadeIn"/>
       
      </div>

      {/* Cannon Animation */}
      {showCannonAnimation && (
        <div className="cannon-animation">
          <div className="cannon-container">
            <img 
              src="/images/squid_cannon.png" 
              alt="Cannon" 
              className="cannon"
            />
            <img 
              src="/images/squid_projectile.png" 
              alt="Projectile" 
              className="projectile"
            />
          </div>
        </div>
      )}

      {/* after cannon animation */}
      {!showCannonAnimation && (
        <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
        {/* Title */}
        <div
          className={`transition-all duration-1000 ease-out ${
            currentStep >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <img 
          src="/images/app_icon.png"
          alt="parabounce Logo" 
          className="app-logo mx-auto"
          // style={{ animation: 'pulse 2s ease-in-out infinite' }}
        />
         <img 
          src="/images/paraBounce.png"   
          alt="parabounce" 
          className="app-name-img mx-auto"
          style={{ animation: 'fadeInSmooth 1.5s ease-out' }}
        />  
        </div>

        {/* Slogan Typewriter */}
        <div
          className={`transition-all duration-1000 ease-out mt-4 ${
            currentStep >= 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-white text-2xl font-bold typed-slogan font-squid-title">
            {typedWords.join(' ')}
            {currentWordIndex < slogans.length && <span className="animate-blink">|</span>}
          </p>
        </div>

        {/* Get Started Button - appears after slogans */}
        <div
          className={`transition-opacity duration-1000 ease-out mt-8 ${
            showGetStarted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={onComplete}
            className="cursor-pointer text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-squid-title"
            style={{ 
              background: 'linear-gradient(135deg, #f44589 0%, #943248 100%)',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #f44589 0%, #943248 100%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #f44589 0%, #943248 100%)';
            }}
          >
            Get Started
          </button>
        </div>

        {/* Subtitle */}
        <div
          className={`transition-all duration-1000 ease-out delay-100 mt-6 ${
            currentStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-3xl md:text-4xl text-white mb-4 font-normal transition duration-300 hover:text-yellow-300 squid_font">
           {/* <img src="https://fontmeme.com/temporary/4c02285a9e89bf80dd4cdc3654119a75.png" alt="" /> */}
          By Team KUET_KOBE_KHULBE
          </p>
        </div>

        {/* Team Members */}
        <div
  className={`transition-all duration-1000 ease-out delay-1000 mt-20 ${
    currentStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
  }`}
>

          <h3 className="text-2xl md:text-2xl text-white mb-3 font-bold  font-squid-title">
            Team Members
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 justify-center">
            {teamMembers.slice(0, 3).map((member, index) => (
              <div
                key={member}
                className="card-cartoon-compact transition-all duration-500 ease-out"
                style={{ 
                  animationDelay: `${(index + 1) * 200}ms`,
                  transitionDelay: `${(index + 1) * 150}ms`
                }}
              >
                <div className="text-xs font-bold text-white text-center tracking-wide font-squid-title">
                  {member}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-3">
            {teamMembers.slice(3).map((member, index) => (
              <div
                key={member}
                className="card-cartoon-compact transition-all duration-500 ease-out"
                style={{ 
                  animationDelay: `${(index + 4) * 200}ms`,
                  transitionDelay: `${(index + 4) * 150}ms`
                }}
              >
                <div className="text-xs font-bold text-white text-center tracking-wide font-squid-title">
                  {member}
                </div>
              </div>
            ))}
          </div>
        </div>
  
        </div>
      )}

    </div>
  );
};

export default IntroPage;
