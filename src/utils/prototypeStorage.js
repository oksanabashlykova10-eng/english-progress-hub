import { assessments as mockAssessments,studentComments,studentGoals } from '../data/mockData.js';

const KEY='eph.prototypeData.v1';
const defaultAssessments=mockAssessments.map((item,index)=>({id:item.id,title:item.title,term:'Term 1',type:item.skills.length===4?'Term Assessment':'Skills Assessment',skills:Object.fromEntries(item.skills.map(skill=>[skill,item.id==='sa1'?7:item.id==='sa2'?(skill==='Reading'?8:7):6])),classes:['5b','6v','6g','7d','9b'],date:['2026-09-22','2026-10-14','2026-10-27'][index],status:index<2?'Completed':'Scheduled'}));
const seededGoal={studentId:'ann',skill:studentGoals.current.skill,currentValue:studentGoals.current.current,targetValue:studentGoals.current.target,createdAt:'2026-08-13',status:'active'};
const initial={assessments:defaultAssessments,scores:{},comments:studentComments.map((c,index)=>({...c,studentId:'ann',id:c.id||`comment-${index}`})),extraTasks:[],goals:{ann:seededGoal}};
const safeRead=()=>{try{return {...initial,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return initial}};
const save=data=>{localStorage.setItem(KEY,JSON.stringify(data));window.dispatchEvent(new Event('prototype-data-change'));return data};
export const prototypeStorage={
  get:safeRead,
  assessments:()=>safeRead().assessments,
  saveAssessment:item=>{const data=safeRead(),exists=data.assessments.some(a=>a.id===item.id);data.assessments=exists?data.assessments.map(a=>a.id===item.id?item:a):[...data.assessments,item];return save(data)},
  saveScore:(studentId,assessmentId,skill,value)=>{const data=safeRead();data.scores={...data.scores,[`${studentId}:${assessmentId}:${skill}`]:value};return save(data)},
  score:(studentId,assessmentId,skill)=>safeRead().scores[`${studentId}:${assessmentId}:${skill}`],
  comments:()=>safeRead().comments,
  addComment:comment=>{const data=safeRead();data.comments=[comment,...data.comments];return save(data)},
  addExtraTask:task=>{const data=safeRead();data.extraTasks=[task,...data.extraTasks];return save(data)},
  goal:studentId=>safeRead().goals?.[studentId]||null,
  saveGoal:goal=>{const data=safeRead();data.goals={...(data.goals||{}),[goal.studentId]:goal};return save(data)},
};
