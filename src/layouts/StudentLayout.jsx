import { NavLink, useNavigate } from 'react-router-dom';
import { Gauge, ClipboardList, Trophy, MessageSquare, Target, LogOut } from 'lucide-react';
import Brand from '../components/Brand';
import { useAuth } from '../auth/AuthContext';

const links = [[Gauge, 'My Progress', '/student/my-progress'], [ClipboardList, 'Assessments', '/student/assessments'], [Trophy, 'Achievements', '/student/achievements'], [MessageSquare, 'Teacher Comments', '/student/comments'], [Target, 'My Goal', '/student/goal']];

export default function StudentLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => { await logout(); navigate('/login', { replace: true }); };
  return <div className="app-shell student-shell"><aside className="sidebar"><Brand/><nav>{links.map(([Icon,label,to])=><NavLink key={label} to={to}><Icon size={19}/><span>{label}</span></NavLink>)}</nav><button type="button" className="logout" onClick={handleLogout}><LogOut size={18}/> Sign out</button></aside><main className="main student-main">{children}</main></div>;
}
