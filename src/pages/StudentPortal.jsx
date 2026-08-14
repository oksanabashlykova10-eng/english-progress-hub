import { useMemo,useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell,ChevronRight,ArrowUpRight,CalendarDays,ExternalLink,Headphones,Mic2,BookOpen,PenLine,Target } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import AvatarSlot from '../components/AvatarSlot';
import Modal from '../components/Modal';
import Rocket from '../components/Rocket';
import { Ring,ProgressBar } from '../components/Progress';
import LineChart from '../components/LineChart';
import { classAverages,extraTasks } from '../data/mockData';
import { evaluateAchievements } from '../utils/achievementEngine';
import { profileStorage,teacherAvatarSrc } from '../utils/profileStorage';
import usePrototypeData from '../hooks/usePrototypeData';
import useFirestoreStudentProgress from '../hooks/useFirestoreStudentProgress';
import { useAuth } from '../auth/AuthContext';
import { gradeLabel } from '../utils/gradeMapping';
import { avatarOptionForProfile } from '../utils/studentAvatar';

const meta={Listening:['/assets/student/skills/skill-listening-star.png','cyan',6],Speaking:['/assets/student/skills/skill-speaking-star.png','purple',5],Reading:['/assets/student/skills/skill-reading-star.png','green',7],Writing:['/assets/student/skills/skill-writing-star.png','orange',4]};

