// LocalStorage utility functions for CAMPUS portal

// ─── Keys ─────────────────────────────────────────────────────────────────────
const KEYS = {
  STUDENTS: 'campus_students',
  FACULTY: 'campus_faculty',
  MARKS: 'campus_marks',
  ATTENDANCE: 'campus_attendance',
  COMPLAINTS: 'campus_complaints',
  EVENTS: 'campus_events',
  EVENT_REGISTRATIONS: 'campus_event_registrations',
  PARTICIPATION: 'campus_participation',
  NOTIFICATIONS: 'campus_notifications',
  THEME: 'campus_theme',
  SESSION: 'campus_session',
  REG_COUNTER: 'campus_reg_counter',
};

// ─── Generic helpers ───────────────────────────────────────────────────────────
export const getItem = (key) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage write failed', e);
  }
};

// ─── Students ─────────────────────────────────────────────────────────────────
export const getStudents = () => getItem(KEYS.STUDENTS) || [];
export const saveStudents = (arr) => setItem(KEYS.STUDENTS, arr);

export const getStudentByRegNo = (regNo) =>
  getStudents().find((s) => String(s.regNo) === String(regNo)) || null;

export const addStudent = (student) => {
  const students = getStudents();
  students.push(student);
  saveStudents(students);
};

export const updateStudent = (regNo, updates) => {
  const students = getStudents();
  const idx = students.findIndex((s) => String(s.regNo) === String(regNo));
  if (idx !== -1) {
    students[idx] = { ...students[idx], ...updates };
    saveStudents(students);
  }
};

export const nextRegNo = () => {
  const counter = getItem(KEYS.REG_COUNTER) || 1050; // demo data ends ~1050
  const next = counter + 1;
  setItem(KEYS.REG_COUNTER, next);
  return next;
};

export const initRegCounter = (val) => {
  if (!getItem(KEYS.REG_COUNTER)) setItem(KEYS.REG_COUNTER, val);
};

// ─── Faculty ──────────────────────────────────────────────────────────────────
export const getFaculty = () => getItem(KEYS.FACULTY) || [];
export const saveFaculty = (arr) => setItem(KEYS.FACULTY, arr);
export const getFacultyById = (id) =>
  getFaculty().find((f) => f.facultyId === id) || null;

// ─── Marks ────────────────────────────────────────────────────────────────────
export const getAllMarks = () => getItem(KEYS.MARKS) || {};

export const getStudentMarks = (regNo) => {
  const all = getAllMarks();
  return all[String(regNo)] || null;
};

export const saveStudentMarks = (regNo, marks) => {
  const all = getAllMarks();
  all[String(regNo)] = marks;
  setItem(KEYS.MARKS, all);
};

// ─── Attendance ───────────────────────────────────────────────────────────────
export const getAllAttendance = () => getItem(KEYS.ATTENDANCE) || {};

export const getStudentAttendance = (regNo) => {
  const all = getAllAttendance();
  return all[String(regNo)] || null;
};

export const saveStudentAttendance = (regNo, att) => {
  const all = getAllAttendance();
  all[String(regNo)] = att;
  setItem(KEYS.ATTENDANCE, all);
};

// ─── Complaints ───────────────────────────────────────────────────────────────
export const getComplaints = () => getItem(KEYS.COMPLAINTS) || [];
export const saveComplaints = (arr) => setItem(KEYS.COMPLAINTS, arr);

export const addComplaint = (complaint) => {
  const all = getComplaints();
  all.push(complaint);
  saveComplaints(all);
};

export const updateComplaint = (id, updates) => {
  const all = getComplaints();
  const idx = all.findIndex((c) => c.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    saveComplaints(all);
  }
};

export const getComplaintsByStudent = (regNo) =>
  getComplaints().filter((c) => String(c.regNo) === String(regNo));

export const getComplaintsByFaculty = (facultyId) =>
  getComplaints().filter((c) => c.assignedFacultyId === facultyId);

// ─── Events ───────────────────────────────────────────────────────────────────
export const getEvents = () => getItem(KEYS.EVENTS) || [];
export const saveEvents = (arr) => setItem(KEYS.EVENTS, arr);

export const addEvent = (event) => {
  const all = getEvents();
  all.push(event);
  saveEvents(all);
};

export const updateEvent = (id, updates) => {
  const all = getEvents();
  const idx = all.findIndex((e) => e.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    saveEvents(all);
  }
};

// ─── Event Registrations ──────────────────────────────────────────────────────
export const getEventRegistrations = () => getItem(KEYS.EVENT_REGISTRATIONS) || [];
export const saveEventRegistrations = (arr) => setItem(KEYS.EVENT_REGISTRATIONS, arr);

export const registerForEvent = (regNo, eventId, studentName, branch, section) => {
  const all = getEventRegistrations();
  const exists = all.find(
    (r) => String(r.regNo) === String(regNo) && r.eventId === eventId
  );
  if (!exists) {
    all.push({
      id: Date.now().toString(),
      regNo: String(regNo),
      eventId,
      studentName,
      branch,
      section,
      registeredAt: new Date().toISOString(),
      participationStatus: 'Registered',
    });
    saveEventRegistrations(all);
    return true;
  }
  return false;
};

export const updateParticipation = (id, status) => {
  const all = getEventRegistrations();
  const idx = all.findIndex((r) => r.id === id);
  if (idx !== -1) {
    all[idx].participationStatus = status;
    saveEventRegistrations(all);
  }
};

export const getRegistrationsByEvent = (eventId) =>
  getEventRegistrations().filter((r) => r.eventId === eventId);

export const getRegistrationsByStudent = (regNo) =>
  getEventRegistrations().filter((r) => String(r.regNo) === String(regNo));

// ─── Notifications ────────────────────────────────────────────────────────────
export const getNotifications = () => getItem(KEYS.NOTIFICATIONS) || [];
export const saveNotifications = (arr) => setItem(KEYS.NOTIFICATIONS, arr);

export const addNotification = (notification) => {
  const all = getNotifications();
  all.unshift({ ...notification, id: Date.now().toString(), read: false, createdAt: new Date().toISOString() });
  saveNotifications(all);
};

export const markNotificationRead = (id) => {
  const all = getNotifications();
  const idx = all.findIndex((n) => n.id === id);
  if (idx !== -1) {
    all[idx].read = true;
    saveNotifications(all);
  }
};

export const markAllNotificationsRead = (recipientId) => {
  const all = getNotifications();
  all.forEach((n) => {
    if (n.recipientId === recipientId) n.read = true;
  });
  saveNotifications(all);
};

export const getNotificationsForRecipient = (recipientId) =>
  getNotifications().filter((n) => n.recipientId === recipientId);

// ─── Session ──────────────────────────────────────────────────────────────────
export const getSession = () => getItem(KEYS.SESSION);
export const saveSession = (session) => setItem(KEYS.SESSION, session);
export const clearSession = () => localStorage.removeItem(KEYS.SESSION);

// ─── Theme ────────────────────────────────────────────────────────────────────
export const getTheme = () => getItem(KEYS.THEME) || 'light';
export const saveTheme = (theme) => setItem(KEYS.THEME, theme);

// ─── Unique ID generator ──────────────────────────────────────────────────────
export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);
