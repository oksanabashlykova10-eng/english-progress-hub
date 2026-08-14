import { useEffect,useMemo,useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { fetchStudentResults } from './useFirestoreStudentResults';

const skillNames=['Listening','Speaking','Reading','Writing'];

export default function useFirestoreStudentProgress(studentIdOverride=null){
  const {user,profile}=useAuth();
  const studentId=studentIdOverride||(profile?.role==='student'?user?.uid:null);
  const [state,setState]=useState({assessmentsWithResults:[],loading:true,error:null});
  useEffect(()=>{if(!studentId){setState({assessmentsWithResults:[],loading:false,error:null});return}let cancelled=false;setState({assessmentsWithResults:[],loading:true,error:null});fetchStudentResults(studentId).then(results=>{if(!cancelled)setState({assessmentsWithResults:results,loading:false,error:null})}).catch(error=>{console.error('Unable to load student progress:',error);if(!cancelled)setState({assessmentsWithResults:[],loading:false,error:'Unable to load your assessment results.'})});return()=>{cancelled=true}},[studentId]);
  return useMemo(()=>{
    const completed=state.assessmentsWithResults.filter(result=>result.statusKey==='completed');
    const overall=completed.reduce((totals,result)=>({earned:totals.earned+(result.earned||0),max:totals.max+(result.max||0)}),{earned:0,max:0});
    const skillPercentages=Object.fromEntries(skillNames.map(label=>{const key=label.toLowerCase();const totals=completed.reduce((sum,result)=>{const score=result.scores?.[key],max=result.maximums?.[key];return Number.isFinite(Number(score))&&Number(max)>0?{earned:sum.earned+Number(score),max:sum.max+Number(max)}:sum},{earned:0,max:0});return [label,totals.max?Math.round(totals.earned/totals.max*100):null]}));
    const chronological=[...completed].sort((a,b)=>a.dateValue-b.dateValue);
    return {...state,results:state.assessmentsWithResults,overallPercentage:overall.max?Math.round(overall.earned/overall.max*100):null,skillPercentages,latestResults:completed.slice(0,3),chartData:{labels:chronological.map(result=>result.title),values:chronological.map(result=>result.percentage)}};
  },[state]);
}
