import React, { useState } from 'react';
import { Search, X, ArrowRight, BookOpen, Monitor, Award, Calendar } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (target: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectAction }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchableItems = [
    { title: 'Admissions 2025–26 Form', category: 'Admissions', icon: Award, href: '#admission-info' },
    { title: 'School Curriculum (Nursery to 10th)', category: 'Academics', icon: BookOpen, href: '#academics' },
    { title: 'Smart Classrooms & Digital Boards', category: 'Facilities', icon: Monitor, href: '#facilities' },
    { title: 'Science & Robotics Laboratories', category: 'Facilities', icon: Monitor, href: '#facilities' },
    { title: 'School Bus Fleet & GPS Tracking', category: 'Transport', icon: Monitor, href: '#facilities' },
    { title: 'Fee Structure & Scholarships', category: 'Admissions', icon: Award, href: '#contact' },
    { title: 'School Notices & Events', category: 'Circular', icon: Calendar, href: '#notices' },
    { title: 'Campus Tour & Principal Appointments', category: 'Contact', icon: Award, href: '#contact' },
  ];

  const results = searchTerm
    ? searchableItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : searchableItems.slice(0, 5);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative mb-4">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            autoFocus
            placeholder="Search classes, facilities, admissions, bus routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] outline-none"
          />
        </div>

        <div className="space-y-1.5 max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            results.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href}
                  onClick={() => {
                    onClose();
                    onSelectAction(item.href);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/70 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#1d4ed8] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 group-hover:text-[#1d4ed8]">
                        {item.title}
                      </h5>
                      <span className="text-[10px] text-[#1d4ed8] font-semibold">{item.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1d4ed8] group-hover:translate-x-1 transition-all" />
                </a>
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
