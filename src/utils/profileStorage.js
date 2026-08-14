const KEYS={studentAvatar:'eph.studentAvatar',teacherProfile:'eph.teacherProfile'};
export const DEFAULT_TEACHER_PROFILE={name:'Oksana Mikhailovna Bashlykova',displayName:'Oksana Mikhailovna Bashlykova',role:'English Teacher',avatar:{type:'default',value:'/assets/avatars/teachers/teacher-oksana-01.png'}};

const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const write=(key,value)=>{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new Event('profile-storage-change'));return value};
export const profileStorage={
  getStudentAvatar:()=>read(KEYS.studentAvatar,'girl-1'),
  setStudentAvatar:value=>write(KEYS.studentAvatar,value),
  getTeacherProfile:()=>{const saved=read(KEYS.teacherProfile,{});const legacy=['Елена Петрова','Ms. Petrova','Ms. Peterson','Elena Petrova'];const clean=legacy.includes(saved.name)||legacy.includes(saved.displayName)?{...saved,name:DEFAULT_TEACHER_PROFILE.name,displayName:DEFAULT_TEACHER_PROFILE.displayName,role:DEFAULT_TEACHER_PROFILE.role}:saved;return {...DEFAULT_TEACHER_PROFILE,...clean}},
  setTeacherProfile:value=>write(KEYS.teacherProfile,value),
};
export const teacherAvatarSrc=profile=>assetUrl(profile?.avatar?.value||DEFAULT_TEACHER_PROFILE.avatar.value);
const avatarPaths={'girl-1':'/assets/avatars/girls/avatar-girl-01.png.png','girl-2':'/assets/avatars/girls/avatar-girl-02.png','girl-3':'/assets/avatars/girls/avatar-girl-03.png','girl-4':'/assets/avatars/girls/avatar-girl-04.png','boy-1':'/assets/avatars/boys/avatar-boy-01.png','boy-2':'/assets/avatars/boys/avatar-boy-02.png','boy-3':'/assets/avatars/boys/avatar-boy-03.png','boy-4':'/assets/avatars/boys/avatar-boy-04.png'};
export const studentAvatarSrc=student=>assetUrl(avatarPaths[student?.id==='ann'?profileStorage.getStudentAvatar():student?.avatarId]||avatarPaths['girl-1']);
import { assetUrl } from './assetUrl';
