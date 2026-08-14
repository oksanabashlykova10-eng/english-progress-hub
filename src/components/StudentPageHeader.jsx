import AvatarSlot from './AvatarSlot';
import { useAuth } from '../auth/AuthContext';
import { avatarOptionForProfile } from '../utils/studentAvatar';
export default function StudentPageHeader({eyebrow,title,subtitle}){const {profile}=useAuth(),avatar=avatarOptionForProfile(profile);return <header className="student-subheader"><AvatarSlot option={avatar} size={52}/><div><span className="panel-kicker">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div></header>}
