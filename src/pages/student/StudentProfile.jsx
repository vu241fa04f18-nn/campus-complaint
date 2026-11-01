import React, { useEffect, useState } from 'react';
import { StudentLayout } from '../../components/layout/StudentLayout';
import { useApp } from '../../context/AppContext';
import { getStudentByRegNo } from '../../utils/storage';
import { BRANCH_LABELS } from '../../data/demoData';

const StudentProfile = () => {
  const { session } = useApp();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (session) setStudent(getStudentByRegNo(session.regNo));
  }, [session]);

  if (!student) return <StudentLayout title="My Profile"><p>Loading...</p></StudentLayout>;

  const fields = [
    { label: 'Full Name', value: student.name },
    { label: 'Registration Number', value: student.regNo },
    { label: 'Email', value: student.email },
    { label: 'Phone Number', value: student.phone },
    { label: 'Branch', value: `${student.branch} – ${BRANCH_LABELS[student.branch] || student.branch}` },
    { label: 'Academic Year', value: student.academicYear },
    { label: 'Semester', value: student.semester },
    { label: 'Section', value: student.section },
    { label: 'Class Teacher', value: student.classTeacher || 'Sravani Madam' },
  ];

  const initials = student.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <StudentLayout title="My Profile">
      <div className="card" style={{ maxWidth: 800 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--primary)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 700, flexShrink: 0
          }}>
            {initials}
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{student.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Reg No: {student.regNo} &nbsp;•&nbsp; {student.branch} &nbsp;•&nbsp; {student.section}</p>
            <span className="badge badge-blue" style={{ marginTop: 6 }}>Student</span>
          </div>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18, color: 'var(--text-secondary)' }}>Personal & Academic Information</h3>
        <div className="profile-section">
          {fields.map((f) => (
            <div key={f.label} className="profile-field" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <label>{f.label}</label>
              <span>{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentProfile;
