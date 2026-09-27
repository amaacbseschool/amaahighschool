import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { NoticeTicker } from './components/NoticeTicker';
import { Footer } from './components/Footer';
import { AdmissionModal } from './components/AdmissionModal';
import { SqlConsoleModal } from './components/SqlConsoleModal';
import { SearchModal } from './components/SearchModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { AlumniPage } from './components/AlumniPage';
import { FacultyPage } from './pages/FacultyPage';
import { StudentLifePage } from './pages/StudentLifePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { NewsEventsPage } from './pages/NewsEventsPage';
import { AdministrationPage } from './pages/AdministrationPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Preloader } from './components/Preloader';
import { db } from './lib/db';
import { initLenis, destroyLenis, scrollToElement } from './lib/lenis';
import type { SchoolNotice } from './lib/db';
import type { RouteType } from './types/routes';

export function App() {
  const getRouteFromUrl = (): RouteType => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const candidate = path || hash;

    switch (candidate) {
      case 'about':
        return 'about';
      case 'academics':
        return 'academics';
      case 'faculty':
      case 'teachers':
        return 'faculty';
      case 'campus':
      case 'facilities':
        return 'campus';
      case 'student-life':
        return 'student-life';
      case 'gallery':
        return 'gallery';
      case 'achievements':
        return 'achievements';
      case 'news-events':
      case 'news':
      case 'events':
        return 'news-events';
      case 'alumni':
        return 'alumni';
      case 'admin':
      case 'dashboard':
        return 'admin';
      case 'administration':
      case 'governing-body':
      case 'governance':
        return 'administration';
      case 'contact':
        return 'contact';
      default:
        return 'home';
    }
  };

  const [route, setRoute] = useState<RouteType>(getRouteFromUrl);
  const [showPreloader, setShowPreloader] = useState(true);
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);
  const [sqlConsoleOpen, setSqlConsoleOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notices, setNotices] = useState<SchoolNotice[]>([]);

  const reloadDatabaseRecords = () => {
    setNotices(db.getNotices());
  };

  useEffect(() => {
    reloadDatabaseRecords();

    // Initialize Lenis buttery-smooth momentum scroll
    initLenis();

    const handleLocationChange = () => {
      const nextRoute = getRouteFromUrl();
      setRoute(nextRoute);
      scrollToElement(document.body, { offset: 0, duration: 0.6 });
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      destroyLenis();
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToRoute = (targetRoute: RouteType, hashTarget?: string) => {
    // Normalise legacy route aliases
    const resolvedRoute: RouteType =
      targetRoute === 'facilities' ? 'campus' :
      targetRoute === 'gallery' ? 'student-life' :
      targetRoute;

    setRoute(resolvedRoute);

    const routeToPath: Record<RouteType, string> = {
      home: '/',
      about: '/about',
      academics: '/academics',
      faculty: '/faculty',
      campus: '/campus',
      facilities: '/campus',      // alias
      'student-life': '/student-life',
      achievements: '/achievements',
      'news-events': '/news-events',
      gallery: '/gallery',
      alumni: '/alumni',
      administration: '/administration',
      admin: '/admin',
      contact: '/contact',
    };

    const path = routeToPath[resolvedRoute] ?? `/${resolvedRoute}`;

    if (hashTarget && hashTarget !== '#') {
      window.history.pushState(null, '', `${path}${hashTarget}`);
    } else {
      window.history.pushState(null, '', path);
    }

    // Scroll to top or specific anchor with Lenis
    if (hashTarget && hashTarget.startsWith('#') && hashTarget.length > 1) {
      setTimeout(() => {
        const id = hashTarget.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          scrollToElement(el, { offset: -88, duration: 1.0 });
        } else {
          scrollToElement(document.body, { offset: 0, duration: 0.8 });
        }
      }, 80);
    } else {
      scrollToElement(document.body, { offset: 0, duration: 0.8 });
    }
  };

  return (
    <>
      <AnimatePresence>
        {showPreloader && (
          <Preloader
            onComplete={() => setShowPreloader(false)}
            minDurationMs={1800}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col bg-[#f7f4ee] text-[#1c2228] font-sans selection:bg-[#cfbb99]/40 selection:text-[#0a192f]">
        {/* 1. Top Announcement & Contact Bar */}
        <TopBar
          onOpenAdmission={() => setAdmissionModalOpen(true)}
          onNavigateRoute={navigateToRoute}
        />

      {/* 2. Main Navigation Header with Crest & End-to-End Route Links */}
      <Navbar
        currentRoute={route}
        onNavigateRoute={navigateToRoute}
        onOpenAdmission={() => setAdmissionModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* 3. Live SQL School Notices (Shown on Subpages) */}
      {route !== 'home' && <NoticeTicker notices={notices} />}

      {/* 4. Multi-Page Main Content Area with Route Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {route === 'home' && (
              <HomePage
                onOpenAdmission={() => setAdmissionModalOpen(true)}
                onExploreCampus={() => navigateToRoute('campus')}
                onNavigateRoute={navigateToRoute}
                onRecordAdded={reloadDatabaseRecords}
              />
            )}

            {route === 'about' && (
              <AboutPage
                onNavigateHome={() => navigateToRoute('home')}
                onNavigateRoute={navigateToRoute}
                onOpenAdmission={() => setAdmissionModalOpen(true)}
              />
            )}

            {route === 'academics' && (
              <AcademicsPage
                onNavigateHome={() => navigateToRoute('home')}
                onOpenAdmission={() => setAdmissionModalOpen(true)}
                onNavigateRoute={navigateToRoute}
              />
            )}

            {route === 'faculty' && (
              <FacultyPage
                onNavigateRoute={navigateToRoute}
                onOpenAdmission={() => setAdmissionModalOpen(true)}
              />
            )}

            {route === 'campus' && (
              <FacilitiesPage
                onNavigateRoute={navigateToRoute}
              />
            )}

            {route === 'student-life' && (
              <StudentLifePage
                onNavigateRoute={navigateToRoute}
                onOpenAdmission={() => setAdmissionModalOpen(true)}
              />
            )}

            {route === 'achievements' && (
              <AchievementsPage
                onNavigateRoute={navigateToRoute}
                onOpenAdmission={() => setAdmissionModalOpen(true)}
              />
            )}

            {route === 'news-events' && (
              <NewsEventsPage
                onNavigateRoute={navigateToRoute}
              />
            )}

            {route === 'gallery' && (
              <GalleryPage
                onNavigateRoute={navigateToRoute}
              />
            )}

            {route === 'alumni' && (
              <AlumniPage
                onNavigateHome={() => navigateToRoute('home')}
                onOpenAdmission={() => setAdmissionModalOpen(true)}
              />
            )}

            {route === 'admin' && (
              <AdminDashboardPage
                onNavigateHome={() => navigateToRoute('home')}
                onNavigateRoute={navigateToRoute}
                onOpenSqlConsole={() => setSqlConsoleOpen(true)}
              />
            )}

            {route === 'administration' && (
              <AdministrationPage
                onNavigateHome={() => navigateToRoute('home')}
                onNavigateRoute={navigateToRoute}
                onOpenAdmission={() => setAdmissionModalOpen(true)}
              />
            )}

            {route === 'contact' && (
              <ContactPage
                onNavigateRoute={navigateToRoute}
                onRecordAdded={reloadDatabaseRecords}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 5. Institutional Footer with Newsletter & Accreditation */}
      <Footer
        onOpenAdmission={() => setAdmissionModalOpen(true)}
        onNavigateRoute={navigateToRoute}
      />

      {/* --- Interactive Modals --- */}
      {/* Admission Enquiry Modal (Persists to SQLite database) */}
      <AdmissionModal
        isOpen={admissionModalOpen}
        onClose={() => setAdmissionModalOpen(false)}
        onRecordAdded={reloadDatabaseRecords}
      />

      {/* SQL Management Console & Application Workflow Terminal */}
      <SqlConsoleModal
        isOpen={sqlConsoleOpen}
        onClose={() => setSqlConsoleOpen(false)}
        onDatabaseChanged={reloadDatabaseRecords}
      />

      {/* Instant Search Modal with Route Navigation */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectRoute={(targetRoute) => navigateToRoute(targetRoute)}
      />
    </div>
    </>
  );
}

export default App;
