import {useEffect, useState} from 'react';
import {MotionConfig} from 'motion/react';
import {Navbar} from './components/Navbar';
import {Hero} from './components/Hero';
import {TechStrip} from './components/TechStrip';
import {Services} from './components/Services';
import {About} from './components/About';
import {WorkHighlights} from './components/WorkHighlights';
import {Process} from './components/Process';
import {Founder} from './components/Founder';
import {Faq} from './components/Faq';
import {Contact} from './components/Contact';
import {Footer} from './components/Footer';
import {PrivacyPage} from './components/PrivacyPage';
import {TermsPage} from './components/TermsPage';

type AppRoute = '/' | '/privacy' | '/terms';

const HOME_TITLE =
  'Prime Khatab Services — App Development, Web Development & AI Solutions | Rajouri, J&K, India';

function normalizePath(pathname: string): AppRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/privacy') return '/privacy';
  if (clean === '/terms') return '/terms';
  return '/';
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() =>
    normalizePath(window.location.pathname)
  );

  useEffect(() => {
    const handlePopState = () => {
      setRoute(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (route === '/privacy') {
      document.title = 'Privacy Policy — Prime Khatab Services';
    } else if (route === '/terms') {
      document.title = 'Terms of Service — Prime Khatab Services';
    } else {
      document.title = HOME_TITLE;
    }
  }, [route]);

  const navigate = (path: string, hash?: string) => {
    const next = normalizePath(path);
    const targetUrl = next === '/' && hash && hash !== '#top' ? `/${hash}` : next;

    if (next !== route) {
      window.history.pushState({}, '', targetUrl);
      setRoute(next);
      window.setTimeout(() => {
        if (next === '/' && hash && hash !== '#top') {
          document.querySelector(hash)?.scrollIntoView({behavior: 'smooth'});
        } else {
          window.scrollTo({top: 0, behavior: 'auto'});
        }
      }, 40);
      return;
    }

    if (next === '/' && hash) {
      window.history.replaceState({}, '', targetUrl);
      if (hash === '#top') {
        window.scrollTo({top: 0, behavior: 'smooth'});
      } else {
        document.querySelector(hash)?.scrollIntoView({behavior: 'smooth'});
      }
      return;
    }

    window.scrollTo({top: 0, behavior: 'auto'});
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#0F1419]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0F1419] focus:text-white focus:rounded-md focus:text-sm"
        >
          Skip to main content
        </a>

        <Navbar onNavigate={navigate} />

        <main id="main-content" className="flex-1">
          {route === '/privacy' ? (
            <PrivacyPage onNavigate={navigate} />
          ) : route === '/terms' ? (
            <TermsPage onNavigate={navigate} />
          ) : (
            <>
              <Hero />
              <TechStrip />
              <Services />
              <About />
              <WorkHighlights />
              <Process />
              <Founder />
              <Faq />
              <Contact />
            </>
          )}
        </main>

        <Footer onNavigate={navigate} />
      </div>
    </MotionConfig>
  );
}
