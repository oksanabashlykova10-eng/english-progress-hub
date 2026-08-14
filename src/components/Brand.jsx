const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export default function Brand({compact=false}){return <div className={`brand ${compact?'compact':''}`}><img className="brand-logo" src={assetUrl('/assets/branding/english-bootcamp-logo.png')} alt="English Progress HUB"/>{!compact&&<span><b>English Progress HUB</b><small>by English Bootcamp</small></span>}</div>}
