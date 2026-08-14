import { achievementDefinitions, skills as coreSkills } from '../data/mockData.js';

const completedOnly=items=>items.filter(item=>item.status==='Completed');
const byDate=(a,b)=>new Date(a.date)-new Date(b.date);
const pct=(value,total)=>total?Math.min(100,Math.round(value/total*100)):0;
const termNumber=term=>Number(String(term||'').match(/\d+/)?.[0]||0);

function base(id,patch={}){
  const definition=achievementDefinitions.find(item=>item.id===id);
  return {...definition,status:'locked',progress:0,progressLabel:null,unlockedAt:null,relatedSkill:null,...patch};
}

function skillAttempts(items){
  const attempts=Object.fromEntries(coreSkills.map(skill=>[skill,[]]));
  completedOnly(items).sort(byDate).forEach(item=>Object.entries(item.skillResults||{}).forEach(([skill,percentage])=>{
    if(attempts[skill]&&Number.isFinite(percentage)) attempts[skill].push({percentage,date:item.date,assessmentId:item.id,term:item.term});
  }));
  return attempts;
}

function consecutivePairs(attempts,compare){
  let best=null;
  Object.entries(attempts).forEach(([skill,values])=>values.slice(1).forEach((current,index)=>{
    const candidate=compare(values[index],current,skill);
    if(candidate&&(!best||candidate.value>best.value)) best=candidate;
  }));
  return best;
}