export default function StudentPortal(){
  const prototypeData=usePrototypeData();
  const {user:currentUser,profile:firebaseProfile}=useAuth();
  const {assessmentsWithResults,overallPercentage,skillPercentages,latestResults,chartData,loading:resultsLoading,error:resultsError}=useFirestoreStudentProgress();
  const [term,setTerm]=useState('Term 1');
  const [taskStatuses,setTaskStatuses]=useState(Object.fromEntries(extraTasks.map(t=>[t.id,t.status])));
  const studentId=currentUser?.uid,student={id:studentId,name:firebaseProfile?.displayName||'Student',displayName:firebaseProfile?.displayName||'',email:firebaseProfile?.email||currentUser?.email||'',gradeId:firebaseProfile?.gradeId||'',avatarId:firebaseProfile?.avatarId,active:firebaseProfile?.active!==false,skills:skillPercentages,overall:overallPercentage};
  const savedGoal=studentId?prototypeData.goals?.[studentId]||null:null,goal=savedGoal?{skill:savedGoal.skill,current:savedGoal.currentValue,target:savedGoal.targetValue,status:savedGoal.status,description:`Reach ${savedGoal.targetValue}% in ${savedGoal.skill}.`}:null;
  const activeAvatar=avatarOptionForProfile(firebaseProfile),teacher=profileStorage.getTeacherProfile();
  const activeTask=extraTasks.find(task=>(task.studentId===studentId||task.target?.id===firebaseProfile?.gradeId)&&taskStatuses[task.id]==='Assigned');
  const studentFeedback=prototypeData.comments?.find(comment=>comment.studentId===studentId)||null;
  const goalsForEngine={current:goal,history:[]};
  const achievements=useMemo(()=>evaluateAchievements({student,results:assessmentsWithResults,goals:goalsForEngine}),[studentId,overallPercentage,assessmentsWithResults,savedGoal?.skill,savedGoal?.currentValue,savedGoal?.targetValue]);
  const unlockedAchievements=achievements.filter(item=>item.status==='unlocked');
  return <StudentLayout>
    <div className="progress-dashboard">
      <div className="progress-toolbar"><div/><select value={term} onChange={e=>setTerm(e.target.value)}>{[1,2,3,4].map(n=><option key={n}>Term {n}</option>)}</select><button className="icon-btn" aria-label="Notifications"><Bell size={18}/><i/></button></div>

      <section className="progress-hero-row">
        <article className="student-welcome"><div className="avatar-edit-wrap"><AvatarSlot option={activeAvatar} size={142} className="hero-avatar-button"/></div><div><span className="eyebrow">THURSDAY, 13 AUGUST</span><h1>Hi, {student.displayName}! <span>👋</span></h1><p>Grade {gradeLabel(student.gradeId)} <i/> Keep up the brilliant work!</p><b>☆ STAR JOURNEY · TERM 1</b></div></article>
        <article className="panel compact-overall"><div><span>Overall Progress</span><h2>{overallPercentage==null?'No data yet':'Your real progress'}</h2><small>{overallPercentage==null?'Complete an assessment to begin.':'Calculated from completed assessments'}</small></div><div className="hero-ring"><Ring value={overallPercentage??0} size={128} label={overallPercentage==null?'No data':'Overall progress'}/><b>★</b></div></article>
        <article className="panel compact-average"><span>Class Average</span><strong>{classAverages.overall}%</strong><p>You are above the class average!</p><ProgressBar value={classAverages.overall}/></article>
      </section>

      <section className="compact-skills">{Object.entries(skillPercentages).map(([skill,value])=>{const [image,color]=meta[skill];return <article className={`panel compact-skill ${color}`} key={skill}><img className="skill-asset" src={image} alt={`${skill} skill`}/><div><span>{skill}</span><strong>{value==null?'—':`${value}%`}</strong><small>{value==null?'No data':'Weighted by points'}</small></div></article>})}</section>

      <section className="compact-analysis"><article className="panel compact-chart"><div className="compact-heading"><h2>Your Progress Through the Terms</h2><div><span className="you">You · Firestore results</span></div></div>{chartData.values.length?<LineChart labels={chartData.labels} series={[{name:'You',values:chartData.values}]}/>:<p className="student-data-state">No completed results yet.</p>}</article><article className="panel compact-results"><div className="compact-heading"><h2>Recent Results</h2><Link to="/student/assessments">View all history →</Link></div>{resultsLoading&&<p className="student-data-state">Loading latest result…</p>}{resultsError&&<p className="student-data-state error">{resultsError}</p>}{latestResults.map(item=><div className="compact-result" key={item.id}><span className="result-orb">{item.skills.includes('Listening')?<Headphones size={18}/>:<PenLine size={18}/>}</span><div><b>{item.title}</b><small>{item.skills.join(' · ')} · {item.rawScore}</small></div><strong>{item.percentage}%</strong><time>{item.date?item.date.slice(5).replace('-','/'):'—'}</time></div>)}</article></section>

      <section className="compact-utility"><article className="panel compact-comment"><img className="teacher-comment-avatar" src={teacherAvatarSrc(teacher)} alt="Teacher avatar"/><div><h2>Teacher's Comment</h2>{studentFeedback?<><p>“{studentFeedback.text}”</p><small><b>{teacher.displayName||teacher.name}</b> · {studentFeedback.date}</small></>:<p>No teacher comments yet.</p>}</div></article><article className="panel compact-goal">{goal?<><div><h2>My Goal</h2><b>{goal.skill} Goal</b><p>{goal.description}</p><ProgressBar value={Math.round(goal.current/goal.target*100)}/><small><span>{goal.current}%<i>Current</i></span><span>{goal.target}%<i>Target</i></span></small></div><Rocket/></>:<div className="goal-cta"><h2>My Goal</h2><p>Choose a skill and set a personal target.</p><Link className="primary" to="/student/goal">Set your first goal</Link></div>}</article>{activeTask?<article className="panel compact-task"><div className="task-orb"><BookOpen size={25}/></div><div><span>Optional Task from Teacher</span><h2>{activeTask.title}</h2><p>{activeTask.description}</p>{activeTask.dueDate&&<small><CalendarDays size={12}/> Due: {activeTask.dueDate} (Optional)</small>}</div><div className="compact-task-actions">{activeTask.url&&<a href={activeTask.url} target="_blank" rel="noreferrer">Open task <ExternalLink size={13}/></a>}<button onClick={()=>setTaskStatuses(s=>({...s,[activeTask.id]:'Completed'}))}>Mark completed</button></div></article>:<article className="panel compact-task completed-task"><img className="empty-task-img" src="/assets/empty-states/empty-tasks.png" alt=""/><div><span>Optional Task from Teacher</span><h2>No optional tasks right now.</h2><p>You're all caught up!</p></div></article>}</section>

      <section className="panel compact-achievements achievement-showcase"><div className="compact-heading"><h2>My Achievements</h2><Link to="/student/achievements">View all achievements →</Link></div><div className="achievement-showcase-grid">{unlockedAchievements.map(a=><article className="achievement-showcase-card" key={a.id}><div className="award-medal"><img className="achievement-art" src={`/assets/achievements/${({perfect:'achievement_perfect_moment.png',star:'achievement_skill_star.png',level:'achievement_level_up.png',roll:'achievement_on_a_roll.png',round:'achievement_all_rounder.png',comeback:'achievement_great_comeback.png',complete:'achievement_term_complete.png',finish:'achievement_strong_finish.png',growing:'achievement_growing_stronger.png',goal:'achievement_first_goal_reached.png'})[a.id]}`} alt={`${a.title} achievement`}/></div><h3>{a.title}</h3></article>)}</div></section>
    </div>
  </StudentLayout>
}
