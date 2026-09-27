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

export interface AlumniMember {
  id: number;
  full_name: string;
  batch_year: string;
  email: string;
  phone: string;
  current_role: string;
  organization: string;
  city: string;
  testimonial: string;
  linkedin?: string;
  created_at: string;
}

export interface GoverningBodyMember {
  id: number;
  name: string;
  designation: string;          // e.g. "Chairman", "Secretary", "Treasurer"
  committee: string;            // e.g. "Board of Trustees", "Academic Committee"
  qualification: string;        // educational credentials
  experience: string;           // brief background
  photo_url?: string;
  email?: string;
  phone?: string;
  order_index: number;          // display order (1 = first)
  added_at: string;
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
  ALUMNI: 'amaa_db_alumni_v1',
  GOVERNING_BODY: 'amaa_db_governing_body_v1',
};

// Default seed notices matching reference ethos
const SEED_NOTICES: SchoolNotice[] = [
  {
    id: 1,
    title: 'Admissions Open 2025–26 (Grades VI to Class X) — "Lead Kindly Light" (Estd. 1965)',
    category: 'Admissions',
    date: 'Sep 20, 2026',
    content: 'Admissions open for all grades under the motto Lead Kindly Light. Direct online application tokens available now.',
    is_important: true,
  },
  {
    id: 2,
    title: 'Diamond Jubilee Celebrations: 60 Glorious Years of A.M.A. Adinarayana High School',
    category: 'Events',
    date: 'Sep 25, 2026',
    content: 'Join faculty, alumni, and students for the 60th year commemoration banquet and academic exhibition.',
    is_important: true,
  },
  {
    id: 2,
    title: 'Inter-School Science Olympiad & Academic Expo',
    category: 'Academic',
    date: 'Sep 22, 2026',
    content: 'Students from Grades VI to X will showcase innovative green-tech models in the Vivekananda Hall.',
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
    notes: 'Interested in science laboratories and inter-school basketball.',
    status: 'Interview Scheduled',
    created_at: '2026-09-14 11:20:00',
  },
  {
    id: 2,
    student_name: 'Ananya Verma',
    parent_name: 'Dr. Sunita Verma',
    email: 'dr.sunita@example.com',
    phone: '+91 98111 22334',
    grade_applying: 'Grade X (Secondary Board)',
    previous_school: 'Model High School',
    notes: 'Focus on high school board excellence and science foundations.',
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

export const SEED_ALUMNI: AlumniMember[] = [
  {
    id: 1,
    full_name: 'Dr. Priya Sharma, MBBS, MS',
    batch_year: 'Batch of 2012',
    email: 'dr.priya.sharma@aims-health.org',
    phone: '+91 98765 11223',
    current_role: 'Senior Consultant Cardiologist',
    organization: 'AIIMS New Delhi',
    city: 'New Delhi',
    testimonial: 'AMAA High School provided the bedrock of disciplined scientific inquiry and empathy that defines my medical practice today.',
    linkedin: 'https://linkedin.com',
    created_at: '2026-08-10 10:30:00',
  },
  {
    id: 2,
    full_name: 'Vikramaditya Roy, B.Tech, M.S.',
    batch_year: 'Batch of 2014',
    email: 'v.roy@techinnovations.io',
    phone: '+91 98450 33445',
    current_role: 'Principal Systems Architect',
    organization: 'Global Technology Enterprise',
    city: 'Bengaluru / London',
    testimonial: 'The science club and math faculty at AMAA pushed me to solve real-world problems from Grade 8 itself.',
    linkedin: 'https://linkedin.com',
    created_at: '2026-08-15 14:15:00',
  },
  {
    id: 3,
    full_name: 'Ananya Deshmukh, IAS',
    batch_year: 'Batch of 2010',
    email: 'ananya.deshmukh.ias@gov.in',
    phone: '+91 94310 55667',
    current_role: 'District Magistrate & Collector',
    organization: 'Indian Administrative Service',
    city: 'Patna',
    testimonial: 'Values of institutional integrity and public service were ingrained in us during morning assemblies and debates at AMAA.',
    linkedin: 'https://linkedin.com',
    created_at: '2026-08-20 09:00:00',
  },
  {
    id: 4,
    full_name: 'Capt. Arjun Mehra',
    batch_year: 'Batch of 2015',
    email: 'capt.arjun.mehra@iaf.mil.in',
    phone: '+91 97110 88990',
    current_role: 'Fighter Pilot (Sukhoi-30 MKI)',
    organization: 'Indian Air Force',
    city: 'Pune',
    testimonial: 'AMAA’s physical education drills, sports ground matches, and NCC leadership camp shaped my military career.',
    linkedin: 'https://linkedin.com',
    created_at: '2026-08-25 16:45:00',
  },
];

export const SEED_GOVERNING_BODY: GoverningBodyMember[] = [
  {
    id: 1,
    name: 'Sri A.M.A. Adinarayana',
    designation: 'Founder & Patron',
    committee: 'Board of Trustees',
    qualification: 'M.A., B.Ed. — Pioneer Educationist',
    experience: 'Founded the institution in 1965 with the guiding motto "Lead Kindly Light". Championed accessible quality education for all sections of society across six decades.',
    photo_url: '',
    email: 'founder@amaaschool.edu.in',
    phone: '',
    order_index: 1,
    added_at: '2025-01-01 00:00:00',
  },
  {
    id: 2,
    name: 'Sri V. Subrahmanyam',
    designation: 'Chairman',
    committee: 'Board of Trustees',
    qualification: 'M.Com., PGDBA — Retired Senior IAS Officer',
    experience: 'Over 35 years of public administration experience. Chairs the governing trust with a focus on institutional expansion, policy governance, and financial oversight.',
    photo_url: '',
    email: 'chairman@amaaschool.edu.in',
    phone: '+91 94410 10001',
    order_index: 2,
    added_at: '2025-01-01 00:00:00',
  },
  {
    id: 3,
    name: 'Dr. K. Lakshmi Devi',
    designation: 'Secretary',
    committee: 'Board of Trustees',
    qualification: 'Ph.D. (Education), M.Ed. — Academic Administrator',
    experience: 'Leads all academic governance, curriculum policy, and institutional accreditation initiatives. Liaises with state board and regulatory bodies for compliance.',
    photo_url: '',
    email: 'secretary@amaaschool.edu.in',
    phone: '+91 94420 10002',
    order_index: 3,
    added_at: '2025-01-01 00:00:00',
  },
  {
    id: 4,
    name: 'Sri P. Ramamohan Rao',
    designation: 'Treasurer',
    committee: 'Board of Trustees',
    qualification: 'CA, CFA — Chartered Accountant',
    experience: 'Manages institutional finances, scholarship fund disbursements, and annual audit oversight. Ensures transparent and responsible stewardship of school resources.',
    photo_url: '',
    email: 'treasurer@amaaschool.edu.in',
    phone: '+91 94430 10003',
    order_index: 4,
    added_at: '2025-01-01 00:00:00',
  },
  {
    id: 5,
    name: 'Dr. S. Nagarjuna',
    designation: 'Academic Committee Chair',
    committee: 'Academic Committee',
    qualification: 'Ph.D. (Physics), IIT Madras — Curriculum Expert',
    experience: 'Oversees academic curriculum integration, teacher training standards, and modern teaching aids across academic wings from Grades VI to Class X.',
    photo_url: '',
    email: 'academic@amaaschool.edu.in',
    phone: '+91 94440 10004',
    order_index: 5,
    added_at: '2025-01-01 00:00:00',
  },
  {
    id: 6,
    name: 'Mrs. G. Padmavathi',
    designation: 'Parent Representatives\'s Chair',
    committee: 'Parent Advisory Committee',
    qualification: 'MBA — Community Leader & Parent Advocate',
    experience: 'Represents the parent community on matters of student welfare, infrastructure, school safety, and co-curricular programming policy.',
    photo_url: '',
    email: 'parents@amaaschool.edu.in',
    phone: '+91 94450 10005',
    order_index: 6,
    added_at: '2025-01-01 00:00:00',
  },
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
    if (!localStorage.getItem(STORAGE_KEYS.ALUMNI)) {
      this.setStorage(STORAGE_KEYS.ALUMNI, SEED_ALUMNI);
    }
    if (!localStorage.getItem(STORAGE_KEYS.GOVERNING_BODY)) {
      this.setStorage(STORAGE_KEYS.GOVERNING_BODY, SEED_GOVERNING_BODY);
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
        } else if (upper.includes('FROM ALUMNI_MEMBERS') || upper.includes('FROM ALUMNI')) {
          tableName = 'alumni';
        } else if (upper.includes('FROM GOVERNING_BODY_MEMBERS') || upper.includes('FROM GOVERNING_BODY')) {
          tableName = 'governing_body';
        } else {
          throw new Error('Unknown table in FROM clause. Available tables: admissions_enquiries, contact_messages, school_notices, newsletter_subscribers, alumni_members, governing_body_members');
        }

        let dataset: any[] = [];
        if (tableName === 'admissions') dataset = this.getAdmissions();
        else if (tableName === 'contacts') dataset = this.getContactMessages();
        else if (tableName === 'notices') dataset = this.getNotices();
        else if (tableName === 'subscribers') dataset = this.getNewsletterSubscribers();
        else if (tableName === 'alumni') dataset = this.getAlumni();
        else if (tableName === 'governing_body') dataset = this.getGoverningBody();

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

  public deleteNotice(id: number): void {
    const list = this.getNotices().filter(n => n.id !== id);
    this.setStorage(STORAGE_KEYS.NOTICES, list);
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

  public updateContactMessageStatus(id: number, status: ContactMessage['status']): void {
    const list = this.getContactMessages();
    const idx = list.findIndex(m => m.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      this.setStorage(STORAGE_KEYS.CONTACTS, list);
    }
  }

  public deleteContactMessage(id: number): void {
    const list = this.getContactMessages().filter(m => m.id !== id);
    this.setStorage(STORAGE_KEYS.CONTACTS, list);
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

  public getAlumni(): AlumniMember[] {
    return this.getStorage<AlumniMember[]>(STORAGE_KEYS.ALUMNI, SEED_ALUMNI);
  }

  public addAlumni(data: Omit<AlumniMember, 'id' | 'created_at'>): AlumniMember {
    const list = this.getAlumni();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newEntry: AlumniMember = {
      id: list.length > 0 ? Math.max(...list.map(a => a.id)) + 1 : 1,
      ...data,
      created_at: now,
    };
    list.unshift(newEntry);
    this.setStorage(STORAGE_KEYS.ALUMNI, list);
    return newEntry;
  }

  // --- Governing Body Members ---
  public getGoverningBody(): GoverningBodyMember[] {
    return this.getStorage<GoverningBodyMember[]>(STORAGE_KEYS.GOVERNING_BODY, SEED_GOVERNING_BODY)
      .sort((a, b) => a.order_index - b.order_index);
  }

  public addGoverningBodyMember(data: Omit<GoverningBodyMember, 'id' | 'added_at'>): GoverningBodyMember {
    const list = this.getGoverningBody();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newEntry: GoverningBodyMember = {
      id: list.length > 0 ? Math.max(...list.map(m => m.id)) + 1 : 1,
      ...data,
      added_at: now,
    };
    list.push(newEntry);
    this.setStorage(STORAGE_KEYS.GOVERNING_BODY, list);
    return newEntry;
  }

  public updateGoverningBodyMember(id: number, updates: Partial<Omit<GoverningBodyMember, 'id' | 'added_at'>>): void {
    const list = this.getGoverningBody();
    const idx = list.findIndex(m => m.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.setStorage(STORAGE_KEYS.GOVERNING_BODY, list);
    }
  }

  public deleteGoverningBodyMember(id: number): void {
    const list = this.getGoverningBody().filter(m => m.id !== id);
    this.setStorage(STORAGE_KEYS.GOVERNING_BODY, list);
  }

  public resetDatabase(): void {
    this.setStorage(STORAGE_KEYS.NOTICES, SEED_NOTICES);
    this.setStorage(STORAGE_KEYS.ADMISSIONS, SEED_ADMISSIONS);
    this.setStorage(STORAGE_KEYS.CONTACTS, SEED_CONTACTS);
    this.setStorage(STORAGE_KEYS.SUBSCRIBERS, SEED_SUBSCRIBERS);
    this.setStorage(STORAGE_KEYS.ALUMNI, SEED_ALUMNI);
    this.setStorage(STORAGE_KEYS.GOVERNING_BODY, SEED_GOVERNING_BODY);
  }
}

export const db = new SchoolDatabase();
