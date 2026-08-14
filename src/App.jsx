import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import StudentProfile from './pages/StudentProfile';
import StudentPortal from './pages/StudentPortal';
import StudentAssessments from './pages/StudentAssessments';
import StudentAchievements from './pages/StudentAchievements';
import StudentComments from './pages/StudentComments';
import StudentGoal from './pages/StudentGoal';
import TeacherSettings from './pages/TeacherSettings';
import { Analytics, Classes, Students, TeacherAchievements, TeacherComments, Works } from './pages/TeacherPages';

export default function App() {
  return <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute role="teacher" />}>
      <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
      <Route path="/teacher/dashboard" element={<Dashboard />} />
      <Route path="/teacher/classes" element={<Classes />} />
      <Route path="/teacher/students" element={<Students />} />
      <Route path="/teacher/works" element={<Works />} />
      <Route path="/teacher/journal" element={<Journal />} />
      <Route path="/teacher/analytics" element={<Analytics />} />
      <Route path="/teacher/achievements" element={<TeacherAchievements />} />
      <Route path="/teacher/comments" element={<TeacherComments />} />
      <Route path="/teacher/student/:id" element={<StudentProfile />} />
      <Route path="/teacher/settings" element={<TeacherSettings />} />
      <Route path="/teacher/*" element={<Navigate to="/teacher/dashboard" replace />} />
    </Route>
    <Route element={<ProtectedRoute role="student" />}>
      <Route path="/student" element={<Navigate to="/student/my-progress" replace />} />
      <Route path="/student/my-progress" element={<StudentPortal />} />
      <Route path="/student/assessments" element={<StudentAssessments />} />
      <Route path="/student/achievements" element={<StudentAchievements />} />
      <Route path="/student/comments" element={<StudentComments />} />
      <Route path="/student/goal" element={<StudentGoal />} />
      <Route path="/student/*" element={<Navigate to="/student/my-progress" replace />} />
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>;
}
