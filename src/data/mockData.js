export const skills=['Listening','Speaking','Reading','Writing'];

export const classes=[
  {id:'5b',name:'5Б',students:12,average:74,trend:[63,66,65,70,72,74]},
  {id:'6v',name:'6В',students:14,average:81,trend:[70,73,72,76,79,81]},
  {id:'6g',name:'6Г',students:13,average:77,trend:[69,68,72,73,75,77]},
  {id:'7d',name:'7Д',students:15,average:69,trend:[65,67,66,70,68,69]},
  {id:'9b',name:'9Б',students:11,average:85,trend:[76,78,80,79,83,85]},
];

const result=(score,max,status='completed')=>({score,max,status,percent:status==='completed'?Math.round(score/max*100):null});
export const students=[
  {id:'ann',name:'Ann Smith',classId:'6v',avatarId:'girl-1',color:'#7c5cff',overall:82,skills:{Listening:86,Speaking:91,Reading:84,Writing:68}},
  {id:'tom',name:'Tom Brown',classId:'6v',avatarId:'boy-1',color:'#00c7f2',overall:76,skills:{Listening:71,Speaking:79,Reading:82,Writing:72}},
  {id:'ben',name:'Ben Johnson',classId:'6v',avatarId:'boy-2',color:'#f45bd1',overall:71,skills:{Listening:63,Speaking:75,Reading:79,Writing:68}},
  {id:'kate',name:'Kate Lee',classId:'6v',avatarId:'girl-2',color:'#30d69b',overall:88,skills:{Listening:91,Speaking:86,Reading:93,Writing:82}},
  {id:'max',name:'Max Wilson',classId:'6v',avatarId:'boy-3',color:'#ff9e44',overall:67,skills:{Listening:72,Speaking:64,Reading:69,Writing:62}},
  {id:'mia',name:'Mia Davis',classId:'6v',avatarId:'girl-3',color:'#aa77ff',overall:79,skills:{Listening:83,Speaking:76,Reading:81,Writing:75}},
];

export const classRosters={
  '5b':[
    {id:'5b-1',name:'Sofia Green',avatarId:'girl-4',color:'#22d3ee'},{id:'5b-2',name:'Leo Martin',avatarId:'boy-4',color:'#8b7cff'},{id:'5b-3',name:'Eva Clark',avatarId:'girl-2',color:'#e15ad6'},{id:'5b-4',name:'Noah King',avatarId:'boy-2',color:'#34d399'},{id:'5b-5',name:'Lily Hall',avatarId:'girl-3',color:'#fb9c46'}],
  '6v':students,
  '6g':[
    {id:'6g-1',name:'Emily Young',avatarId:'girl-1',color:'#22d3ee'},{id:'6g-2',name:'Jack Scott',avatarId:'boy-1',color:'#8b7cff'},{id:'6g-3',name:'Alice Adams',avatarId:'girl-2',color:'#e15ad6'},{id:'6g-4',name:'Henry Baker',avatarId:'boy-2',color:'#34d399'},{id:'6g-5',name:'Grace Hill',avatarId:'girl-3',color:'#fb9c46'},{id:'6g-6',name:'Sam Lewis',avatarId:'boy-3',color:'#766cff'}],
  '7d':[
    {id:'7d-1',name:'Olivia White',avatarId:'girl-4',color:'#22d3ee'},{id:'7d-2',name:'Ethan Harris',avatarId:'boy-4',color:'#8b7cff'},{id:'7d-3',name:'Ruby Walker',avatarId:'girl-1',color:'#e15ad6'},{id:'7d-4',name:'Daniel Allen',avatarId:'boy-1',color:'#34d399'},{id:'7d-5',name:'Chloe Wright',avatarId:'girl-2',color:'#fb9c46'}],
  '9b':[
    {id:'9b-1',name:'Amelia Moore',avatarId:'girl-3',color:'#22d3ee'},{id:'9b-2',name:'James Taylor',avatarId:'boy-3',color:'#8b7cff'},{id:'9b-3',name:'Isla Evans',avatarId:'girl-4',color:'#e15ad6'},{id:'9b-4',name:'Oscar Turner',avatarId:'boy-4',color:'#34d399'},{id:'9b-5',name:'Freya Parker',avatarId:'girl-1',color:'#fb9c46'},{id:'9b-6',name:'Lucas Wood',avatarId:'boy-1',color:'#766cff'}]
};

export const assessments=[
 {id:'sa1',title:'Summative Assessment 1',short:'SA1',skills:['Listening','Speaking']},
 {id:'sa2',title:'Summative Assessment 2',short:'SA2',skills:['Reading','Writing']},
 {id:'term1',title:'Summative Assessment Term 1',short:'Term 1',skills},
];

