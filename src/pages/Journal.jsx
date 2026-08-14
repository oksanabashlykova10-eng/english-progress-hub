import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import TeacherLayout from '../layouts/TeacherLayout';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import useFirestoreJournal from '../hooks/useFirestoreJournal';
import { gradeLabel,gradeOptions } from '../utils/gradeMapping';

const formatFirestoreDate=value=>{if(!value)return '';const date=typeof value?.toDate==='function'?value.toDate():value instanceof Date?value:new Date(value);return Number.isNaN(date.getTime())?'':date.toLocaleDateString()};

export default function Journal(){
  const [params]=useSearchParams();
  const [classId,setClassId]=useState(params.get('class')||'6b');
  const [term,setTerm]=useState('Term 1');
  const [search,setSearch]=useState('');
  const [editing,setEditing]=useState(null);
  const [saveError,setSaveError]=useState('');
  const firestore=useFirestoreJournal(classId,term);
  const assessments=firestore.assessments;
  const roster=useMemo(()=>firestore.students.filter(student=>student.active&&`${student.name} ${student.email||''}`.toLowerCase().includes(search.toLowerCase())),[firestore.students,search]);

  const getResultForStudentAssessment=(studentId,assessmentId)=>firestore.results.find(result=>result.studentId===studentId&&result.assessmentId===assessmentId);
  const liveResult=(student,assessment)=>getResultForStudentAssessment(student.id,assessment.id);
  const score=(student,assessment,skill)=>{
    const result=liveResult(student,assessment);
    if(result){const firestoreSkill=assessment.firestoreSkillKeys[skill];if(result.status==='absent'||result.status==='not-assessed')return {status:result.status,resultId:result.id,firestoreSkill};const raw=result.scores?.[firestoreSkill];return raw==null?null:{status:result.status,score:Number(raw),max:assessment.skills[skill],percent:Math.round(Number(raw)/assessment.skills[skill]*100),resultId:result.id,firestoreSkill};}
    return null;
  };
  const total=(student,assessment)=>{const values=Object.entries(assessment.skills).map(([skill,max])=>({value:score(student,assessment,skill),max}));if(values.some(item=>!item.value||item.value.status!=='completed'))return null;const earned=values.reduce((sum,item)=>sum+Number(item.value.score),0),max=values.reduce((sum,item)=>sum+Number(item.max),0);return {score:earned,max,percent:Math.round(earned/max*100)}};

  const saveScore=async()=>{
    const {student,assessment,skill,status,raw}=editing;
    const max=assessment.skills[skill],numeric=Number(raw);
    if(status==='completed'&&(raw===''||!Number.isFinite(numeric)||numeric<0||numeric>max)){setSaveError(`Enter a score from 0 to ${max}.`);return;}
    setSaveError('');
    try{
      if(assessment.source==='firestore'){
        const result=liveResult(student,assessment);
        await firestore.upsertScore({resultId:result?.id,studentId:student.id,assessmentId:assessment.id,gradeId:firestore.normalizedGrade,term:assessment.term,status,skill:assessment.firestoreSkillKeys[skill],value:status==='completed'?numeric:undefined});
      }
      setEditing(null);
    }catch(error){console.error('Unable to save journal score:',error);setSaveError('Unable to save this score. Please try again.');}
  };

  return <TeacherLayout title="Журнал" subtitle="Все ученики класса и редактируемые результаты">
    <section className="panel filters"><label>Класс<select value={classId} onChange={event=>setClassId(event.target.value)}>{gradeOptions.map(item=><option key={item.legacyId} value={item.legacyId}>{item.label}</option>)}</select></label><label>Term<select value={term} onChange={event=>setTerm(event.target.value)}>{[1,2,3,4].map(number=><option key={number}>Term {number}</option>)}</select></label><div className="table-search"><Search size={17}/><input value={search} onChange={event=>setSearch(event.target.value)} placeholder="Найти ученика..."/></div></section>
    {firestore.loading&&<div className="journal-live-state">Loading live result…</div>}{firestore.error&&<div className="journal-live-state error">{firestore.error}</div>}
    {assessments.length===0?<section className="panel journal-empty"><h2>No assessments yet</h2><p>There are no assessments for<br/><b>{gradeLabel(classId)} · {term}</b>.</p><p>Create an assessment in Works to start entering results.</p></section>:<section className="panel table-panel"><div className="table-scroll"><table className="gradebook dynamic-gradebook"><thead><tr><th rowSpan="2" className="student-col">Ученик</th>{assessments.map(assessment=><th key={assessment.id} colSpan={Object.keys(assessment.skills).length+1}>{assessment.title}<small>{formatFirestoreDate(assessment.date)}</small></th>)}</tr><tr>{assessments.flatMap(assessment=>[...Object.entries(assessment.skills).map(([skill,max])=><th key={assessment.id+skill}>{skill}<small>max {max}</small></th>),<th key={assessment.id+'total'} className="total-head">Total</th>])}</tr></thead><tbody>{roster.map(student=><tr key={student.id}><td className="student-cell"><Avatar student={student} size="mini"/><Link to={`/teacher/student/${student.id}`}><b>{student.name}</b><small>Class {gradeLabel(student.gradeId)}</small></Link></td>{assessments.flatMap(assessment=>[...Object.entries(assessment.skills).map(([skill,max])=>{const value=score(student,assessment,skill);return <td className="editable-score" key={assessment.id+skill} onClick={()=>setEditing({student,assessment,skill,status:value?.status||'completed',raw:value?.score??''})}>{value?.status==='absent'?'Absent':value?.status==='not-assessed'?'Not assessed':value?<><b>{value.score}/{max}</b><small>{value.percent}%</small></>:'Click to enter'}</td>}),(()=>{const value=total(student,assessment);return <td className="total-cell" key={assessment.id+'total'}>{value?<><b>{value.score}/{value.max}</b><small>{value.percent}%</small></>:'—'}</td>})()])}</tr>)}</tbody></table></div><footer className="table-footer">{roster.length} students</footer></section>}
    {editing&&<Modal title={`${editing.student.name} · ${editing.skill}`} onClose={()=>{setEditing(null);setSaveError('')}} footer={<><button className="secondary" onClick={()=>setEditing(null)}>Cancel</button><button className="primary" onClick={saveScore}>Save score</button></>}><div className="modal-form"><label>Status<select value={editing.status} onChange={event=>setEditing({...editing,status:event.target.value})}><option value="completed">Completed</option><option value="not-assessed">Not assessed</option><option value="absent">Absent</option></select></label>{editing.status==='completed'&&<label>Raw score (max {editing.assessment.skills[editing.skill]})<input type="number" min="0" max={editing.assessment.skills[editing.skill]} value={editing.raw} onChange={event=>setEditing({...editing,raw:event.target.value})}/></label>}{saveError&&<p className="goal-error">{saveError}</p>}</div></Modal>}
  </TeacherLayout>;
}
