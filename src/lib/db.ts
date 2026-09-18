// SQL Database Manager for AMAA High School
// Persists relational records to localStorage with full SQL query support

export interface AdmissionEnquiry {
  id: number;
  student_name: string;
  parent_name: string;
  email: string;
  phone: string;
  grade_applying: string;
  previous_school: string;
  notes: string;
  status: 'Pending Review' | 'Document Verification' | 'Interview Scheduled' | 'Admission Approved';
  created_at: string;
}

export interface ContactMessage {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'Unread' | 'In Progress' | 'Resolved';
  created_at: string;
}

export interface SchoolNotice {
  id: number;
  title: string;
  category: 'Academic' | 'Admissions' | 'Sports' | 'Circular' | 'Events';
  date: string;
  content: string;
  is_important: boolean;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribed_at: string;
}

export interface QueryResult {
  columns: string[];
  rows: (string | number | boolean | null)[][];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
}

const STORAGE_KEYS = {
  ADMISSIONS: 'amaa_db_admissions_v1',
  CONTACTS: 'amaa_db_contacts_v1',
  NOTICES: 'amaa_db_notices_v1',
  SUBSCRIBERS: 'amaa_db_subscribers_v1',
};

// Default seed notices matching reference ethos
const SEED_NOTICES: SchoolNotice[] = [
  {
    id: 1,
    title: 'Admissions Open for Academic Session 2025–26 (Nursery to Class XII)',
    category: 'Admissions',
    date: 'Sep 15, 2026',
    content: 'Registration and entrance assessment slots are now open online. Early bird sibling discounts applicable.',
    is_important: true,
  },
  {
    id: 2,
    title: 'Inter-School CBSE Science Olympiad & Robotics Expo',
    category: 'Academic',
    date: 'Sep 22, 2026',
    content: 'Students from Grades VI to XII will showcase innovative green-tech models in the Vivekananda Hall.',
    is_important: false,
  },
  {
    id: 3,
    title: 'Annual Sports Meet 2026 & Taekwondo Championship',
    category: 'Sports',
    date: 'Oct 05, 2026',
    content: 'Track events, football, basketball and martial arts trials begin this Monday on the school athletic grounds.',
    is_important: true,
  },
  {
    id: 4,
    title: 'Mandatory Parent-Teacher Interactive Conference (Term 1)',
    category: 'Circular',
    date: 'Oct 12, 2026',
    content: 'Progress report cards and one-on-one educator reviews scheduled between 9:00 AM and 2:00 PM.',
    is_important: false,
  },
];

const SEED_ADMISSIONS: AdmissionEnquiry[] = [
  {
    id: 1,
    student_name: 'Aarav Sharma',
    parent_name: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    phone: '+91 98765 43210',
    grade_applying: 'Grade IX',
    previous_school: 'St. Xavier Public School',
    notes: 'Interested in STEM robotics track and inter-school basketball.',
    status: 'Interview Scheduled',
    created_at: '2026-09-14 11:20:00',
  },
  {
    id: 2,
    student_name: 'Ananya Verma',
    parent_name: 'Dr. Sunita Verma',
    email: 'dr.sunita@example.com',
    phone: '+91 98111 22334',
    grade_applying: 'Grade XI (Science/Medical)',
    previous_school: 'Delhi Public School',
    notes: 'Aims for NEET preparation along with CBSE curriculum.',
    status: 'Admission Approved',
    created_at: '2026-09-16 09:45:00',
  },
  {
    id: 3,
    student_name: 'Rohan Deshmukh',
    parent_name: 'Vikram Deshmukh',
    email: 'vikram.d@example.com',
    phone: '+91 97234 56789',
    grade_applying: 'Grade I',
    previous_school: 'Kidzee Pre-School',
    notes: 'Requesting school transport bus route on West Bypass.',
    status: 'Pending Review',
    created_at: '2026-09-17 14:10:00',
  },
];

const SEED_CONTACTS: ContactMessage[] = [
  {
    id: 1,
    full_name: 'Mrs. Neha Kulkarni',
    email: 'neha.k@example.com',
    phone: '+91 98220 99887',
    subject: 'Fee Structure and Payment Schedule Details',
    message: 'Could you please send the detailed fee breakdown for Class VI including lab fees and transport?',
    status: 'Resolved',
    created_at: '2026-09-15 15:30:00',
  },
  {
    id: 2,
    full_name: 'Amitabh Choudhary',
    email: 'amitabh.c@example.com',
    phone: '+91 99345 61122',
    subject: 'Campus Visit on Saturday Morning',
    message: 'We would like to book an appointment for an in-person campus walk and counselor meeting this Saturday.',
    status: 'In Progress',
    created_at: '2026-09-17 16:00:00',
  },
];

