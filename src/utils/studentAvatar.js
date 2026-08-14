import { avatarOptions } from '../data/mockData';

export const normalizeAvatarId=value=>String(value||'').replace(/^(girl|boy)-0?(\d+)$/,(_,kind,number)=>`${kind}-${Number(number)}`);

export const avatarOptionForProfile=profile=>{
  const known=avatarOptions.find(option=>option.id===normalizeAvatarId(profile?.avatarId));
  if(known)return known;
  const displayName=String(profile?.displayName||'Student').trim();
  const initials=displayName.split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'ST';
  return {id:'neutral',label:`${displayName} avatar`,initials,palette:['#334155','#64748b']};
};
