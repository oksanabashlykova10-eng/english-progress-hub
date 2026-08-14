import { studentAvatarSrc } from '../utils/profileStorage';
export default function Avatar({student,size='md',selected=false,onClick}){return <button type="button" onClick={onClick} className={`avatar avatar-${size} ${selected?'selected':''}`} style={{'--avatar':student.color}} aria-label={`${student.name} avatar`}><img src={studentAvatarSrc(student)} alt=""/></button>}
