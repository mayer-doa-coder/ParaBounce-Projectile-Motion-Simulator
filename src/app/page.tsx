'use client';

import { useState } from 'react';
import ProjectileSimulator from '@/components/ProjectileSimulator';
import IntroPage from '@/components/intro/IntroPage';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true); // Set to true to show intro first

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroPage onComplete={handleIntroComplete} />;
  }

  return (
    <main>
      <ProjectileSimulator />
    </main>
  );
}
