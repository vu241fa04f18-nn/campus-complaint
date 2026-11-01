import React, { useEffect, useState } from 'react';
import { StudentLayout } from '../../components/layout/StudentLayout';
import { useApp } from '../../context/AppContext';
import { getStudentMarks } from '../../utils/storage';
import { FACULTY_SUBJECT_MAP, getFacultyForSubject } from '../../data/demoData';

const StudentFaculty = () => {
  const { session } = useApp();
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    if (session) setMarks(getStudentMarks(session.regNo) || []);
  }, [session]);

  const branch = session?.branch || 'CSE';
  const subjects = marks.map((m) => m.subject);

  // Derive unique faculty from subjects
  const facultyMap = {};
  subjects.forEach((sub) => {
    const fi = getFacultyForSubject(branch, sub);
    if (!facultyMap[fi.facultyId]) {
      facultyMap[fi.facultyId] = { ...fi, subjects: [] };
    }
    facultyMap[fi.facultyId].subjects.push(sub);
  });
  const facultyList = Object.values(facultyMap);

  return (
    <StudentLayout title="Faculty & TAs">
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
        Below are the faculty and Teaching Assistants assigned to your class subjects.
      </p>

      <div className="grid-2">
        {facultyList.map((f) => (
          <div key={f.facultyId} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: '#059669', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, flexShrink: 0
              }}>
                {f.facultyName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700 }}>{f.facultyName}</h4>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Faculty ID: {f.facultyId}</p>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Subjects Taught</p>
              {f.subjects.map((s) => (
                <span key={s} className="badge badge-blue" style={{ marginRight: 6, marginBottom: 4 }}>{s}</span>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'var(--accent-light)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700
                }}>
                  {f.taName?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{f.taName}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Teaching Assistant</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </StudentLayout>
  );
};

export default StudentFaculty;
