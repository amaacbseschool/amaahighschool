import React, { useState, useEffect, useMemo } from 'react';
import { HeroSlider } from '../components/HeroSlider';
import { SchoolHeritageSection } from '../components/SchoolHeritageSection';
import { AcademicsSection } from '../components/AcademicsSection';
import { CampusSection } from '../components/CampusSection';
import { StudentLifeGallery } from '../components/StudentLifeGallery';
import { AchievementsSection } from '../components/AchievementsSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { AdmissionsCtaSection } from '../components/AdmissionsCtaSection';
import { getPageWithSections } from '../lib/cms';
import type { CmsPageWithSections, CmsSectionWithItems } from '../types/cms';
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
  const [pageData, setPageData] = useState<CmsPageWithSections | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPageWithSections('home')
      .then((data) => {
        if (isMounted && data) {
          setPageData(data);
        }
      })
      .catch((err) => {
        console.error('[CMS] Failed to load home page with sections:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const sectionMap = useMemo(() => {
    const map = new Map<string, CmsSectionWithItems>();
    if (pageData?.sections) {
      for (const sec of pageData.sections) {
        map.set(sec.section_key, sec);
      }
    }
    return map;
  }, [pageData]);

  return (
    <div className="space-y-0 bg-[#f8f9fa]">
      {/* 1. Hero: Cinematic Photography */}
      <HeroSlider
        cmsSection={sectionMap.get('home.hero')}
        onOpenAdmission={onOpenAdmission}
        onExploreCampus={onExploreCampus}
        onNavigateRoute={onNavigateRoute}
      />

      {/* 2. School Heritage: 60-Year Diamond Jubilee, Estd. 1965, "Lead Kindly Light", Milestones & Ethos */}
      <SchoolHeritageSection
        cmsSection={sectionMap.get('home.heritage')}
        onNavigateRoute={onNavigateRoute}
        onOpenAdmission={onOpenAdmission}
      />

      {/* 3. Academics: Grades VI to Class X, 1:20 Ratio, Pedagogy & Olympiads */}
      <AcademicsSection
        cmsSection={sectionMap.get('home.academics')}
        onNavigateRoute={onNavigateRoute}
        onOpenAdmission={onOpenAdmission}
      />

      {/* 4. Campus Infrastructure & Facilities: Interactive Suites & Authentic Galleries */}
      <CampusSection
        cmsSection={sectionMap.get('home.campus')}
        onNavigateRoute={onNavigateRoute}
        onOpenAdmission={onOpenAdmission}
      />

      {/* 5. Student Life & Visual Gallery: Athletics, Sciences, Cultural Arts, Lightbox */}
      <StudentLifeGallery
        cmsSection={sectionMap.get('home.student_life')}
        onNavigateRoute={onNavigateRoute}
      />

      {/* 6. Achievements & Distinctions: State Ranks, Class X Board Centums & Prodigy Alumni */}
      <AchievementsSection
        cmsSection={sectionMap.get('home.achievements')}
        onNavigateRoute={onNavigateRoute}
        onOpenAdmission={onOpenAdmission}
      />

      {/* 7. Testimonials: Authentic Voices of Trust from Parents, Doctors & Alumni */}
      <TestimonialsSection
        cmsSection={sectionMap.get('home.testimonials')}
        onNavigateRoute={onNavigateRoute}
      />

      {/* 8. Admissions CTA: 2025–26 Enrolment Roadmap, Prospectus Download & Direct Application */}
      <AdmissionsCtaSection
        cmsSection={sectionMap.get('home.admissions_cta')}
        onOpenAdmission={onOpenAdmission}
        onNavigateRoute={onNavigateRoute}
      />
    </div>
  );
};
