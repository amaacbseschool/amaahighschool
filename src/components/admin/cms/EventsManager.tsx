import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Users,
  Link as LinkIcon
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { AdminRole } from '../../../pages/AdminDashboardPage';
import type { SchoolEventRow } from '../../../types/cms';
import { CmsFormField } from './CmsFormField';
import { CmsConfirmDialog } from './CmsConfirmDialog';

interface EventsManagerProps {
  userRole: AdminRole;
}

export const EventsManager: React.FC<EventsManagerProps> = ({ userRole }) => {
  const [events, setEvents] = useState<SchoolEventRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEvent, setEditingEvent] = useState<SchoolEventRow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<SchoolEventRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [formState, setFormState] = useState<{
    title: string;
    event_date: string;
    end_date: string;
    venue: string;
    audience: string;
    description: string;
    action_text: string;
    action_url: string;
    is_published: boolean;
  }>({
    title: '',
    event_date: new Date().toISOString().split('T')[0],
    end_date: '',
    venue: 'Main Campus Auditorium',
    audience: 'All Students & Parents',
    description: '',
    action_text: '',
    action_url: '',
    is_published: true,
  });

  const isViewer = userRole === 'viewer';

  const fetchEvents = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from('school_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err: any) {
      console.error('[EventsManager Fetch Error]:', err);
      setErrorMessage(err.message || 'Failed to load school events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormState({
      title: '',
      event_date: new Date().toISOString().split('T')[0],
      end_date: '',
      venue: 'Main Campus Auditorium',
      audience: 'All Students & Parents',
      description: '',
      action_text: '',
      action_url: '',
      is_published: true,
    });
    setIsCreating(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const openEditModal = (ev: SchoolEventRow) => {
    setIsCreating(false);
    setEditingEvent(ev);
    setFormState({
      title: ev.title,
      event_date: ev.event_date ? ev.event_date.split('T')[0] : '',
      end_date: ev.end_date ? ev.end_date.split('T')[0] : '',
      venue: ev.venue || '',
      audience: ev.audience || '',
      description: ev.description || '',
      action_text: ev.action_text || '',
      action_url: ev.action_url || '',
      is_published: ev.is_published,
    });
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const closeFormModal = () => {
    setIsCreating(false);
    setEditingEvent(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;

    if (!formState.title.trim()) {
      setErrorMessage('Event title is required.');
      return;
    }
    if (!formState.event_date) {
      setErrorMessage('Event date is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const payload = {
      title: formState.title.trim(),
      event_date: formState.event_date,
      end_date: formState.end_date || null,
      venue: formState.venue.trim() || null,
      audience: formState.audience.trim() || null,
      description: formState.description.trim() || null,
      action_text: formState.action_text.trim() || null,
      action_url: formState.action_url.trim() || null,
      is_published: formState.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isCreating) {
        const { data, error } = await supabase
          .from('school_events')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        setEvents((prev) => [...prev, data]);
        setSuccessMessage('Created event successfully.');
      } else if (editingEvent) {
        const { data, error } = await supabase
          .from('school_events')
          .update(payload)
          .eq('id', editingEvent.id)
          .select()
          .single();

        if (error) throw error;
        setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? data : e)));
        setSuccessMessage('Updated event successfully.');
      }

      closeFormModal();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[EventsManager Save Error]:', err);
      setErrorMessage(err.message || 'Failed to save event');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (ev: SchoolEventRow) => {
    if (isViewer) return;
    const newStatus = !ev.is_published;

    setEvents((prev) =>
      prev.map((e) => (e.id === ev.id ? { ...e, is_published: newStatus } : e))
    );

    try {
      const { error } = await supabase
        .from('school_events')
        .update({
          is_published: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ev.id);

      if (error) throw error;
    } catch (err: any) {
      console.error('[EventsManager Toggle Error]:', err);
      setEvents((prev) =>
        prev.map((e) => (e.id === ev.id ? { ...e, is_published: !newStatus } : e))
      );
      setErrorMessage('Failed to update event status: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate || isViewer) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('school_events')
        .delete()
        .eq('id', deleteCandidate.id);

      if (error) throw error;

      setEvents((prev) => prev.filter((e) => e.id !== deleteCandidate.id));
      setSuccessMessage(`Deleted event "${deleteCandidate.title}".`);
      setDeleteCandidate(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[EventsManager Delete Error]:', err);
      setErrorMessage(err.message || 'Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      (e.venue && e.venue.toLowerCase().includes(q)) ||
      (e.description && e.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#354024]" />
            <span>School Calendar & Events Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Schedule academic competitions, cultural festivals, sports meets, and parent-teacher assemblies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl">
            {events.length} Scheduled Events
          </span>
          {!isViewer && (
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#354024] hover:bg-[#28311a] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Event</span>
            </button>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter events by title, venue, or description..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:border-[#354024] outline-hidden shadow-xs"
        />
      </div>

      {/* Events List */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-[#354024] mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading events calendar...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No events found</h4>
          <p className="text-xs text-slate-500 mt-1">No events match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#354024] bg-[#354024]/10 px-2.5 py-1 rounded-lg">
                      {ev.event_date}
                    </span>
                    {ev.end_date && (
                      <span className="text-xs text-slate-500">
                        to {ev.end_date}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      ev.is_published
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ev.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 text-sm mt-2.5">
                  {ev.title}
                </h3>

                {ev.description && (
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {ev.description}
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  {ev.venue && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.venue}</span>
                    </span>
                  )}
                  {ev.audience && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.audience}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {ev.action_text && ev.action_url && (
                    <span className="text-xs text-[#354024] font-medium flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" />
                      <span>{ev.action_text}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={isViewer}
                    onClick={() => handleTogglePublish(ev)}
                    className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                      ev.is_published
                        ? 'text-emerald-700 hover:bg-emerald-50'
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={ev.is_published ? 'Published' : 'Draft'}
                  >
                    {ev.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {!isViewer && (
                    <>
                      <button
                        type="button"
                        onClick={() => openEditModal(ev)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(ev)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {(isCreating || editingEvent) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl my-8 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#354024]" />
                <span>{isCreating ? 'Schedule New Event' : `Edit: ${editingEvent?.title}`}</span>
              </h3>
              <button
                type="button"
                onClick={closeFormModal}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <CmsFormField label="Event Title" required>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  placeholder="e.g. Science Exhibition & Innovation Fair"
                  className="w-full p-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                />
              </CmsFormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CmsFormField label="Event Date" required>
                  <input
                    type="date"
                    required
                    value={formState.event_date}
                    onChange={(e) => setFormState({ ...formState, event_date: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="End Date (Optional)">
                  <input
                    type="date"
                    value={formState.end_date}
                    onChange={(e) => setFormState({ ...formState, end_date: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CmsFormField label="Campus Venue">
                  <input
                    type="text"
                    value={formState.venue}
                    onChange={(e) => setFormState({ ...formState, venue: e.target.value })}
                    placeholder="e.g. Main Auditorium, Science Labs"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="Target Audience">
                  <input
                    type="text"
                    value={formState.audience}
                    onChange={(e) => setFormState({ ...formState, audience: e.target.value })}
                    placeholder="e.g. Classes VI - X, Parents, Open to Public"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>
              </div>

              <CmsFormField label="Event Overview & Details">
                <textarea
                  rows={3}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Outline activities, schedule, and participation instructions..."
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden resize-none"
                />
              </CmsFormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CmsFormField label="Action Button Label">
                  <input
                    type="text"
                    value={formState.action_text}
                    onChange={(e) => setFormState({ ...formState, action_text: e.target.value })}
                    placeholder="e.g. Register Online, Download Schedule"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="Action Link / URL">
                  <input
                    type="text"
                    value={formState.action_url}
                    onChange={(e) => setFormState({ ...formState, action_url: e.target.value })}
                    placeholder="e.g. /admissions or https://..."
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden font-mono"
                  />
                </CmsFormField>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="event_published"
                  checked={formState.is_published}
                  onChange={(e) => setFormState({ ...formState, is_published: e.target.checked })}
                  className="w-4 h-4 rounded text-[#354024] focus:ring-[#354024] border-slate-300 cursor-pointer"
                />
                <label htmlFor="event_published" className="text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">
                  Event is Published on Public School Calendar
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeFormModal}
                  disabled={isSaving}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#354024] hover:bg-[#28311a] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isCreating ? 'Schedule Event' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CmsConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteCandidate?.title}"?`}
        confirmLabel="Delete Event"
        onConfirm={handleDelete}
        onCancel={() => setDeleteCandidate(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};
