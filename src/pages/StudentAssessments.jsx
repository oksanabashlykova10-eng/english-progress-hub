import { CalendarDays,CheckCircle2,Clock3 } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import StudentPageHeader from '../components/StudentPageHeader';
import useFirestoreStudentProgress from '../hooks/useFirestoreStudentProgress';

const terms=['Term 1','Term 2','Term 3','Term 4'];

export default function StudentAssessments(){
  const {assessmentsWithResults:results,loading,error}=useFirestoreStudentProgress();
  return <StudentLayout><div className="student-page subpage">
    <StudentPageHeader eyebrow="ASSESSMENTS" title="My assessment history" subtitle="Every summative result, organised by term."/>
    {loading&&<div className="panel student-data-state">Loading assessment history…</div>}
    {error&&<div className="panel student-data-state error">{error}</div>}
    <div className="term-history">{terms.map(term=>{
      const termResults=results.filter(result=>result.term===term);
      if(!termResults.length)return null;
      return <section className="panel term-section" key={term}>
        <div className="term-heading"><div><span>{term}</span><h2>{term} results</h2></div><small>{termResults.filter(result=>result.statusKey==='completed').length} completed</small></div>
        <div className="history-list">{termResults.map(item=><article className="history-result" key={item.id}>
          <span className={`result-status-icon ${item.status.toLowerCase().replace(' ','-')}`}>{item.statusKey==='completed'?<CheckCircle2 size={19}/>:<Clock3 size={19}/>}</span>
          <div className="history-main"><h3>{item.title}</h3><p>{item.term} · {item.skills.join(', ')}</p><small><CalendarDays size={12}/>{item.date||'Date not set'}</small></div>
          <div className="raw-score"><span>Raw score</span><b>{item.rawScore||'—'}</b></div>
          <div className="history-percent">{item.percentage==null?<span className={`status-pill ${item.status.toLowerCase().replace(' ','-')}`}>{item.status}</span>:<><strong>{item.percentage}%</strong><span className="status-pill completed">{item.status}</span></>}</div>
        </article>)}</div>
      </section>;
    })}</div>
    {!loading&&!error&&!results.length&&<div className="panel student-data-state">No assessment results yet.</div>}
  </div></StudentLayout>;
}