export const results={
 ann:{sa1:{Listening:result(7,7),Speaking:result(5,7),Total:result(12,14)},sa2:{Reading:result(6,8),Writing:result(5,7),Total:result(11,15)},term1:{Listening:result(6,6),Speaking:result(6,6),Reading:result(5,6),Writing:result(4,6),Total:result(21,24)}},
 tom:{sa1:{Listening:result(6,7),Speaking:result(5,7),Total:result(11,14)},sa2:{Reading:result(6,8),Writing:result(4,7),Total:result(10,15)},term1:{Listening:result(5,6),Speaking:result(5,6),Reading:result(5,6),Writing:result(4,6),Total:result(19,24)}},
 ben:{sa1:{Listening:result(5,7),Speaking:result(6,7),Total:result(11,14)},sa2:{Reading:result(5,8),Writing:result(4,7),Total:result(9,15)},term1:{Listening:result(4,6),Speaking:result(5,6),Reading:result(5,6),Writing:result(4,6),Total:result(18,24)}},
 kate:{sa1:{Listening:result(7,7),Speaking:result(7,7),Total:result(14,14)},sa2:{Reading:result(7,8),Writing:result(6,7),Total:result(13,15)},term1:{Listening:result(6,6),Speaking:result(5,6),Reading:result(6,6),Writing:result(5,6),Total:result(22,24)}},
 max:{sa1:{Listening:result(5,7),Speaking:result(0,0,'absent'),Total:result(0,0,'absent')},sa2:{Reading:result(5,8),Writing:result(4,7),Total:result(9,15)},term1:{Listening:result(4,6),Speaking:result(4,6),Reading:result(0,0,'not assessed'),Writing:result(0,0,'not assessed'),Total:result(0,0,'not assessed')}},
 mia:{sa1:{Listening:result(6,7),Speaking:result(6,7),Total:result(12,14)},sa2:{Reading:result(6,8),Writing:result(5,7),Total:result(11,15)},term1:{Listening:result(5,6),Speaking:result(5,6),Reading:result(5,6),Writing:result(5,6),Total:result(20,24)}}
};

export const classAverages={overall:76,Listening:78,Speaking:81,Reading:77,Writing:69,history:[68,70,74,73,76,78]};
export const progressHistory={labels:['SA1','SA2','Term 1','SA3','SA4','Term 2'],student:[72,73,82,80,86,88],class:[68,70,74,73,76,78]};
export const comments=[{date:'12 Aug 2026',author:'Oksana Mikhailovna Bashlykova',text:"Great effort, Ann! Your Reading and Speaking have improved a lot this term. Let's keep working on Writing."},{date:'28 May 2026',author:'Oksana Mikhailovna Bashlykova',text:'Excellent focus during listening practice. Keep using the same strategy.'}];
export const achievementDefinitions=[
 {id:'perfect',title:'Perfect Moment',description:'Get 100% in any skill.',iconKey:'sparkle',icon:'✦',color:'cyan'},
 {id:'star',title:'Skill Star',description:'Get 90%+ in the same skill twice.',iconKey:'star',icon:'★',color:'purple'},
 {id:'level',title:'Level Up',description:'Improve one skill by 15 points.',iconKey:'arrow-up',icon:'↗',color:'magenta'},
 {id:'roll',title:'On a Roll',description:'Score 75%+ three times in a row.',iconKey:'bolt',icon:'⚡',color:'orange'},
 {id:'round',title:'All-Rounder',description:'Reach 70% in every skill and 80% overall.',iconKey:'gem',icon:'◆',color:'green'},
 {id:'comeback',title:'Great Comeback',description:'Rise from below 60% to 75%+.',iconKey:'return',icon:'↻',color:'purple'},
 {id:'complete',title:'Term Complete',description:'Complete every assessment in a term.',iconKey:'check',icon:'✓',color:'green'},
 {id:'finish',title:'Strong Finish',description:'Get 85%+ in the final term assessment.',iconKey:'flag',icon:'⚑',color:'cyan'},
 {id:'growing',title:'Growing Stronger',description:'Improve term result by 10 points.',iconKey:'trend-up',icon:'↑',color:'magenta'},
 {id:'goal',title:'First Goal Reached',description:'Reach a personal skill goal.',iconKey:'target',icon:'◎',color:'orange'},
];

