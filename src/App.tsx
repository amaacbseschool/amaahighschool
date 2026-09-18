import { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { NoticeTicker } from './components/NoticeTicker';
import { HeroSlider } from './components/HeroSlider';
import { AboutSection } from './components/AboutSection';
import { AcademicsSection } from './components/AcademicsSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { StudentLifeGallery } from './components/StudentLifeGallery';
import { AdmissionBanner } from './components/AdmissionBanner';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdmissionModal } from './components/AdmissionModal';
import { SqlConsoleModal } from './components/SqlConsoleModal';
import { SearchModal } from './components/SearchModal';
import { db } from './lib/db';
import type { SchoolNotice } from './lib/db';

export function App() {
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);
  const [sqlConsoleOpen, setSqlConsoleOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notices, setNotices] = useState<SchoolNotice[]>([]);

  const reloadDatabaseRecords = () => {
    setNotices(db.getNotices());
  };

  useEffect(() => {
    reloadDatabaseRecords();
  }, []);

  const handleExploreCampus = () => {
    const facilitiesEl = document.getElementById('facilities');
    if (facilitiesEl) {
      facilitiesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf8] text-slate-800 font-sans selection:bg-[#d4973b]/20 selection:text-[#093326]">
      {/* 1. Top Announcement & Contact Bar */}
      <TopBar
        onOpenAdmission={() => setAdmissionModalOpen(true)}
        onOpenSqlConsole={() => setSqlConsoleOpen(true)}
      />

      {/* 2. Main Navigation Header with Crest & Dropdowns */}
      <Navbar
        onOpenAdmission={() => setAdmissionModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* 3. Live SQL School Notices Marquee Ticker */}
      <NoticeTicker notices={notices} />

      <main className="flex-1">
        {/* 4. Hero Section with Smooth Slider & 5 Floating Feature Cards */}
        <HeroSlider
          onOpenAdmission={() => setAdmissionModalOpen(true)}
          onExploreCampus={handleExploreCampus}
        />

        {/* 5. Welcome & About AMAA High School Section */}
        <AboutSection />

        {/* 6. Academics - "Explore. Learn. Excel." + Holistic Growth Feature */}
        <AcademicsSection />

        {/* 7. Facilities - World-Class Infrastructure */}
        <FacilitiesSection />

        {/* 8. Student Life - Learning Beyond Classrooms Gallery */}
        <StudentLifeGallery />

        {/* 9. High-Impact Admissions Ribbon Banner */}
        <AdmissionBanner onOpenAdmission={() => setAdmissionModalOpen(true)} />

        {/* 10. Contact Us & Campus Visit Inquiry Form */}
        <ContactSection onRecordAdded={reloadDatabaseRecords} />
      </main>

      {/* 11. Institutional Footer with Newsletter & Accreditation */}
      <Footer
        onOpenAdmission={() => setAdmissionModalOpen(true)}
        onOpenSqlConsole={() => setSqlConsoleOpen(true)}
      />

      {/* --- Interactive Modals --- */}
      {/* Admission Enquiry Modal (Persists to SQLite database) */}
      <AdmissionModal
        isOpen={admissionModalOpen}
        onClose={() => setAdmissionModalOpen(false)}
        onOpenSqlConsole={() => setSqlConsoleOpen(true)}
        onRecordAdded={reloadDatabaseRecords}
      />

      {/* SQL Management Console & Application Workflow Terminal */}
      <SqlConsoleModal
        isOpen={sqlConsoleOpen}
        onClose={() => setSqlConsoleOpen(false)}
        onDatabaseChanged={reloadDatabaseRecords}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectAction={() => {}}
      />
    </div>
  );
}

export default App;
