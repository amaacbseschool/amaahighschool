import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Award,
  ArrowRight,
  Mail,
  Clock,
  CheckCircle2,
  X,
  Users,
  Briefcase,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { TextReveal } from './motion/TextReveal';
import { MagneticButton } from './motion/MagneticButton';
import type { RouteType } from '../types/routes';

interface FacultySectionProps {
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
  onOpenAdmission?: () => void;
}

export interface FacultyMember {
  id: number;
  name: string;
  role: string;
  department: 'Leadership' | 'Sciences' | 'Mathematics' | 'Languages' | 'Arts & Sports';
  qualification: string;
  experience: string;
  image?: string;
  subjects: string[];
  quote: string;
  bio: string;
  achievements: string[];
  officeHours: string;
  email: string;
}

const getInitials = (name: string) => {
  return name
    .replace(/^(Dr\.|Sri|Smt\.|Mr\.|Mrs\.|Ms\.)\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export const FacultySection: React.FC<FacultySectionProps> = ({
  onNavigateRoute,
  onOpenAdmission,
}) => {
  const [activeDepartment, setActiveDepartment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);

  const facultyList: FacultyMember[] = [
    {
      id: 1,
      name: 'Dr. K. S. Ramanathan',
      role: 'Principal & Head of Institutional Rigor',
      department: 'Leadership',
      qualification: 'Ph.D. in Educational Pedagogy, M.Sc. (Physics), B.Ed.',
      experience: '32 Years in Secondary & Higher Education',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      subjects: ['Physics (Class X Board Special)', 'Academic Ethics', 'Administrative Leadership'],
      quote: '"Education at AMAA is not the filling of a pail, but the lighting of an enduring fire of intellectual integrity and service."',
      bio: 'Dr. Ramanathan has steered AMAA High School for over two decades with visionary leadership. A former CBSE & State Board committee advisor, he spearheaded the school’s 100% distinction record and modern science laboratory integration.',
      achievements: [
        'National Best Educator Citation (2019)',
        'Authored 4 standard high school physics guidebooks',
        'Spearheaded the 60th Diamond Jubilee Academic Modernization',
      ],
      officeHours: 'Monday & Thursday • 10:00 AM – 12:30 PM',
      email: 'principal@amaahighschool.edu.in',
    },
    {
      id: 2,
      name: 'Smt. Lakshmi Prasanna',
      role: 'Vice Principal & Head of Science Suites',
      department: 'Sciences',
      qualification: 'M.Sc. in Organic Chemistry, B.Ed., State Gold Medalist',
      experience: '24 Years of Master Pedagogy',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      subjects: ['Chemistry (Grade 9 & 10)', 'Experiential Lab Practicals', 'Science Olympiad'],
      quote: '"When a student learns by holding the test tube and balancing the equation themselves, chemistry becomes poetry."',
      bio: 'Renowned for making complex chemical kinetics intuitive through everyday experiments. Mentored more than 85 state Olympiad finalists and 200+ students who pursued medicine at AIIMS and premier universities.',
      achievements: [
        'State Science Teaching Excellence Award (2021)',
        'Mentored 100% A+ chemistry board scores for 14 consecutive batches',
        'Co-developed AMAA Green Micro-Chemistry Lab Framework',
      ],
      officeHours: 'Tuesday & Friday • 02:00 PM – 04:00 PM',
      email: 'l.prasanna@amaahighschool.edu.in',
    },
    {
      id: 3,
      name: 'Sri M. Venkat Rao',
      role: 'Head of Mathematics & NTSE Cell',
      department: 'Mathematics',
      qualification: 'M.Sc. in Pure Mathematics, M.Phil., B.Ed.',
      experience: '21 Years of Secondary Mathematics Mastery',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      subjects: ['Higher Mathematics', 'Euclidean Geometry & Trigonometry', 'NTSE Logic'],
      quote: '"Mathematics is not numbers on paper; it is the universal architecture of clarity, symmetry, and reason."',
      bio: 'Sri Venkat Rao has trained 18 batches of board toppers with his signature visual geometry techniques. He directs the weekly Math Exploratorium where students build tactile models of quadratic equations and conic sections.',
      achievements: [
        'Recognized Mentor for Regional Mathematical Olympiad (RMO)',
        'Creator of the "Visual Math Sandbox" used across classes 6–10',
        'Produced 42 perfect 100/100 board scores in Mathematics',
      ],
      officeHours: 'Daily • 03:30 PM – 04:30 PM',
      email: 'm.venkatrao@amaahighschool.edu.in',
    },
    {
      id: 4,
      name: 'Dr. Ananya Mukherjee',
      role: 'Head of English & Debating Society',
      department: 'Languages',
      qualification: 'Ph.D. in Comparative Literature, Cambridge CELTA',
      experience: '18 Years of Humanities Instruction',
      image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=800&auto=format&fit=crop',
      subjects: ['English Literature', 'Rhetoric & Public Oratory', 'Creative Writing'],
      quote: '"Words empower young people to articulate their conscience, advocate for justice, and lead with empathy."',
      bio: 'A Cambridge CELTA certified scholar, Dr. Mukherjee leads AMAA’s celebrated Model UN delegation and Annual Shakespeare & Tagore Theatre Festival. Her students regularly publish anthologies and win national declamation trophies.',
      achievements: [
        'Best MUN Faculty Advisor Award (South Zone)',
        'Published 2 critical anthologies on post-colonial literature',
        'Chief Editor of the AMAA Diamond Jubilee Chronicle',
      ],
      officeHours: 'Wednesday • 11:30 AM – 01:30 PM',
      email: 'a.mukherjee@amaahighschool.edu.in',
    },
    {
      id: 5,
      name: 'Sri Rajesh Varma',
      role: 'Head of Computer & IT Laboratories',
      department: 'Sciences',
      qualification: 'M.Tech. in Computer Science, B.E. (Information Technology)',
      experience: '12 Years of Computer Science Pedagogy',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
      subjects: ['Computer Science & IT', 'Foundational Coding', 'Digital Literacy'],
      quote: '"We empower young minds to understand digital systems and build logical problem-solving confidence."',
      bio: 'Brings over a decade of computer science education experience. Manages our modern 24-workstation computer lab, campus network, and annual Inter-School Science & Coding Conclave.',
      achievements: [
        'Organized Regional High School Coding Olympiad',
        'Certified Network Administrator & Systems Mentor',
        'Set up AMAA High School’s 4K Smart Classroom Network',
      ],
      officeHours: 'Tuesday & Thursday • 03:00 PM – 05:00 PM',
      email: 'r.varma@amaahighschool.edu.in',
    },
    {
      id: 6,
      name: 'Smt. Sunitha Kulkarni',
      role: 'Senior Faculty in Social Sciences & Heritage',
      department: 'Languages',
      qualification: 'M.A. in History & Archeology, B.Ed.',
      experience: '19 Years in Historical & Civic Education',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
      subjects: ['Indian Heritage & World History', 'Democratic Civics', 'Geography & Cartography'],
      quote: '"Understanding our civilizational roots is the compass that guides responsible global citizenship."',
      bio: 'Known for interactive map-making workshops, historical role-playing sessions, and mock parliament conclaves. She organizes the annual heritage study expeditions across prominent architectural monuments.',
      achievements: [
        'State Heritage Conservation Educator Honor',
        'Designed interactive experiential curriculum for Middle School Civics',
        'Consistently achieved 98%+ distinction rate in Board Social Studies',
      ],
      officeHours: 'Monday & Wednesday • 01:00 PM – 03:00 PM',
      email: 's.kulkarni@amaahighschool.edu.in',
    },
    {
      id: 7,
      name: 'Sri B. Satyanarayana',
      role: 'Director of Physical Education & Martial Arts',
      department: 'Arts & Sports',
      qualification: 'M.P.Ed., NIS Certified Athletic Coach, 4th Dan Black Belt',
      experience: '16 Years in Youth Athletic Conditioning',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
      subjects: ['Track & Field Athletics', 'Taekwondo & Self-Defense', 'Sports Nutrition'],
      quote: '"A sound, resilient body is the temple of an agile, disciplined, and courageous mind."',
      bio: 'Former university athlete and NIS coach. Oversees AMAA’s 15-acre sports ground, floodlit basketball courts, and martial arts dojo. Under his training, AMAA won 38 district athletic championships.',
      achievements: [
        'Certified National Track Referee',
        'Trained 12 national Taekwondo gold and silver medalists',
        'Architect of the 4-House Intramural Championship League',
      ],
      officeHours: 'Daily • 06:30 AM – 08:00 AM & 04:00 PM – 05:30 PM',
      email: 'sports@amaahighschool.edu.in',
    },
    {
      id: 8,
      name: 'Smt. Padmavathi Devi',
      role: 'Head of Cultural Traditions & Fine Arts',
      department: 'Arts & Sports',
      qualification: 'M.A. in Fine Arts, Sangeet Visharad (Classical Carnatic)',
      experience: '15 Years in Aesthetic Mentorship',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop',
      subjects: ['Carnatic Vocal Music', 'Oil Painting & Sculpting', 'Indian Classical Dance'],
      quote: '"Art and melody soften the heart, sharpen aesthetic discernment, and connect the soul to beauty."',
      bio: 'An accomplished classical vocalist and painter. Directs the 60-piece student orchestra and annual cultural extravaganza "Kalarava". Her student paintings have been exhibited in state art galleries.',
      achievements: [
        'All-India Radio Graded Classical Artiste',
        'Curator of the Annual Student Art & Sculpture Pavilion',
        'Director of the Diamond Jubilee Symphony Production',
      ],
      officeHours: 'Friday & Saturday • 02:00 PM – 04:00 PM',
      email: 'p.devi@amaahighschool.edu.in',
    },
  ];

  const departments = [
    { label: 'All Mentors', key: 'All' },
    { label: 'Leadership', key: 'Leadership' },
    { label: 'Sciences & IT', key: 'Sciences' },
    { label: 'Mathematics', key: 'Mathematics' },
    { label: 'Languages & Humanities', key: 'Languages' },
    { label: 'Arts & Athletics', key: 'Arts & Sports' },
  ];

  const filteredFaculty = facultyList.filter((faculty) => {
    const matchesDept = activeDepartment === 'All' || faculty.department === activeDepartment;
    const matchesSearch =
      searchQuery === '' ||
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <section id="faculty" className="py-20 lg:py-28 bg-[#f8f9fa] relative">
      <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#354024]/10 text-[#354024] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Academic Leadership & Mentorship</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-1">
              <TextReveal>Distinguished Faculty & Subject Masters</TextReveal>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
              Under our sacred motto <span className="font-serif italic text-slate-900 font-bold">"Lead Kindly Light"</span>, 
              our post-graduate certified educators instill conceptual depth, scientific curiosity, and moral integrity with an enviable 1:20 teacher-student ratio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <MagneticButton>
              <button
                onClick={() => onNavigateRoute?.('contact', '#careers')}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider border border-slate-300 transition-all cursor-pointer shadow-xs"
              >
                <Briefcase className="w-4 h-4 text-[#354024]" />
                <span>Join Our Faculty</span>
              </button>
            </MagneticButton>

            {onOpenAdmission && (
              <MagneticButton>
                <button
                  onClick={onOpenAdmission}
                  className="inline-flex items-center gap-2 bg-[#354024] hover:bg-[#252d19] text-white font-bold px-7 py-3 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  <span>Schedule Academic Tour</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </MagneticButton>
            )}
          </div>
        </div>

        {/* 4 Pillars of Pedagogical Excellence */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <div className="text-2xl sm:text-3xl font-black text-[#354024] font-mono">100%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mt-1">Post-Graduate Certified</div>
            <div className="text-[11px] text-slate-500 mt-1">M.Sc., M.A. & B.Ed. Qualified</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <div className="text-2xl sm:text-3xl font-black text-[#cfbb99] font-mono">18+ Yrs</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mt-1">Average Pedagogy Tenure</div>
            <div className="text-[11px] text-slate-500 mt-1">Deep institutional stability</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <div className="text-2xl sm:text-3xl font-black text-[#354024] font-mono">1 : 20</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mt-1">Mentor-Student Ratio</div>
            <div className="text-[11px] text-slate-500 mt-1">Individual attention for every child</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card">
            <div className="text-2xl sm:text-3xl font-black text-[#dc2626] font-mono">15+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mt-1">State & National Honors</div>
            <div className="text-[11px] text-slate-500 mt-1">Award-winning academic leaders</div>
          </div>
        </div>

        {/* Filtering & Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 mb-10 border border-slate-200/80 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {departments.map((dept) => (
              <button
                key={dept.key}
                onClick={() => setActiveDepartment(dept.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeDepartment === dept.key
                    ? 'bg-[#354024] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty by name or subject..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#354024] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Faculty Cards Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredFaculty.map((faculty) => (
              <motion.div
                key={faculty.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -25 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-3xl border border-slate-200/80 hover:border-[#354024] shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
              >
                {/* Academic Profile Badge Header (No Photo) */}
                <div className="pt-6 px-6 pb-2 flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#354024] to-[#1b2213] text-[#cfbb99] font-crest font-extrabold text-lg flex items-center justify-center shadow-md shrink-0 border border-[#cfbb99]/30 group-hover:scale-105 transition-transform">
                    {getInitials(faculty.name)}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="bg-[#354024]/10 text-[#354024] border border-[#354024]/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {faculty.department}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                      <Award className="w-3 h-3 text-[#cfbb99]" />
                      <span>{faculty.experience.split(' ')[0]} Yrs Exp.</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 pt-3 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-[#354024] transition-colors tracking-tight">
                      {faculty.name}
                    </h3>
                    <div className="text-xs font-semibold text-[#354024] mt-0.5">
                      {faculty.role}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-mono">
                      {faculty.qualification}
                    </div>

                    {/* Quote Snippet */}
                    <blockquote className="mt-3 text-xs text-slate-600 italic border-l-2 border-[#cfbb99] pl-3 py-0.5 leading-relaxed line-clamp-2">
                      {faculty.quote}
                    </blockquote>

                    {/* Subjects Badges */}
                    <div className="mt-3.5 flex flex-wrap gap-1">
                      {faculty.subjects.map((sub, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedFaculty(faculty)}
                      className="text-xs font-bold text-[#354024] hover:text-[#252d19] inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Full Credentials</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={`mailto:${faculty.email}`}
                      className="p-2 rounded-full text-slate-400 hover:text-[#354024] hover:bg-slate-100 transition-colors"
                      title={`Email ${faculty.name}`}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredFaculty.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="font-heading font-bold text-lg text-slate-700">No Mentors Found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or department filter.
            </p>
            <button
              onClick={() => {
                setActiveDepartment('All');
                setSearchQuery('');
              }}
              className="mt-4 bg-[#354024] text-white text-xs font-bold px-5 py-2.5 rounded-full"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Institutional Academic Ethos Callout Box */}
        <div className="mt-14 bg-gradient-to-r from-[#141a0e] via-[#1b2213] to-[#252d19] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-[#cfbb99] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Continuous Pedagogy Excellence
            </div>
            <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white">
              Join Our Distinguished Teaching Fellowship
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              AMAA High School regularly invites accomplished subject masters, post-graduates, and passionate science & humanities educators. 
              We offer comprehensive professional development, advanced lab facilities, and competitive remuneration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10">
            <button
              onClick={() => onNavigateRoute?.('contact', '#careers')}
              className="w-full sm:w-auto bg-[#354024] hover:bg-[#252d19] text-white font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all text-center cursor-pointer shadow-lg"
            >
              Explore Faculty Openings
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('faculty');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider border border-white/20 transition-all text-center cursor-pointer"
            >
              View Full Roster
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Faculty Bio Modal */}
      <AnimatePresence>
        {selectedFaculty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFaculty(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 sm:p-8 bg-gradient-to-r from-[#141a0e] via-[#1b2213] to-[#252d19] text-white">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-[#cfbb99]/40 shrink-0 flex items-center justify-center shadow-md font-crest font-extrabold text-2xl sm:text-3xl text-[#cfbb99]">
                    {getInitials(selectedFaculty.name)}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase px-3 py-1 rounded-full bg-[#354024] text-white font-bold">
                      {selectedFaculty.department}
                    </span>
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mt-1.5">
                      {selectedFaculty.name}
                    </h3>
                    <p className="text-xs text-slate-200">{selectedFaculty.role}</p>
                    <p className="text-[11px] text-[#cfbb99] font-mono mt-0.5">
                      {selectedFaculty.qualification}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedFaculty(null)}
                  className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm">
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
                    Academic Background & Vision
                  </h4>
                  <p className="leading-relaxed text-slate-600">
                    {selectedFaculty.bio}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#cfbb99]" />
                    Key Milestones & Contributions
                  </h4>
                  <div className="space-y-2">
                    {selectedFaculty.achievements.map((ach, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-700 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#354024]/5 border border-[#354024]/15">
                    <div className="font-bold text-[#1b2213] flex items-center gap-1.5 mb-1">
                      <Clock className="w-4 h-4 text-[#354024]" />
                      Parent-Teacher Office Hours
                    </div>
                    <div className="text-slate-700 font-mono text-[11px]">
                      {selectedFaculty.officeHours}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#354024]/5 border border-[#354024]/15">
                    <div className="font-bold text-[#1b2213] flex items-center gap-1.5 mb-1">
                      <Mail className="w-4 h-4 text-[#354024]" />
                      Direct Academic Email
                    </div>
                    <div className="text-slate-700 font-mono text-[11px]">
                      {selectedFaculty.email}
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedFaculty(null)}
                  className="bg-[#354024] hover:bg-[#252d19] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
