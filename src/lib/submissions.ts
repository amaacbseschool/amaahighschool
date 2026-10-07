// ====================================================================
// AMAA HIGH SCHOOL — OPERATIONAL SUBMISSIONS DATA LAYER
// ====================================================================
// Handles direct Supabase PostgreSQL submissions for public forms:
// - Contact inquiries and campus tour bookings -> public.contact_messages
// - Newsletter subscriptions -> public.newsletter_subscribers
// ====================================================================

import { supabase } from './supabase';

export interface ContactSubmissionPayload {
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactSubmissionResult {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'Unread';
  created_at: string;
}

export interface NewsletterSubmissionResult {
  success: boolean;
  message: string;
}

/**
 * Submits a contact inquiry or campus tour request directly to Supabase contact_messages.
 */
export async function addContactMessage(
  data: ContactSubmissionPayload
): Promise<ContactSubmissionResult> {
  const { error } = await supabase
    .from('contact_messages')
    .insert({
      name: data.full_name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    });

  if (error) {
    console.error('[Submissions] Failed to submit contact message to Supabase:', error);
    throw new Error(error.message || 'Failed to submit contact message');
  }

  return {
    id: Date.now(),
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
    status: 'Unread',
    created_at: new Date().toISOString(),
  };
}

/**
 * Submits an email address directly to Supabase newsletter_subscribers.
 */
export async function addNewsletterSubscriber(
  email: string
): Promise<NewsletterSubmissionResult> {
  try {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: cleanEmail }]);

    if (error) {
      if (
        error.code === '23505' ||
        error.message?.toLowerCase().includes('duplicate') ||
        error.message?.toLowerCase().includes('already exists')
      ) {
        return { success: false, message: 'Email address is already subscribed!' };
      }
      return {
        success: false,
        message: error.message || 'Failed to subscribe. Please try again.',
      };
    }

    return {
      success: true,
      message: 'Thank you for subscribing to AMAA High School newsletter.',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
    return { success: false, message };
  }
}
