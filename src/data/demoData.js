// Demo data initializer for CAMPUS portal
import {
  getStudents,
  saveStudents,
  getFaculty,
  saveFaculty,
  getAllMarks,
  setItem,
  getAllAttendance,
  initRegCounter,
  addNotification,
  addComplaint,
  addEvent,
  getEvents,
} from '../utils/storage';

// ─── Branches & Sections ───────────────────────────────────────────────────────
export const BRANCHES = [
  'CSE',
  'ECE',
  'EEE',
  'Mechanical Engineering',
  'Civil Engineering',
  'IT',
  'AI & ML',
  'Data Science',
];

export const BRANCH_LABELS = {
  CSE: 'Computer Science and Engineering',
  ECE: 'Electronics and Communication Engineering',
  EEE: 'Electrical and Electronics Engineering',
  'Mechanical Engineering': 'Mechanical Engineering',
  'Civil Engineering': 'Civil Engineering',
  IT: 'Information Technology',
  'AI & ML': 'Artificial Intelligence and Machine Learning',
  'Data Science': 'Data Science',
};

export const SECTIONS = ['Sec 1', 'Sec 2', 'Sec 3', 'Sec 4', 'Sec 5'];

export const ACADEMIC_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
export const SEMESTERS = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];

// ─── Subjects per Branch ──────────────────────────────────────────────────────
export const SUBJECTS_BY_BRANCH = {
  CSE: [
    'Python Programming',
    'Java Programming',
    'Data Structures and Algorithms',
    'Database Management Systems',
    'Web Development',
    'Object-Oriented Programming',
    'Operating Systems',
    'Computer Networks',
  ],
  ECE: [
    'Electronic Circuits',
    'Digital Signal Processing',
    'Communication Systems',
    'Microprocessors',
    'VLSI Design',
    'Electromagnetic Theory',
    'Control Systems',
    'Antenna and Wave Propagation',
  ],
  EEE: [
    'Power Systems',
    'Electrical Machines',
    'Control Systems',
    'Power Electronics',
    'Electrical Measurements',
    'High Voltage Engineering',
    'Renewable Energy Systems',
    'Switchgear and Protection',
  ],
  'Mechanical Engineering': [
    'Thermodynamics',
    'Fluid Mechanics',
    'Strength of Materials',
    'Manufacturing Technology',
    'Machine Design',
    'Heat Transfer',
    'CAD/CAM',
    'Robotics',
  ],
  'Civil Engineering': [
    'Structural Analysis',
    'Soil Mechanics',
    'Fluid Mechanics',
    'Surveying',
    'Concrete Technology',
    'Environmental Engineering',
    'Transportation Engineering',
    'Construction Management',
  ],
  IT: [
    'Python Programming',
    'Web Technologies',
    'Database Systems',
    'Network Security',
    'Cloud Computing',
    'Software Engineering',
    'Mobile Application Development',
    'Information Security',
  ],
  'AI & ML': [
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Data Mining',
    'Neural Networks',
    'Reinforcement Learning',
    'Big Data Analytics',
  ],
  'Data Science': [
    'Statistics for Data Science',
    'Data Visualization',
    'Machine Learning',
    'Data Mining',
    'Business Intelligence',
    'Python for Data Science',
    'Big Data Technologies',
    'Predictive Analytics',
  ],
};

