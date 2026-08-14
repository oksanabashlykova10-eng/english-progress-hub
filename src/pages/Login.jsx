import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import Brand from '../components/Brand';
import { useAuth } from '../auth/AuthContext';
import { AuthLoading } from '../auth/ProtectedRoute';
import { auth } from '../firebase/firebase';

const messageFor = (error) => {
  switch (error?.code) {
    case 'auth/invalid-email': return 'Enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password': return 'Incorrect email or password.';
    case 'auth/too-many-requests': return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed': return 'Unable to connect. Check your internet connection.';
    default: return 'Unable to sign in. Please try again.';
  }
};

export default function Login() {
  const { homePath, loading, error: profileError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (profileError) { setError(profileError); setSubmitting(false); } }, [profileError]);
  if (loading && !submitting) return <AuthLoading />;
  if (!loading && homePath) return <Navigate to={homePath} replace />;

  const submit = async (event) => {
    event.preventDefault(); setError(''); setSubmitting(true);
    try { await signInWithEmailAndPassword(auth, email.trim(), password); }
    catch (authError) { setError(messageFor(authError)); setSubmitting(false); }
  };

  return <main className="login-page"><div className="orb orb-one"/><div className="orb orb-two"/>
    <section className="login-hero" aria-label="English Progress HUB learning experience"/>
    <section className="login-card"><Brand/><div className="login-heading"><h2>Welcome back</h2><p>Sign in to your progress hub</p></div><form onSubmit={submit}>
      <label>Email<div className="input"><Mail size={18}/><input type="email" autoComplete="email" placeholder="Enter your email" value={email} onChange={event=>setEmail(event.target.value)} required/></div></label>
      <label>Password<div className="input"><LockKeyhole size={18}/><input type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={event=>setPassword(event.target.value)} required/></div></label>
      {error&&<p className="login-error" role="alert">{error}</p>}
      <button className="primary wide" disabled={submitting||loading}>{submitting||loading?'Signing in…':'Sign in'}{!submitting&&!loading&&<ArrowRight size={18}/>}</button>
    </form></section>
  </main>;
}
