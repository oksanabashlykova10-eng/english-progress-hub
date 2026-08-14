import { useEffect, useState } from 'react';
import { fetchStudentResults } from './useFirestoreStudentResults';

export default function useFirestoreTeacherStudentResults(studentId) {
  const [state, setState] = useState({ results: [], loading: true, error: null });
  useEffect(() => {
    if (!studentId) { setState({ results: [], loading: false, error: null }); return; }
    let cancelled = false;
    fetchStudentResults(studentId)
      .then(results => { if (!cancelled) setState({ results, loading: false, error: null }); })
      .catch(error => {
        console.error('Unable to load teacher student results:', error);
        if (!cancelled) setState({ results: [], loading: false, error: 'Unable to load the live assessment result.' });
      });
    return () => { cancelled = true; };
  }, [studentId]);
  return state;
}
