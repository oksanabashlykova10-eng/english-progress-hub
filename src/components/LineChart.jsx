export default function LineChart({labels,series}){
  const w=600,h=220,p=28;
  const x=i=>labels.length<=1?w/2:p+i*(w-p*2)/(labels.length-1);
  const y=v=>h-p-v*(h-p*2)/100;
  const path=vals=>vals.map((v,i)=>`${i?'L':'M'} ${x(i)} ${y(v)}`).join(' ');
  const area=vals=>`${path(vals)} L ${x(vals.length-1)} ${h-p} L ${x(0)} ${h-p} Z`;
  return <div className="chart"><svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Progress chart">
    <defs>
      <linearGradient id="areaGlow0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#22d3ee" stopOpacity=".35"/><stop offset="1" stopColor="#22d3ee" stopOpacity="0"/></linearGradient>
      <linearGradient id="areaGlow1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9b6cff" stopOpacity=".26"/><stop offset="1" stopColor="#9b6cff" stopOpacity="0"/></linearGradient>
    </defs>
    {[0,25,50,75,100].map(v=><g key={v}><line x1={p} x2={w-p} y1={y(v)} y2={y(v)} className="grid-line"/><text x="0" y={y(v)+4}>{v}%</text></g>)}
    {series.map((s,i)=><g key={s.name}><path d={area(s.values)} fill={`url(#areaGlow${i})`} className="chart-area"/><path d={path(s.values)} className={`chart-line line-${i}`}/>{s.values.map((v,j)=><circle key={j} cx={x(j)} cy={y(v)} r="5" className={`dot-${i}`}><title>{`${s.name}: ${v}% · ${labels[j]}`}</title></circle>)}</g>)}
    {labels.map((l,i)=><text key={l} x={x(i)} y={h-3} textAnchor="middle">{l}</text>)}
  </svg><div className="legend">{series.map((s,i)=><span key={s.name}><i className={`legend-${i}`}/>{s.name}</span>)}</div></div>
}
