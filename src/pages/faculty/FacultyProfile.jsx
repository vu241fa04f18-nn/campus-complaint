import React, { useEffect, useState } from 'react';
import { FacultyLayout } from '../../components/layout/FacultyLayout';
import { useApp } from '../../context/AppContext';
import { getFacultyById } from '../../utils/storage';

const FacultyProfile = () => {
  const { session } = useApp();
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    if (session) setFaculty(getFacultyById(session.facultyId));
  }, [session]);

  if (!faculty) return <FacultyLayout title="My Profile"><p>Loading...</p></FacultyLayout>;

  const initials = faculty.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const fields = [
    { label: 'Full Name', value: faculty.name },
    { label: 'Faculty ID', value: faculty.facultyId },
    { label: 'Email', value: faculty.email },
    { label: 'Phone Number', value: faculty.phone },
    { label: 'Department', value: faculty.department },
    { label: 'Designation', value: faculty.designation },
    { label: 'Assigned Subject', value: faculty.subject },
    { label: 'Assigned Branch', value: faculty.branch },
    { label: 'Assigned Sections', value: (faculty.sections || []).join(', ') },
    { label: 'Teaching Assistant', value: faculty.taName },
    { label: 'Class Teacher For', value: faculty.classTeacher || 'N/A' },
  ];

  return (
    <FacultyLayout title="My Profile">
      <div className="card" style={{ maxWidth: 800 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: '#059669', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 700, flexShrink: 0
          }}>
            {initials}
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>{faculty.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{faculty.designation} • {faculty.department}</p>
            <span className="badge badge-green" style={{ marginTop: 6 }}>Faculty</span>
          </div>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18, color: 'var(--text-secondary)' }}>Faculty Information</h3>
        <div className="profile-section">
          {fields.map((f) => (
            <div key={f.label} className="profile-field" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <label>{f.label}</label>
              <span>{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </FacultyLayout>
  );
};

export default FacultyProfile;