// Full student history is append-only mock data. Extra tasks are deliberately separate.
export const studentAssessmentHistory=[
 {id:'t1-sa1',term:'Term 1',date:'2025-09-22',title:'Summative Assessment 1',skills:['Listening','Speaking'],skillResults:{Listening:100,Speaking:71},rawScore:'12/14',percentage:86,status:'Completed'},
 {id:'t1-sa2',term:'Term 1',date:'2025-10-14',title:'Summative Assessment 2',skills:['Reading','Writing'],skillResults:{Reading:75,Writing:71},rawScore:'11/15',percentage:73,status:'Completed'},
 {id:'t1-final',term:'Term 1',date:'2025-10-27',title:'Summative Assessment Term 1',skills,skillResults:{Listening:100,Speaking:100,Reading:83,Writing:67},rawScore:'21/24',percentage:88,status:'Completed'},
 {id:'t2-sa1',term:'Term 2',date:'2025-12-03',title:'Summative Assessment 3',skills:['Listening','Speaking'],skillResults:{Listening:86,Speaking:86},rawScore:'12/14',percentage:86,status:'Completed'},
 {id:'t2-sa2',term:'Term 2',date:'2025-12-19',title:'Summative Assessment 4',skills:['Reading','Writing'],rawScore:null,percentage:null,status:'Absent'},
 {id:'t2-final',term:'Term 2',date:'2026-01-12',title:'Summative Assessment Term 2',skills,skillResults:{Listening:92,Speaking:88,Reading:86,Writing:84},rawScore:'22/25',percentage:88,status:'Completed'},
 {id:'t3-sa1',term:'Term 3',date:'2026-03-05',title:'Summative Assessment 5',skills:['Listening','Speaking'],skillResults:{Listening:87,Speaking:87},rawScore:'13/15',percentage:87,status:'Completed'},
 {id:'t3-sa2',term:'Term 3',date:'2026-03-26',title:'Summative Assessment 6',skills:['Reading','Writing'],skillResults:{Reading:82,Writing:68},rawScore:'12/16',percentage:75,status:'Completed'},
 {id:'t3-final',term:'Term 3',date:'2026-04-06',title:'Summative Assessment Term 3',skills,skillResults:{Listening:92,Speaking:92,Reading:92,Writing:77},rawScore:'23/26',percentage:88,status:'Completed'},
 {id:'t4-sa1',term:'Term 4',date:'2026-05-12',title:'Summative Assessment 7',skills:['Listening','Speaking'],skillResults:{Listening:93,Speaking:93},rawScore:'13/14',percentage:93,status:'Completed'},
 {id:'t4-sa2',term:'Term 4',date:'2026-05-28',title:'Summative Assessment 8',skills:['Reading','Writing'],rawScore:null,percentage:null,status:'Not assessed'},
 {id:'t4-final',term:'Term 4',date:'2026-06-08',title:'Summative Assessment Term 4',skills,rawScore:null,percentage:null,status:'Not assessed'},
];

export const extraTasks=[
 {id:'extra-1',studentId:'ann',title:'Reading Challenge',description:'Read the text and answer the comprehension questions.',url:'https://example.com/reading-challenge',dueDate:'2026-08-20',target:{type:'student',id:'ann'},status:'Assigned'},
 {id:'extra-2',studentId:'ann',title:'Writing Booster',description:'Review the paragraph structure guide before the next assessment.',url:'https://example.com/writing-guide',dueDate:null,target:{type:'class',id:'6v'},status:'Completed'},
];

export const studentComments=[
 {...comments[0],id:'comment-1',teacherAvatar:'teacher-1',relatedTo:'Term 1'},
 {...comments[1],id:'comment-2',teacherAvatar:'teacher-1',relatedTo:'Summative Assessment 1'},
 {id:'comment-3',date:'18 Apr 2026',author:'Oksana Mikhailovna Bashlykova',teacherAvatar:'teacher-1',relatedTo:'Term 3',text:'Your consistency is becoming a real strength. Keep planning your Writing responses before you begin.'},
];

export const studentGoals={
 current:{id:'goal-current',skill:'Writing',current:68,target:90,status:'In progress',description:'Reach 90% in Writing in the next assessment.'},
 history:[
  {id:'goal-1',skill:'Reading',start:70,target:82,reached:84,date:'06 Apr 2026',status:'Reached'},
  {id:'goal-2',skill:'Speaking',start:78,target:88,reached:91,date:'27 Oct 2025',status:'Reached'},
 ]
};

export const avatarOptions=[
 {id:'girl-1',label:'Girl 1',imagePath:'/assets/avatars/girls/avatar-girl-01.png.png',palette:['#f08ac9','#6d4fe8']},
 {id:'girl-2',label:'Girl 2',imagePath:'/assets/avatars/girls/avatar-girl-02.png',palette:['#46d9ef','#675be5']},
 {id:'girl-3',label:'Girl 3',imagePath:'/assets/avatars/girls/avatar-girl-03.png',palette:['#f6a34e','#df5bc1']},
 {id:'girl-4',label:'Girl 4',imagePath:'/assets/avatars/girls/avatar-girl-04.png',palette:['#43d5a3','#347bd8']},
 {id:'boy-1',label:'Boy 1',imagePath:'/assets/avatars/boys/avatar-boy-01.png',palette:['#5ab8ff','#7654df']},
 {id:'boy-2',label:'Boy 2',imagePath:'/assets/avatars/boys/avatar-boy-02.png',palette:['#74dc7c','#1b8ca8']},
 {id:'boy-3',label:'Boy 3',imagePath:'/assets/avatars/boys/avatar-boy-03.png',palette:['#ff9966','#e04b77']},
 {id:'boy-4',label:'Boy 4',imagePath:'/assets/avatars/boys/avatar-boy-04.png',palette:['#b76cff','#4e75db']},
];
