import { useCallback,useEffect,useState } from 'react';
import { collection,doc,getDocs,query,serverTimestamp,setDoc,updateDoc,where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { toClassId,toGradeId } from '../utils/gradeMapping';

const label=value=>value.charAt(0).toUpperCase()+value.slice(1);
const avatarIdForUi=value=>String(value||'girl-01').replace(/^(girl|boy)-0?(\d+)$/,(_,kind,number)=>`${kind}-${Number(number)}`);
export default function useFirestoreJournal(classId,termLabel){
  const normalizedGrade=toGradeId(classId);
  const normalizedTerm=typeof termLabel==='number'?termLabel:Number(String(termLabel).replace(/\D/g,''));
  const [state,setState]=useState({students:[],assessments:[],results:[],loading:true,error:null});
  const load=useCallback(async()=>{
    if(!normalizedGrade||!Number.isFinite(normalizedTerm)){setState({students:[],assessments:[],results:[],loading:false,error:null});return}
    setState(current=>({...current,loading:true,error:null}));
    try{
      const [studentSnap,legacyAssessments,multiAssessments,resultSnap]=await Promise.all([
        getDocs(query(collection(db,'users'),where('role','==','student'))),
        getDocs(query(collection(db,'assessments'),where('gradeId','==',normalizedGrade))),
        getDocs(query(collection(db,'assessments'),where('gradeIds','array-contains',normalizedGrade))),
        getDocs(query(collection(db,'results'),where('gradeId','==',normalizedGrade))),
      ]);
      const students=studentSnap.docs.map(item=>({id:item.id,...item.data()}))
        .filter(student=>student.gradeId===normalizedGrade)
        .map(student=>({...student,name:student.displayName||student.email,classId:toClassId(student.gradeId),avatarId:avatarIdForUi(student.avatarId),active:student.active!==false,color:'#7c5cff'}))
        .sort((a,b)=>a.name.localeCompare(b.name));
      const assessmentDocs=[...new Map([...legacyAssessments.docs,...multiAssessments.docs].map(item=>[item.id,item])).values()];
      const assessments=assessmentDocs.map(item=>({id:item.id,...item.data()}))
        .filter(item=>Number(item.term)===normalizedTerm&&item.active!==false)
        .map(item=>({...item,term:termLabel,classes:[classId],source:'firestore',skills:Object.fromEntries(Object.entries(item.skills||{}).map(([skill,max])=>[label(skill),max])),firestoreSkillKeys:Object.fromEntries(Object.keys(item.skills||{}).map(skill=>[label(skill),skill]))}));
      const studentIds=new Set(students.map(student=>student.id));
      const assessmentIds=new Set(assessments.map(assessment=>assessment.id));
      const results=resultSnap.docs.map(item=>({id:item.id,...item.data()})).filter(result=>studentIds.has(result.studentId)&&assessmentIds.has(result.assessmentId)&&Number(result.term)===normalizedTerm);
      setState({students,assessments,results,loading:false,error:null});
    }catch(error){console.error('Unable to load Firestore journal data:',error);setState({students:[],assessments:[],results:[],loading:false,error:'Unable to load Journal data from Firestore.'})}
  },[classId,normalizedGrade,normalizedTerm,termLabel]);
  useEffect(()=>{load()},[load]);
  const upsertScore=async({resultId,studentId,assessmentId,gradeId,term,status,skill,value})=>{
    const normalizedStatus=String(status||'completed').toLowerCase(),numericTerm=typeof term==='number'?term:Number(String(term).replace(/\D/g,'')),targetId=resultId||`${studentId}__${assessmentId}`,resultRef=doc(db,'results',targetId);
    if(resultId)await updateDoc(resultRef,{...(normalizedStatus==='completed'?{[`scores.${skill}`]:value}:{}),status:normalizedStatus,updatedAt:serverTimestamp()});
    else await setDoc(resultRef,{studentId,assessmentId,gradeId,term:numericTerm,status:normalizedStatus,scores:normalizedStatus==='completed'?{[skill]:value}:{},createdAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});
    setState(current=>({...current,results:current.results.some(result=>result.id===targetId)?current.results.map(result=>result.id===targetId?{...result,status:normalizedStatus,scores:normalizedStatus==='completed'?{...result.scores,[skill]:value}:result.scores}:result):[...current.results,{id:targetId,studentId,assessmentId,gradeId,term:numericTerm,status:normalizedStatus,scores:normalizedStatus==='completed'?{[skill]:value}:{}}]}));
    return targetId;
  };
  return {...state,normalizedGrade,normalizedTerm,upsertScore,reload:load};
}
