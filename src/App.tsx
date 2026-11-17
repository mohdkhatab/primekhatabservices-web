import {MotionConfig} from 'motion/react';
import {Navbar} from './components/Navbar';
import {Hero} from './components/Hero';
import {TechStrip} from './components/TechStrip';
import {Services} from './components/Services';
import {WorkHighlights} from './components/WorkHighlights';
import {Process} from './components/Process';
import {Founder} from './components/Founder';
import {Faq} from './components/Faq';
import {Contact} from './components/Contact';
import {Footer} from './components/Footer';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#0F1419]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0F1419] focus:text-white focus:rounded-md focus:text-sm"
        >
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content" className="flex-1">
          <Hero />
          <TechStrip />
          <Services />
          <WorkHighlights />
          <Process />
          <Founder />
          <Faq />
          <Contact />
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}
