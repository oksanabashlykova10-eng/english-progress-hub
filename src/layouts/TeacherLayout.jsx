import { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserRound, ClipboardList, BookOpen, ChartNoAxesCombined, Trophy, MessageSquare, Settings, LogOut, Search, Bell } from 'lucide-react';
import Brand from '../components/Brand';
import { profileStorage, teacherAvatarSrc } from '../utils/profileStorage';
import { useAuth } from '../auth/AuthContext';

const links = [['/teacher/dashboard','Дашборд',LayoutDashboard],['/teacher/classes','Классы',Users],['/teacher/students','Ученики',UserRound],['/teacher/works','Работы',ClipboardList],['/teacher/journal','Журнал',BookOpen],['/teacher/analytics','Аналитика',ChartNoAxesCombined],['/teacher/achievements','Достижения',Trophy],['/teacher/comments','Комментарии',MessageSquare],['/teacher/settings','Настройки',Settings]];

export default function TeacherLayout({ children, title, subtitle, actions }) {
  const [profile, setProfile] = useState(profileStorage.getTeacherProfile);
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { const sync=()=>setProfile(profileStorage.getTeacherProfile()); addEventListener('profile-storage-change',sync); return()=>removeEventListener('profile-storage-change',sync); }, []);
  const handleLogout = async () => { await logout(); navigate('/login', { replace: true }); };
  return <div className="app-shell teacher-shell"><aside className="sidebar"><Brand/><nav>{links.map(([to,label,Icon])=><NavLink key={label} to={to}><Icon size={19}/><span>{label}</span></NavLink>)}</nav><button type="button" className="logout" onClick={handleLogout}><LogOut size={18}/> Выйти</button></aside><main className="main"><header className="topbar"><div className="mobile-brand"><Brand compact/></div><div className="search"><Search size={17}/><input aria-label="Поиск" placeholder="Поиск ученика..."/></div><button className="icon-btn" aria-label="Уведомления — Coming later" title="Coming later" disabled><Bell size={19}/><i/></button><Link to="/teacher/settings" className="teacher"><img src={teacherAvatarSrc(profile)} alt="Teacher avatar"/><div><b>{profile.name}</b><small>{profile.role}</small></div></Link></header><div className="page"><div className="page-head"><div><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>{actions}</div>{children}</div></main></div>;
}
