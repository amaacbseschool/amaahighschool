import React, { useState } from 'react';
import { Search, X, ArrowRight, BookOpen, Monitor, Award, Calendar, Users, Phone } from 'lucide-react';
import type { RouteType } from '../types/routes';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoute: (route: RouteType) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectRoute }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchableItems: { title: string; category: string; icon: React.ComponentType<{ className?: string }>; route: RouteType }[] = [
    { title: 'Campus Visual Chronicle & Photo Archive', category: 'Gallery', icon: Award, route: 'gallery' },
    { title: 'School Curriculum & Academic Wings', category: 'Academics', icon: BookOpen, route: 'academics' },
    { title: 'Smart Classrooms & 4K Digital Boards', category: 'Campus', icon: Monitor, route: 'campus' },
    { title: 'Science & Computer Laboratories', category: 'Campus', icon: Monitor, route: 'campus' },
    { title: 'Digital Library & Research Carrels', category: 'Campus', icon: Monitor, route: 'campus' },
    { title: 'School Bus Fleet & Live GPS Tracking', category: 'Campus', icon: Monitor, route: 'campus' },
    { title: 'Faculty & Distinguished Subject Masters', category: 'Faculty', icon: Users, route: 'faculty' },
    { title: 'Student Life, Sports, Arts & Cultural Gallery', category: 'Student Life', icon: Calendar, route: 'student-life' },
    { title: 'Board Toppers, Olympiad & Sports Honours', category: 'Achievements', icon: Award, route: 'achievements' },
    { title: 'School News, Events, Circulars & Announcements', category: 'News & Events', icon: Calendar, route: 'news-events' },
    { title: 'Alumni Network, Hall of Fame & Directory', category: 'Alumni', icon: Users, route: 'alumni' },
    { title: 'Administration & Governing Council Members', category: 'About', icon: Award, route: 'administration' },
    { title: 'Campus Tour Booking & Counselor Inquiries', category: 'Contact', icon: Phone, route: 'contact' },
    { title: 'About AMAA High School, Mission & Vision', category: 'About', icon: Award, route: 'about' },
  ];

  const results = searchTerm
    ? searchableItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : searchableItems.slice(0, 6);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative mb-5">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            autoFocus
            placeholder="Search classes, facilities, admissions, bus routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 rounded-full border border-slate-200 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] focus:bg-white outline-none text-slate-900 transition-colors"
          />
        </div>

        <div className="space-y-1.5 max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            results.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onClose();
                    onSelectRoute(item.route);
                  }}
                  className="w-full text-left flex items-center justify-between p-3 rounded-2xl hover:bg-purple-50/70 transition-colors group cursor-pointer border border-transparent hover:border-purple-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#44105c] group-hover:bg-[#44105c] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 group-hover:text-[#44105c] font-heading">
                        {item.title}
                      </h5>
                      <span className="text-[10px] text-[#e40046] font-semibold">{item.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#44105c] group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              );
            })
          ) : (
            <div className="text-center py-6 text-xs text-slate-500">
              No matching pages or documents found for "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
