import { useCallback,useEffect,useState } from 'react';
import { collection,doc,getDoc,getDocs,query,updateDoc,where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { toClassId } from '../utils/gradeMapping';

const avatarIdForUi=value=>String(value||'girl-01').replace(/^(girl|boy)-0?(\d+)$/,(_,kind,number)=>`${kind}-${Number(number)}`);
const normalizeStudent=(id,data)=>({
  id,
  uid:id,
  ...data,
  name:data.displayName||data.email||'Unnamed student',
  displayName:data.displayName||'',
  gradeId:data.gradeId||'',
  classId:toClassId(data.gradeId||''),
  avatarId:avatarIdForUi(data.avatarId),
  active:data.active!==false,
  color:'#7c5cff',
});

export async function fetchFirestoreStudents(){
  const snapshot=await getDocs(query(collection(db,'users'),where('role','==','student')));
  return snapshot.docs.map(item=>normalizeStudent(item.id,item.data())).sort((a,b)=>a.name.localeCompare(b.name));
}

export async function fetchFirestoreStudent(uid){
  const snapshot=await getDoc(doc(db,'users',uid));
  if(!snapshot.exists()||snapshot.data().role!=='student')return null;
  return normalizeStudent(snapshot.id,snapshot.data());
}

export default function useFirestoreStudents(){
  const [state,setState]=useState({students:[],loading:true,error:null});
  const load=useCallback(async()=>{setState(current=>({...current,loading:true,error:null}));try{setState({students:await fetchFirestoreStudents(),loading:false,error:null})}catch(error){console.error('Unable to load Firestore students:',error);setState({students:[],loading:false,error:'Unable to load students from Firestore.'})}},[]);
  useEffect(()=>{load()},[load]);
  const updateStudent=async(uid,changes)=>{
    const payload={displayName:changes.displayName.trim(),gradeId:changes.gradeId,avatarId:changes.avatarId,active:Boolean(changes.active)};
    await updateDoc(doc(db,'users',uid),payload);
    setState(current=>({...current,students:current.students.map(student=>student.id===uid?normalizeStudent(uid,{...student,...payload}):student)}));
  };
  return {...state,reload:load,updateStudent};
}

export function useFirestoreStudent(uid){
  const [state,setState]=useState({student:null,loading:true,error:null});
  useEffect(()=>{if(!uid){setState({student:null,loading:false,error:'Student ID is missing.'});return}let cancelled=false;setState({student:null,loading:true,error:null});fetchFirestoreStudent(uid).then(student=>{if(!cancelled)setState({student,loading:false,error:student?null:'Student profile was not found.'})}).catch(error=>{console.error('Unable to load Firestore student profile:',error);if(!cancelled)setState({student:null,loading:false,error:'Unable to load the student profile.'})});return()=>{cancelled=true}},[uid]);
  return state;
}