// ─── Demo Faculty ─────────────────────────────────────────────────────────────
export const DEMO_FACULTY = [
  {
    facultyId: 'FAC101',
    password: 'Faculty@123',
    name: 'Sravani Madam',
    email: 'sravani@campus.edu',
    phone: '9876543210',
    department: 'CSE',
    designation: 'Assistant Professor',
    subject: 'Python Programming',
    branch: 'CSE',
    sections: ['Sec 1', 'Sec 2'],
    taName: 'Kiran Kumar',
    classTeacher: 'Sec 1',
  },
  {
    facultyId: 'FAC102',
    password: 'Faculty@123',
    name: 'Ramesh Sir',
    email: 'ramesh@campus.edu',
    phone: '9876543211',
    department: 'CSE',
    designation: 'Associate Professor',
    subject: 'Java Programming',
    branch: 'CSE',
    sections: ['Sec 1', 'Sec 2'],
    taName: 'Priya Sharma',
    classTeacher: 'Sec 2',
  },
  {
    facultyId: 'FAC103',
    password: 'Faculty@123',
    name: 'Lakshmi Madam',
    email: 'lakshmi@campus.edu',
    phone: '9876543212',
    department: 'CSE',
    designation: 'Assistant Professor',
    subject: 'Data Structures and Algorithms',
    branch: 'CSE',
    sections: ['Sec 1', 'Sec 2', 'Sec 3'],
    taName: 'Suresh Babu',
    classTeacher: 'Sec 3',
  },
];

