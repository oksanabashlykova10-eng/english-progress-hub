import assert from 'node:assert/strict';
import { evaluateAchievements } from '../src/utils/achievementEngine.js';

const student={id:'test'};
const item=(id,date,percentage,skillResults={},status='Completed',term='Term 1',title=`Summative Assessment ${id}`)=>({id,date,percentage,skillResults,status,term,title,skills:Object.keys(skillResults)});
const state=(history,goals)=>Object.fromEntries(evaluateAchievements({student,assessments:history,results:history,goals}).map(a=>[a.id,a]));

let result=state([item('1','2026-01-01',90,{Listening:100})]);
assert.equal(result.perfect.status,'unlocked','100% skill should unlock Perfect Moment');

result=state([item('1','2026-01-01',91,{Reading:91}),item('2','2026-01-02',92,{Reading:94})]);
assert.equal(result.star.status,'unlocked','two 90% results should unlock Skill Star');

result=state([item('1','2026-01-01',55,{Writing:55}),item('2','2026-01-02',75,{Writing:75})]);
assert.equal(result.comeback.status,'unlocked','55 to 75 should unlock Great Comeback');

result=state([item('1','2026-01-01',78),item('2','2026-01-02',81),item('3','2026-01-03',86)]);
assert.equal(result.roll.status,'unlocked','three 75% assessments should unlock On a Roll');

result=state([
 item('1','2026-01-01',78,{},'Completed','Term 1','Summative Assessment 1'),
 item('2','2026-01-02',81,{},'Completed','Term 1','Summative Assessment 2'),
 item('3','2026-01-03',86,{},'Completed','Term 1','Summative Assessment Term 1'),
]);
assert.equal(result.complete.status,'unlocked','three required completed assessments should unlock Term Complete');

result=state([
 item('f1','2026-01-01',68,{},'Completed','Term 1','Summative Assessment Term 1'),
 item('f2','2026-02-01',79,{},'Completed','Term 2','Summative Assessment Term 2'),
]);
assert.equal(result.growing.status,'unlocked','68 to 79 should unlock Growing Stronger');

result=state([item('1','2026-01-01',92,{Writing:92})],{current:{skill:'Writing',target:90}});
assert.equal(result.goal.status,'unlocked','Writing 92 should reach a 90 goal');

const completed=item('1','2026-01-01',80,{Speaking:80});
const absent=item('2','2026-01-02',100,{Speaking:100},'Absent');
result=state([completed,absent]);
assert.equal(result.perfect.status,'locked','Absent results must be ignored');

const withoutTask=evaluateAchievements({student,results:[completed],goals:null});
const withTask=evaluateAchievements({student,results:[completed],goals:null,extraTasks:[{status:'Completed',percentage:100}]});
assert.deepEqual(withTask,withoutTask,'Extra Tasks must not affect achievements');

console.log('Achievement engine: 9 scenarios passed');
