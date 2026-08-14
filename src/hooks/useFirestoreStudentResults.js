import { collection,doc,getDoc,getDocs,query,where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const skillLabel=skill=>skill.charAt(0).toUpperCase()+skill.slice(1);
const toDate=value=>{if(!value)return null;if(typeof value?.toDate==='function')return value.toDate();if(value instanceof Date)return value;const date=new Date(value);return Number.isNaN(date.getTime())?null:date};
const statusLabel=status=>status==='completed'?'Completed':status==='absent'?'Absent':status==='not-assessed'?'Not assessed':status||'Not assessed';

const buildResult=(resultSnap,assessmentSnap)=>{
  const result=resultSnap.data(),assessment=assessmentSnap.data();
  const scores=result.scores||{},maximums=assessment.skills||{};
  const skillKeys=Object.keys(maximums).filter(skill=>Number(maximums[skill])>0);
  const scoredSkills=skillKeys.filter(skill=>Number.isFinite(Number(scores[skill])));
  const completed=result.status==='completed';
  const earned=completed?scoredSkills.reduce((sum,skill)=>sum+Number(scores[skill]),0):null;
  const max=completed?scoredSkills.reduce((sum,skill)=>sum+Number(maximums[skill]),0):null;
  const percentage=completed&&max>0?Math.round(earned/max*100):null;
  const dateObject=toDate(assessment.date||result.date);
  return {
    id:`firestore-${resultSnap.id}`,resultId:resultSnap.id,assessmentId:result.assessmentId,
    title:assessment.title||'Untitled assessment',term:`Term ${Number(assessment.term??result.term)}`,
    date:dateObject?dateObject.toISOString().slice(0,10):'',dateValue:dateObject?.getTime()||0,
    status:statusLabel(result.status),statusKey:result.status,scores,maximums,
    skills:skillKeys.map(skillLabel),
    skillResults:Object.fromEntries(scoredSkills.map(skill=>[skillLabel(skill),{score:Number(scores[skill]),max:Number(maximums[skill])}])),
    scoreSummary:skillKeys.map(skill=>scores[skill]==null?skillLabel(skill):`${skillLabel(skill)} ${Number(scores[skill])}/${Number(maximums[skill])}`).join(' · '),
    earned,max,earnedPoints:earned,maxPoints:max,rawScore:percentage==null?null:`${earned}/${max}`,percentage,
    source:'firestore',
  };
};

export async function fetchStudentResults(studentId){
  const resultsSnap=await getDocs(query(collection(db,'results'),where('studentId','==',studentId)));
  const joined=await Promise.all(resultsSnap.docs.map(async resultSnap=>{const result=resultSnap.data();if(!result.assessmentId)throw new Error(`Result ${resultSnap.id} has no assessmentId.`);const assessmentSnap=await getDoc(doc(db,'assessments',result.assessmentId));if(!assessmentSnap.exists())throw new Error(`Assessment ${result.assessmentId} was not found.`);return buildResult(resultSnap,assessmentSnap)}));
  return joined.sort((a,b)=>b.dateValue-a.dateValue);
}