// ─── Demo Students ────────────────────────────────────────────────────────────
export const DEMO_STUDENTS = [
  { regNo: 1011, name: 'Mani Kumar', email: 'mani@student.edu', phone: '9100000001', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Sravani Madam' },
  { regNo: 1012, name: 'Geethika Reddy', email: 'geethika@student.edu', phone: '9100000002', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Sravani Madam' },
  { regNo: 1013, name: 'Abhi Srinivas', email: 'abhi@student.edu', phone: '9100000003', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Sravani Madam' },
  { regNo: 1014, name: 'Ravi Teja', email: 'ravi@student.edu', phone: '9100000004', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Sravani Madam' },
  { regNo: 1015, name: 'Kiran Babu', email: 'kiran@student.edu', phone: '9100000005', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Sravani Madam' },
  { regNo: 1016, name: 'Sravani Devi', email: 'sravanid@student.edu', phone: '9100000006', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Sravani Madam' },
  { regNo: 1017, name: 'Harika Nair', email: 'harika@student.edu', phone: '9100000007', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Sravani Madam' },
  { regNo: 1018, name: 'Priya Kumari', email: 'priya@student.edu', phone: '9100000008', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Sravani Madam' },
  { regNo: 1019, name: 'Sai Krishna', email: 'sai@student.edu', phone: '9100000009', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Sravani Madam' },
  { regNo: 1020, name: 'Rahul Sharma', email: 'rahul@student.edu', phone: '9100000010', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Sravani Madam' },
  { regNo: 1021, name: 'Anjali Singh', email: 'anjali@student.edu', phone: '9100000011', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 2', password: 'Student@123', classTeacher: 'Ramesh Sir' },
  { regNo: 1022, name: 'Deepak Rao', email: 'deepak@student.edu', phone: '9100000012', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 2', password: 'Student@123', classTeacher: 'Ramesh Sir' },
  { regNo: 1023, name: 'Meghana Pillai', email: 'meghana@student.edu', phone: '9100000013', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 2', password: 'Student@123', classTeacher: 'Ramesh Sir' },
  { regNo: 1024, name: 'Nikhil Patel', email: 'nikhil@student.edu', phone: '9100000014', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 2', password: 'Student@123', classTeacher: 'Ramesh Sir' },
  { regNo: 1025, name: 'Pooja Verma', email: 'pooja@student.edu', phone: '9100000015', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 2', password: 'Student@123', classTeacher: 'Ramesh Sir' },
  { regNo: 1026, name: 'Arjun Menon', email: 'arjun@student.edu', phone: '9100000016', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 2', password: 'Student@123', classTeacher: 'Ramesh Sir' },
  { regNo: 1027, name: 'Kavitha Nair', email: 'kavitha@student.edu', phone: '9100000017', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 2', password: 'Student@123', classTeacher: 'Ramesh Sir' },
  { regNo: 1028, name: 'Suresh Babu', email: 'suresh@student.edu', phone: '9100000018', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 3', password: 'Student@123', classTeacher: 'Lakshmi Madam' },
  { regNo: 1029, name: 'Divya Lakshmi', email: 'divya@student.edu', phone: '9100000019', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 3', password: 'Student@123', classTeacher: 'Lakshmi Madam' },
  { regNo: 1030, name: 'Vikram Singh', email: 'vikram@student.edu', phone: '9100000020', branch: 'CSE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 3', password: 'Student@123', classTeacher: 'Lakshmi Madam' },
  { regNo: 1031, name: 'Aisha Khan', email: 'aisha@student.edu', phone: '9100000021', branch: 'ECE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Dr. Venkat' },
  { regNo: 1032, name: 'Rohit Kumar', email: 'rohit@student.edu', phone: '9100000022', branch: 'ECE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Dr. Venkat' },
  { regNo: 1033, name: 'Sneha Gupta', email: 'sneha@student.edu', phone: '9100000023', branch: 'IT', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Mr. Prasad' },
  { regNo: 1034, name: 'Tarun Mehta', email: 'tarun@student.edu', phone: '9100000024', branch: 'IT', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Mr. Prasad' },
  { regNo: 1035, name: 'Nandini Iyer', email: 'nandini@student.edu', phone: '9100000025', branch: 'AI & ML', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Ms. Swathi' },
  { regNo: 1036, name: 'Prasad Goud', email: 'prasad@student.edu', phone: '9100000026', branch: 'AI & ML', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Ms. Swathi' },
  { regNo: 1037, name: 'Swathi Reddy', email: 'swathi@student.edu', phone: '9100000027', branch: 'Data Science', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Dr. Murali' },
  { regNo: 1038, name: 'Ganesh Rao', email: 'ganesh@student.edu', phone: '9100000028', branch: 'Data Science', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Dr. Murali' },
  { regNo: 1039, name: 'Bhavana Sai', email: 'bhavana@student.edu', phone: '9100000029', branch: 'EEE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Prof. Raju' },
  { regNo: 1040, name: 'Charan Teja', email: 'charan@student.edu', phone: '9100000030', branch: 'EEE', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Prof. Raju' },
  { regNo: 1041, name: 'Lavanya Prasad', email: 'lavanya@student.edu', phone: '9100000031', branch: 'Mechanical Engineering', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Dr. Suresh' },
  { regNo: 1042, name: 'Manoj Varma', email: 'manoj@student.edu', phone: '9100000032', branch: 'Mechanical Engineering', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Dr. Suresh' },
  { regNo: 1043, name: 'Padma Vathi', email: 'padma@student.edu', phone: '9100000033', branch: 'Civil Engineering', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Prof. Anand' },
  { regNo: 1044, name: 'Raghu Nandan', email: 'raghu@student.edu', phone: '9100000034', branch: 'Civil Engineering', academicYear: '2nd Year', semester: 'Sem 3', section: 'Sec 1', password: 'Student@123', classTeacher: 'Prof. Anand' },
  { regNo: 1045, name: 'Sushma Rani', email: 'sushma@student.edu', phone: '9100000035', branch: 'CSE', academicYear: '3rd Year', semester: 'Sem 5', section: 'Sec 1', password: 'Student@123', classTeacher: 'Sravani Madam' },
  { regNo: 1046, name: 'Teja Varma', email: 'teja@student.edu', phone: '9100000036', branch: 'CSE', academicYear: '3rd Year', semester: 'Sem 5', section: 'Sec 1', password: 'Student@123', classTeacher: 'Sravani Madam' },
  { regNo: 1047, name: 'Usha Rani', email: 'usha@student.edu', phone: '9100000037', branch: 'CSE', academicYear: '3rd Year', semester: 'Sem 5', section: 'Sec 1', password: 'Student@123', classTeacher: 'Sravani Madam' },
  { regNo: 1048, name: 'Venu Gopal', email: 'venu@student.edu', phone: '9100000038', branch: 'CSE', academicYear: '3rd Year', semester: 'Sem 5', section: 'Sec 2', password: 'Student@123', classTeacher: 'Ramesh Sir' },
  { regNo: 1049, name: 'Yamini Krishna', email: 'yamini@student.edu', phone: '9100000039', branch: 'CSE', academicYear: '3rd Year', semester: 'Sem 5', section: 'Sec 2', password: 'Student@123', classTeacher: 'Ramesh Sir' },
  { regNo: 1050, name: 'Zara Begum', email: 'zara@student.edu', phone: '9100000040', branch: 'CSE', academicYear: '3rd Year', semester: 'Sem 5', section: 'Sec 2', password: 'Student@123', classTeacher: 'Ramesh Sir' },
];

// ─── Demo Marks ───────────────────────────────────────────────────────────────
// Returns marks for CSE subjects
const CSE_SUBJECTS = [
  'Python Programming',
  'Java Programming',
  'Data Structures and Algorithms',
  'Database Management Systems',
  'Web Development',
  'Object-Oriented Programming',
  'Operating Systems',
  'Computer Networks',
];

// Faculty mapping for CSE subjects
export const FACULTY_SUBJECT_MAP = {
  CSE: {
    'Python Programming': { facultyId: 'FAC101', facultyName: 'Sravani Madam', taName: 'Kiran Kumar' },
    'Java Programming': { facultyId: 'FAC102', facultyName: 'Ramesh Sir', taName: 'Priya Sharma' },
    'Data Structures and Algorithms': { facultyId: 'FAC103', facultyName: 'Lakshmi Madam', taName: 'Suresh Babu' },
    'Database Management Systems': { facultyId: 'FAC101', facultyName: 'Sravani Madam', taName: 'Kiran Kumar' },
    'Web Development': { facultyId: 'FAC102', facultyName: 'Ramesh Sir', taName: 'Priya Sharma' },
    'Object-Oriented Programming': { facultyId: 'FAC103', facultyName: 'Lakshmi Madam', taName: 'Suresh Babu' },
    'Operating Systems': { facultyId: 'FAC101', facultyName: 'Sravani Madam', taName: 'Kiran Kumar' },
    'Computer Networks': { facultyId: 'FAC102', facultyName: 'Ramesh Sir', taName: 'Priya Sharma' },
  },
};

const marksData = [85, 72, 90, 56, 78, 92, 63, 88, 74, 81, 67, 95, 58, 76, 82, 89, 61, 70, 84, 77, 91, 53, 86, 69, 93, 75, 66, 80, 88, 71, 94, 59, 87, 73, 96, 62, 79, 85, 68, 83];
const attendanceData = [92, 85, 96, 68, 88, 94, 72, 90, 79, 86, 71, 98, 63, 82, 91, 93, 67, 77, 89, 84, 97, 58, 88, 74, 95, 81, 69, 87, 92, 76, 99, 62, 91, 78, 97, 65, 83, 88, 71, 86];

const generateSubjectMarks = (baseMarks, subjects) => {
  return subjects.map((sub, i) => {
    const variation = (i % 3 === 0 ? 5 : i % 3 === 1 ? -5 : 3);
    const marks = Math.min(100, Math.max(30, baseMarks + variation));
    return { subject: sub, obtained: marks, max: 100 };
  });
};

const generateSubjectAttendance = (baseAtt, subjects) => {
  return subjects.map((sub, i) => {
    const variation = (i % 3 === 0 ? 3 : i % 3 === 1 ? -4 : 2);
    const pct = Math.min(100, Math.max(40, baseAtt + variation));
    const total = 60;
    const attended = Math.round((pct / 100) * total);
    return { subject: sub, attended, total, missed: total - attended, percentage: Math.round((attended / total) * 100) };
  });
};

export const getSubjectsForStudent = (branch) => SUBJECTS_BY_BRANCH[branch] || SUBJECTS_BY_BRANCH.CSE;

export const getFacultyForSubject = (branch, subject) => {
  const map = FACULTY_SUBJECT_MAP[branch];
  if (!map) return { facultyId: 'FAC101', facultyName: 'Sravani Madam', taName: 'N/A' };
  return map[subject] || { facultyId: 'FAC101', facultyName: 'Sravani Madam', taName: 'N/A' };
};

export const getPerformanceCategory = (pct) => {
  if (pct >= 85) return 'Top Performer';
  if (pct >= 70) return 'Good Performance';
  if (pct >= 55) return 'Average Performance';
  return 'Needs Improvement';
};

export const getAttendanceStatus = (pct) => {
  if (pct >= 90) return { label: 'Good', color: 'green' };
  if (pct >= 75) return { label: 'Satisfactory', color: 'orange' };
  if (pct >= 65) return { label: 'Low Attendance Warning', color: 'red' };
  return { label: 'Critical Warning', color: 'darkred' };
};

// ─── Initialize demo data ─────────────────────────────────────────────────────
export const initializeDemoData = () => {
  // Initialize reg counter at 1050 (last demo student)
  initRegCounter(1050);

  // Students
  if (getStudents().length === 0) {
    saveStudents(DEMO_STUDENTS);
  }

  // Faculty
  if (getFaculty().length === 0) {
    saveFaculty(DEMO_FACULTY);
  }

  // Marks & Attendance
  const existingMarks = getAllMarks();
  const existingAtt = getAllAttendance();
  const newMarks = { ...existingMarks };
  const newAtt = { ...existingAtt };

  DEMO_STUDENTS.forEach((student, i) => {
    const key = String(student.regNo);
    const subjects = getSubjectsForStudent(student.branch);
    const base = marksData[i % marksData.length];
    const attBase = attendanceData[i % attendanceData.length];

    if (!newMarks[key]) {
      newMarks[key] = generateSubjectMarks(base, subjects);
    }
    if (!newAtt[key]) {
      newAtt[key] = generateSubjectAttendance(attBase, subjects);
    }
  });

  setItem('campus_marks', newMarks);
  setItem('campus_attendance', newAtt);
};

// ─── Initialize new student academic data ─────────────────────────────────────
export const initializeNewStudentData = (regNo, branch) => {
  // Generate realistic marks and attendance for the new student using demo generation logic
  const subjects = getSubjectsForStudent(branch);
  const existingMarks = getAllMarks();
  const existingAtt = getAllAttendance();
  const key = String(regNo);

  // Choose random base values from the demo pools
  const baseMark = marksData[Math.floor(Math.random() * marksData.length)];
  const baseAtt = attendanceData[Math.floor(Math.random() * attendanceData.length)];

  // Populate marks if not present
  if (!existingMarks[key]) {
    const marks = generateSubjectMarks(baseMark, subjects);
    existingMarks[key] = marks;
    setItem('campus_marks', existingMarks);
  }

  // Populate attendance if not present
  if (!existingAtt[key]) {
    const att = generateSubjectAttendance(baseAtt, subjects);
    existingAtt[key] = att;
    setItem('campus_attendance', existingAtt);
  }

  // Add a welcome notification for the student
  addNotification({
    regNo,
    title: 'Welcome to CAMPUS',
    message: `Your account has been created with registration number ${regNo}. Explore your dashboard for marks, attendance, events and more.`,
    type: 'info',
  });

  // Create a couple of sample complaints so the dashboard is not empty
  const complaint1 = {
    id: Date.now().toString(),
    regNo,
    subject: subjects[0] || 'General',
    description: 'Sample complaint: Issue with marks entry.',
    status: 'Submitted',
    response: '',
    createdAt: new Date().toISOString(),
  };
  const complaint2 = {
    id: (Date.now() + 1).toString(),
    regNo,
    subject: subjects[1] || 'General',
    description: 'Sample complaint: Attendance not updated.',
    status: 'Submitted',
    response: '',
    createdAt: new Date().toISOString(),
  };
  addComplaint(complaint1);
  addComplaint(complaint2);

  // Ensure there is at least one upcoming event for the student's branch/section
  const events = getEvents();
  const hasBranchEvent = events.some(
    (e) => e.branch === branch && e.section === null // branch-wide event
  );
  if (!hasBranchEvent) {
    const newEvent = {
      id: Date.now().toString(),
      title: `${branch} Seminar`,
      description: `A ${branch} focused seminar for students.`,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // one week later
      branch,
      section: null,
      createdAt: new Date().toISOString(),
    };
    addEvent(newEvent);
  }
};