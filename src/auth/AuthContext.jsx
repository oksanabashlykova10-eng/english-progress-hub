import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';

const AuthContext = createContext(null);
const allowedRoles = new Set(['teacher', 'student']);

export function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, profile: null, homePath: null, loading: true, error: null });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let requestId = 0;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const currentRequest = ++requestId;

      if (!user) {
        setState({ user: null, profile: null, homePath: null, loading: false, error: null });
        return;
      }

      setState({ user, profile: null, homePath: null, loading: true, error: null });

      try {
        const snap = await getDoc(doc(db, 'users', user.uid));

        // Ignore a profile request that finished after the authenticated user changed.
        if (currentRequest !== requestId || auth.currentUser?.uid !== user.uid) return;

        if (!snap.exists()) {
          setState({ user, profile: null, homePath: null, loading: false, error: 'Your account profile has not been configured yet.' });
          return;
        }

        // Read the snapshot once and make every auth decision from this local value.
        const data = snap.data();
        if (data.active === false) {
          setState({ user, profile: null, homePath: null, loading: false, error: 'This account is inactive. Please contact your administrator.' });
          return;
        }

        if (typeof data.role !== 'string' || !allowedRoles.has(data.role)) {
          setState({ user, profile: null, homePath: null, loading: false, error: 'Your account role has not been configured correctly.' });
          return;
        }

        const homePath = data.role === 'teacher' ? '/teacher/dashboard' : '/student/my-progress';
        setState({
          user,
          profile: { ...data, id: snap.id },
          homePath,
          loading: false,
          error: null,
        });

        // Use data.role, not React state, for the post-login redirect.
        if (location.pathname === '/' || location.pathname === '/login') {
          navigate(homePath, { replace: true });
        }
      } catch (error) {
        if (currentRequest !== requestId) return;
        console.error('Unable to load Firebase user profile:', error);
        setState({ user, profile: null, homePath: null, loading: false, error: 'Unable to load your account profile. Please try again.' });
      }
    });

    return () => {
      requestId += 1;
      unsubscribe();
    };
  }, []);

  const logout = () => signOut(auth);
  return <AuthContext.Provider value={{ ...state, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
