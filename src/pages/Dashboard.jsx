import { Link } from 'react-router-dom';
import { ArrowUpRight,BookOpen,ChevronRight,Clock3,Headphones,Mic2,PenLine,TriangleAlert } from 'lucide-react';
import TeacherLayout from '../layouts/TeacherLayout';
import { classes,classAverages,students } from '../data/mockData';
import { ProgressBar,Ring,Sparkline } from '../components/Progress';
import LineChart from '../components/LineChart';

const skillMeta={
  Listening:[Headphones,'cyan',[70,73,75,74,76,78],4],
  Speaking:[Mic2,'purple',[72,75,76,78,79,81],5],
  Reading:[BookOpen,'green',[68,72,71,74,75,77],3],
  Writing:[PenLine,'magenta',[64,66,65,67,68,69],2],
};

export default function Dashboard(){return <TeacherLayout title="Добрый день, Oksana Mikhailovna!" subtitle="Вот что происходит с успеваемостью сегодня.">
  <section className="class-grid">{classes.map((c,i)=><article className="class-card" key={c.id}>
    <div className={`class-symbol c${i}`}>{c.name}</div><div className="class-info"><span>{c.students} учеников</span><b>{c.average}%</b><small><ArrowUpRight size={13}/> +{i%3+1}.2% за термин</small></div>
    <Sparkline values={c.trend} color={['#22d3ee','#8b7cff','#34d399','#fb923c','#ed49c6'][i]}/><Link to="/teacher/journal"><ChevronRight size={18}/></Link>
  </article>)}</section>
  <section className="metrics-row">
    <article className="panel overall-widget"><div className="teacher-ring"><Ring value={78} size={132} label="все классы"/></div><div><span className="panel-kicker">ОБЩИЙ СРЕДНИЙ РЕЗУЛЬТАТ</span><div className="overall-insights"><small><ArrowUpRight size={14}/> 4.6% с прошлого Term</small><p><b>Strongest</b><span>Speaking 81%</span></p><p><b>Needs attention</b><span>Writing 69%</span></p></div></div></article>
    {Object.entries(skillMeta).map(([skill,[Icon,color,trend,change]])=><article className={`panel metric metric-${color}`} key={skill}><span className={`mini-icon ${color}`}><Icon size={19}/></span><div><span>{skill} average</span><strong>{classAverages[skill]}%</strong><small><ArrowUpRight size={12}/> +{change}% vs previous Term</small></div><Sparkline values={trend} color={{cyan:'#22d3ee',purple:'#9b7cff',green:'#34d399',magenta:'#ed58d5'}[color]}/><ProgressBar value={classAverages[skill]} color={color}/></article>)}
  </section>
  <section className="dashboard-columns"><article className="panel chart-panel"><div className="panel-head"><div><h3>Динамика успеваемости</h3><p>Средний результат и динамика выбранного класса</p></div><select><option>Term 1</option><option>Term 2</option></select></div><LineChart labels={['SA1','SA2','Term 1','SA3','SA4','Term 2']} series={[{name:'Все классы',values:[67,71,73,72,76,78]},{name:'Класс 6В',values:[70,74,76,75,79,81]}]}/></article>
    <div className="stack"><article className="panel"><div className="panel-head"><div><h3>Последние работы</h3><p>Недавно завершённые</p></div><Link to="/teacher/journal">Все</Link></div>{[['Summative Assessment Term 1','6В','82%'],['Summative Assessment 2','9Б','86%'],['Summative Assessment 1','5Б','74%']].map((x,i)=><div className="activity" key={x[0]+x[1]}><span className={`activity-icon a${i}`}><Clock3 size={17}/></span><div><b>{x[0]}</b><small>Класс {x[1]} · сегодня</small></div><strong>{x[2]}</strong></div>)}</article>
    <article className="panel attention"><div className="panel-head"><div><h3>Требует внимания</h3><p>Результат ниже 70%</p></div><span className="alert-count">2</span></div>{students.filter(s=>s.overall<70).map(s=><Link to={`/teacher/student/${s.id}`} className="attention-row" key={s.id}><span className="avatar mini" style={{'--avatar':s.color}}>{s.avatar}</span><div><b>{s.name}</b><small>Writing · {s.skills.Writing}%</small></div><TriangleAlert size={17}/><ChevronRight size={17}/></Link>)}</article></div>
  </section>
</TeacherLayout>}