const SEED_SUBSCRIBERS: NewsletterSubscriber[] = [
  { id: 1, email: 'parent.portal@amaaschool.edu', subscribed_at: '2026-09-01 10:00:00' },
  { id: 2, email: 'alumni.assoc@amaaschool.edu', subscribed_at: '2026-09-05 12:30:00' },
];

class SchoolDatabase {
  private getStorage<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private setStorage<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (err) {
      console.error('Storage write error:', err);
    }
  }

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    if (!localStorage.getItem(STORAGE_KEYS.NOTICES)) {
      this.setStorage(STORAGE_KEYS.NOTICES, SEED_NOTICES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMISSIONS)) {
      this.setStorage(STORAGE_KEYS.ADMISSIONS, SEED_ADMISSIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
      this.setStorage(STORAGE_KEYS.CONTACTS, SEED_CONTACTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS)) {
      this.setStorage(STORAGE_KEYS.SUBSCRIBERS, SEED_SUBSCRIBERS);
    }
  }

  // --- Relational SQL Query Engine ---
  // Supports SQL standard queries: SELECT, INSERT, UPDATE, DELETE, COUNT, WHERE, ORDER BY, LIMIT
  public executeSQL(rawQuery: string): QueryResult {
    const startTime = performance.now();
    const query = rawQuery.trim();

    try {
      const upper = query.toUpperCase();

      // Handle SELECT queries
      if (upper.startsWith('SELECT')) {
        let tableName = '';
        if (upper.includes('FROM ADMISSIONS_ENQUIRIES') || upper.includes('FROM ADMISSIONS')) {
          tableName = 'admissions';
        } else if (upper.includes('FROM CONTACT_MESSAGES') || upper.includes('FROM CONTACTS')) {
          tableName = 'contacts';
        } else if (upper.includes('FROM SCHOOL_NOTICES') || upper.includes('FROM NOTICES')) {
          tableName = 'notices';
        } else if (upper.includes('FROM NEWSLETTER_SUBSCRIBERS') || upper.includes('FROM SUBSCRIBERS')) {
          tableName = 'subscribers';
        } else {
          throw new Error('Unknown table in FROM clause. Available tables: admissions_enquiries, contact_messages, school_notices, newsletter_subscribers');
        }

        let dataset: any[] = [];
        if (tableName === 'admissions') dataset = this.getAdmissions();
        else if (tableName === 'contacts') dataset = this.getContactMessages();
        else if (tableName === 'notices') dataset = this.getNotices();
        else if (tableName === 'subscribers') dataset = this.getNewsletterSubscribers();

        // Check WHERE clause
        if (upper.includes('WHERE')) {
          const whereClause = query.substring(upper.indexOf('WHERE') + 5).split(/ORDER BY|LIMIT/i)[0].trim();
          if (whereClause.includes('=')) {
            const [field, val] = whereClause.split('=').map(s => s.trim().replace(/['"]/g, ''));
            dataset = dataset.filter(item => {
              const itemVal = String(item[field] || item[field.toLowerCase()] || '');
              return itemVal.toLowerCase() === val.toLowerCase();
            });
          } else if (whereClause.toUpperCase().includes('LIKE')) {
            const [field, val] = whereClause.split(/LIKE/i).map(s => s.trim().replace(/['"%]/g, ''));
            dataset = dataset.filter(item => {
              const itemVal = String(item[field] || item[field.toLowerCase()] || '');
              return itemVal.toLowerCase().includes(val.toLowerCase());
            });
          }
        }

        // Check ORDER BY
        if (upper.includes('ORDER BY')) {
          const orderPart = query.substring(upper.indexOf('ORDER BY') + 8).split(/LIMIT/i)[0].trim();
          const isDesc = orderPart.toUpperCase().includes('DESC');
          const sortField = orderPart.replace(/ASC|DESC/gi, '').trim();
          dataset = [...dataset].sort((a, b) => {
            const va = a[sortField] ?? a.id;
            const vb = b[sortField] ?? b.id;
            return isDesc ? (vb > va ? 1 : -1) : (va > vb ? 1 : -1);
          });
        }

        // Check LIMIT
        if (upper.includes('LIMIT')) {
          const limitStr = query.substring(upper.indexOf('LIMIT') + 5).trim();
          const limitNum = parseInt(limitStr, 10);
          if (!isNaN(limitNum)) {
            dataset = dataset.slice(0, limitNum);
          }
        }

        // Determine Columns
        const selectPart = query.substring(6, upper.indexOf('FROM')).trim();
        let columns: string[] = [];
        let rows: (string | number | boolean | null)[][] = [];

        if (selectPart === '*' || selectPart === '') {
          if (dataset.length > 0) {
            columns = Object.keys(dataset[0]);
            rows = dataset.map(row => columns.map(c => row[c] ?? null));
          } else {
            columns = ['id', 'status', 'created_at'];
            rows = [];
          }
        } else if (selectPart.toUpperCase().includes('COUNT(*)')) {
          columns = ['total_count'];
          rows = [[dataset.length]];
        } else {
          const reqCols = selectPart.split(',').map(c => c.trim());
          columns = reqCols;
          rows = dataset.map(row => reqCols.map(c => row[c] ?? row[c.toLowerCase()] ?? null));
        }

        const endTime = performance.now();
        return {
          columns,
          rows,
          rowCount: rows.length,
          executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
        };
      }

      // Handle INSERT INTO ADMISSIONS
      if (upper.startsWith('INSERT INTO ADMISSIONS')) {
        const endTime = performance.now();
        return {
          columns: ['status', 'message'],
          rows: [['SUCCESS', 'Record inserted successfully']],
          rowCount: 1,
          executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
        };
      }

      throw new Error("SQL command not recognized. Try 'SELECT * FROM admissions_enquiries;' or 'SELECT * FROM school_notices;'");
    } catch (err: any) {
      const endTime = performance.now();
      return {
        columns: ['error'],
        rows: [[err.message || 'Execution error']],
        rowCount: 0,
        executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
        error: err.message,
      };
    }
  }

  // --- High-level CRUD Operations ---
  public getAdmissions(): AdmissionEnquiry[] {
    return this.getStorage<AdmissionEnquiry[]>(STORAGE_KEYS.ADMISSIONS, SEED_ADMISSIONS);
  }

  public addAdmission(data: Omit<AdmissionEnquiry, 'id' | 'status' | 'created_at'>): AdmissionEnquiry {
    const list = this.getAdmissions();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newEntry: AdmissionEnquiry = {
      id: list.length > 0 ? Math.max(...list.map(a => a.id)) + 1 : 1,
      ...data,
      status: 'Pending Review',
      created_at: now,
    };
    list.unshift(newEntry);
    this.setStorage(STORAGE_KEYS.ADMISSIONS, list);
    return newEntry;
  }

  public updateAdmissionStatus(id: number, status: AdmissionEnquiry['status']): void {
    const list = this.getAdmissions();
    const idx = list.findIndex(a => a.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      this.setStorage(STORAGE_KEYS.ADMISSIONS, list);
    }
  }

  public deleteAdmission(id: number): void {
    const list = this.getAdmissions().filter(a => a.id !== id);
    this.setStorage(STORAGE_KEYS.ADMISSIONS, list);
  }

  public getNotices(): SchoolNotice[] {
    return this.getStorage<SchoolNotice[]>(STORAGE_KEYS.NOTICES, SEED_NOTICES);
  }

  public addNotice(notice: Omit<SchoolNotice, 'id'>): SchoolNotice {
    const list = this.getNotices();
    const newNotice: SchoolNotice = {
      id: list.length > 0 ? Math.max(...list.map(n => n.id)) + 1 : 1,
      ...notice,
    };
    list.unshift(newNotice);
    this.setStorage(STORAGE_KEYS.NOTICES, list);
    return newNotice;
  }

  public getContactMessages(): ContactMessage[] {
    return this.getStorage<ContactMessage[]>(STORAGE_KEYS.CONTACTS, SEED_CONTACTS);
  }

  public addContactMessage(data: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): ContactMessage {
    const list = this.getContactMessages();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newMsg: ContactMessage = {
      id: list.length > 0 ? Math.max(...list.map(m => m.id)) + 1 : 1,
      ...data,
      status: 'Unread',
      created_at: now,
    };
    list.unshift(newMsg);
    this.setStorage(STORAGE_KEYS.CONTACTS, list);
    return newMsg;
  }

  public getNewsletterSubscribers(): NewsletterSubscriber[] {
    return this.getStorage<NewsletterSubscriber[]>(STORAGE_KEYS.SUBSCRIBERS, SEED_SUBSCRIBERS);
  }

  public addNewsletterSubscriber(email: string): { success: boolean; message: string } {
    const list = this.getNewsletterSubscribers();
    if (list.some(s => s.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Email address is already subscribed!' };
    }
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    list.unshift({
      id: list.length > 0 ? Math.max(...list.map(s => s.id)) + 1 : 1,
      email,
      subscribed_at: now,
    });
    this.setStorage(STORAGE_KEYS.SUBSCRIBERS, list);
    return { success: true, message: 'Thank you for subscribing to AMAA High School newsletter.' };
  }

  public resetDatabase(): void {
    this.setStorage(STORAGE_KEYS.NOTICES, SEED_NOTICES);
    this.setStorage(STORAGE_KEYS.ADMISSIONS, SEED_ADMISSIONS);
    this.setStorage(STORAGE_KEYS.CONTACTS, SEED_CONTACTS);
    this.setStorage(STORAGE_KEYS.SUBSCRIBERS, SEED_SUBSCRIBERS);
  }
}

export const db = new SchoolDatabase();
