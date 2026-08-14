import { assetUrl } from '../utils/assetUrl';

export default function AvatarSlot({option,size=64,selected=false,onClick,className=''}){
  const content=option.imagePath?<img src={assetUrl(option.imagePath)} alt=""/>:<span>{option.initials}</span>;
  const style={'--slot-a':option.palette[0],'--slot-b':option.palette[1],width:size,height:size};
  if(onClick)return <button type="button" className={`avatar-slot ${selected?'selected':''} ${className}`} style={style} onClick={onClick} aria-label={option.label}>{content}{selected&&<i>✓</i>}</button>;
  return <div className={`avatar-slot ${selected?'selected':''} ${className}`} style={style}>{content}{selected&&<i>✓</i>}</div>
}