export function evaluateAchievements({student,assessments=[],results=[],goals}={}){
  // The engine intentionally receives no extraTasks, comments, class averages, or ranking data.
  const source=(results.length?results:assessments).slice().sort(byDate);
  const completed=completedOnly(source);
  const attempts=skillAttempts(source);
  const output=[];

  const perfect=Object.entries(attempts).flatMap(([skill,values])=>values.map(value=>({...value,skill}))).find(item=>item.percentage===100);
  output.push(base('perfect',perfect?{status:'unlocked',progress:100,progressLabel:'100% skill result',unlockedAt:perfect.date,relatedSkill:perfect.skill}:{progressLabel:'No 100% skill result yet'}));

  const starCounts=Object.entries(attempts).map(([skill,values])=>({skill,matches:values.filter(v=>v.percentage>=90)})).sort((a,b)=>b.matches.length-a.matches.length);
  const star=starCounts[0];
  output.push(base('star',star.matches.length>=2?{status:'unlocked',progress:100,progressLabel:'2 / 2 completed',unlockedAt:star.matches[1].date,relatedSkill:star.skill}:star.matches.length===1?{status:'in_progress',progress:50,progressLabel:'1 / 2 completed',relatedSkill:star.skill}:{progressLabel:'0 / 2 completed'}));

  const level=consecutivePairs(attempts,(previous,current,skill)=>({value:current.percentage-previous.percentage,date:current.date,skill}));
  const levelGain=Math.max(0,level?.value||0);
  output.push(base('level',levelGain>=15?{status:'unlocked',progress:100,progressLabel:`+${levelGain} points`,unlockedAt:level.date,relatedSkill:level.skill}:levelGain>0?{status:'in_progress',progress:pct(levelGain,15),progressLabel:`+${levelGain} / +15`,relatedSkill:level.skill}:{progressLabel:'+0 / +15'}));

  let currentStreak=0,bestStreak=0,streakDate=null;
  completed.forEach(item=>{currentStreak=item.percentage>=75?currentStreak+1:0;if(currentStreak>bestStreak)bestStreak=currentStreak;if(currentStreak===3&&!streakDate)streakDate=item.date});
  output.push(base('roll',bestStreak>=3?{status:'unlocked',progress:100,progressLabel:'3 / 3 completed',unlockedAt:streakDate}:bestStreak>0?{status:'in_progress',progress:pct(bestStreak,3),progressLabel:`${bestStreak} / 3 completed`}:{progressLabel:'0 / 3 completed'}));

  const terms=[...new Set(source.map(item=>item.term))].sort((a,b)=>termNumber(a)-termNumber(b));
  const currentTerm=terms.at(-1);
  const currentTermItems=completed.filter(item=>item.term===currentTerm);
  const latestPerSkill=Object.fromEntries(coreSkills.map(skill=>[skill,[...currentTermItems].reverse().find(item=>Number.isFinite(item.skillResults?.[skill]))?.skillResults?.[skill]]));
  const assessedSkills=coreSkills.filter(skill=>Number.isFinite(latestPerSkill[skill]));
  const passingSkills=assessedSkills.filter(skill=>latestPerSkill[skill]>=70);
  const currentFinal=currentTermItems.find(item=>item.title===`Summative Assessment ${currentTerm}`);
  const allRoundUnlocked=passingSkills.length===4&&currentFinal?.percentage>=80;
  output.push(base('round',allRoundUnlocked?{status:'unlocked',progress:100,progressLabel:'4 / 4 skills above 70%',unlockedAt:currentFinal.date}:passingSkills.length>0?{status:'in_progress',progress:pct(passingSkills.length,4),progressLabel:`${passingSkills.length} / 4 skills above 70%`}:{progressLabel:'0 / 4 skills above 70%'}));

  const comeback=consecutivePairs(attempts,(previous,current,skill)=>previous.percentage<60&&current.percentage>=75?{value:current.percentage-previous.percentage,date:current.date,skill}:null);
  output.push(base('comeback',comeback?{status:'unlocked',progress:100,progressLabel:`${comeback.value} point comeback`,unlockedAt:comeback.date,relatedSkill:comeback.skill}:{progressLabel:'No comeback sequence yet'}));

  const termProgress=terms.map(term=>{const items=source.filter(item=>item.term===term);const required=items.filter(item=>/^Summative Assessment/.test(item.title));const done=required.filter(item=>item.status==='Completed');return {term,required,done}});
  const completeTerm=termProgress.find(item=>item.required.length>=3&&item.done.length===item.required.length);
  const closestTerm=[...termProgress].sort((a,b)=>(b.done.length/b.required.length)-(a.done.length/a.required.length))[0];
  output.push(base('complete',completeTerm?{status:'unlocked',progress:100,progressLabel:`${completeTerm.done.length} / ${completeTerm.required.length} assessments completed`,unlockedAt:completeTerm.done.sort(byDate).at(-1)?.date}:closestTerm?.done.length?{status:'in_progress',progress:pct(closestTerm.done.length,closestTerm.required.length),progressLabel:`${closestTerm.done.length} / ${closestTerm.required.length} assessments completed`}:{progressLabel:'0 / 3 assessments completed'}));

  const finals=completed.filter(item=>/^Summative Assessment Term \d+$/.test(item.title));
  const strongFinal=finals.find(item=>item.percentage>=85);
  const bestFinal=Math.max(0,...finals.map(item=>item.percentage));
  output.push(base('finish',strongFinal?{status:'unlocked',progress:100,progressLabel:`${strongFinal.percentage}% final assessment`,unlockedAt:strongFinal.date}:bestFinal?{status:'in_progress',progress:pct(bestFinal,85),progressLabel:`${bestFinal}% / 85%`}:{progressLabel:'Final assessment not completed'}));

  let strongestGrowth=null;
  finals.sort((a,b)=>termNumber(a.term)-termNumber(b.term)).slice(1).forEach((item,index)=>{const previous=finals[index];const growth=item.percentage-previous.percentage;if(!strongestGrowth||growth>strongestGrowth.value)strongestGrowth={value:growth,date:item.date}});
  const growth=Math.max(0,strongestGrowth?.value||0);
  output.push(base('growing',growth>=10?{status:'unlocked',progress:100,progressLabel:`+${growth} / +10`,unlockedAt:strongestGrowth.date}:growth>0?{status:'in_progress',progress:pct(growth,10),progressLabel:`+${growth} / +10`}:{progressLabel:finals.length<2?'Complete two terms to compare':'+0 / +10'}));

  const goalList=[...(goals?.history||[]),...(goals?.current?[goals.current]:[])];
  const evaluatedGoals=goalList.map(goal=>{const values=attempts[goal.skill]||[];const latest=values.at(-1);const actual=goal.reached??latest?.percentage??goal.current??0;return {...goal,actual,date:goal.date||latest?.date}});
  const reachedGoal=evaluatedGoals.find(goal=>goal.actual>=goal.target);
  const activeGoal=evaluatedGoals.at(-1);
  output.push(base('goal',reachedGoal?{status:'unlocked',progress:100,progressLabel:`${reachedGoal.actual}% / ${reachedGoal.target}%`,unlockedAt:reachedGoal.date,relatedSkill:reachedGoal.skill}:activeGoal?{status:'in_progress',progress:pct(activeGoal.actual,activeGoal.target),progressLabel:`${activeGoal.actual}% / ${activeGoal.target}%`,relatedSkill:activeGoal.skill}:{progressLabel:'No personal goal set'}));

  return output;
}

export function prioritizeAchievements(items,limit=6){
  const priority={unlocked:0,in_progress:1,locked:2};
  return [...items].sort((a,b)=>priority[a.status]-priority[b.status]||(b.unlockedAt||'').localeCompare(a.unlockedAt||'')||b.progress-a.progress).slice(0,limit);
}
