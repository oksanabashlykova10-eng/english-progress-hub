import { useCallback,useEffect,useState } from 'react';
import { addDoc,collection,doc,getDocs,serverTimestamp,Timestamp,updateDoc } from 'firebase/firestore';
import { auth,db } from '../firebase/firebase';
import { gradeLabel,normalizeGradeIds,toClassId } from '../utils/gradeMapping';

const label=value=>value.charAt(0).toUpperCase()+value.slice(1);
const inputDate=value=>{if(!value)return '';const date=typeof value?.toDate==='function'?value.toDate():value instanceof Date?value:new Date(value);return Number.isNaN(date.getTime())?'':date.toISOString().slice(0,10)};
const normalize=snapshot=>{const data=snapshot.data();const technicalGradeIds=Array.isArray(data.gradeIds)?data.gradeIds:data.gradeId?[data.gradeId]:[];return {id:snapshot.id,...data,term:`Term ${Number(data.term)}`,classes:technicalGradeIds.map(toClassId),gradeIds:technicalGradeIds.map(gradeLabel),technicalGradeIds,skills:Object.fromEntries(Object.entries(data.skills||{}).map(([skill,max])=>[label(skill),max])),date:inputDate(data.date),status:data.active===false?'Inactive':'Active',source:'firestore'}};
const payload=form=>({title:form.title.trim(),term:Number(String(form.term).replace(/\D/g,'')),type:form.type,active:form.active!==false,date:Timestamp.fromDate(new Date(`${form.date}T00:00:00`)),gradeIds:normalizeGradeIds(form.classes),skills:Object.fromEntries(Object.entries(form.skills).filter(([,max])=>Number(max)>0).map(([skill,max])=>[skill.toLowerCase(),Number(max)]))});

export default function useFirestoreAssessments(){
  const [state,setState]=useState({assessments:[],loading:true,error:null});
  const load=useCallback(async()=>{setState(current=>({...current,loading:true,error:null}));try{const snapshot=await getDocs(collection(db,'assessments'));setState({assessments:snapshot.docs.map(normalize),loading:false,error:null})}catch(error){console.error('Teacher assessments list query failed:',error);setState({assessments:[],loading:false,error:'Unable to load assessments from Firestore.'})}},[]);
  useEffect(()=>{load()},[load]);
  const createAssessment=async form=>{const teacherUid=auth.currentUser?.uid;if(!teacherUid)throw new Error('Teacher is not authenticated.');const reference=await addDoc(collection(db,'assessments'),{...payload(form),createdBy:teacherUid,createdAt:serverTimestamp()});await load();return reference.id};
  const updateAssessment=async form=>{await updateDoc(doc(db,'assessments',form.id),payload(form));await load();return form.id};
  return {...state,createAssessment,updateAssessment,reload:load};
}
