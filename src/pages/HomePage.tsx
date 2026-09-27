import React from 'react';
import { HeroSlider } from '../components/HeroSlider';
import { SchoolHeritageSection } from '../components/SchoolHeritageSection';
import { AcademicsSection } from '../components/AcademicsSection';
import { CampusSection } from '../components/CampusSection';
import { StudentLifeGallery } from '../components/StudentLifeGallery';
import { AchievementsSection } from '../components/AchievementsSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { AdmissionsCtaSection } from '../components/AdmissionsCtaSection';
import type { RouteType } from '../types/routes';

interface HomePageProps {
  onOpenAdmission: () => void;
  onExploreCampus: () => void;
  onNavigateRoute: (route: RouteType, hashTarget?: string) => void;
  onRecordAdded?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenAdmission,
  onExploreCampus,
  onNavigateRoute,
}) => {
  return (
    <div className="space-y-0 bg-[#f8f9fa]">
      {/* 1. Hero: Cinematic Photography */}
      <HeroSlider
        onOpenAdmission={onOpenAdmission}
        onExploreCampus={onExploreCampus}
        onNavigateRoute={onNavigateRoute}
      />

      {/* 2. School Heritage: 60-Year Diamond Jubilee, Estd. 1965, "Lead Kindly Light", Milestones & Ethos */}
      <SchoolHeritageSection
        onNavigateRoute={onNavigateRoute}
        onOpenAdmission={onOpenAdmission}
      />

      {/* 6. Academics: Grades VI to Class X, 1:20 Ratio, Pedagogy & Olympiads */}
      <AcademicsSection
        onNavigateRoute={onNavigateRoute}
        onOpenAdmission={onOpenAdmission}
      />

      {/* 7. Campus Infrastructure & Facilities: Interactive Suites & Authentic Galleries */}
      <CampusSection
        onNavigateRoute={onNavigateRoute}
        onOpenAdmission={onOpenAdmission}
      />

      {/* 8. Student Life & Visual Gallery: Athletics, Sciences, Cultural Arts, Lightbox */}
      <StudentLifeGallery
        onNavigateRoute={onNavigateRoute}
      />

      {/* 9. Achievements & Distinctions: State Ranks, Class X Board Centums & Prodigy Alumni */}
      <AchievementsSection
        onNavigateRoute={onNavigateRoute}
        onOpenAdmission={onOpenAdmission}
      />

      {/* 10. Testimonials: Authentic Voices of Trust from Parents, Doctors & Alumni */}
      <TestimonialsSection
        onNavigateRoute={onNavigateRoute}
      />

      {/* 11. Admissions CTA: 2025–26 Enrolment Roadmap, Prospectus Download & Direct Application */}
      <AdmissionsCtaSection
        onOpenAdmission={onOpenAdmission}
        onNavigateRoute={onNavigateRoute}
      />
    </div>
  );
};
