const images={perfect:'achievement_perfect_moment.png',star:'achievement_skill_star.png',level:'achievement_level_up.png',roll:'achievement_on_a_roll.png',round:'achievement_all_rounder.png',comeback:'achievement_great_comeback.png',complete:'achievement_term_complete.png',finish:'achievement_strong_finish.png',growing:'achievement_growing_stronger.png',goal:'achievement_first_goal_reached.png'};

export default function AchievementBadge({item}){return <article className={`achievement ${item.status} ${item.color}`}>
  <div className="award-medal"><img className="achievement-art" src={assetUrl(`/assets/achievements/${images[item.id]}`)} alt={`${item.title} achievement`}/>{item.status==='locked'&&<img className="lock-overlay" src={assetUrl('/assets/achievements/achievement-locked.png')} alt="Locked"/>}</div>
  <div className="award-copy"><span className={`achievement-status ${item.status}`}>{item.status.replace('_',' ')}</span><h4>{item.title}</h4><p>{item.description}</p>{item.progressLabel&&<small>{item.progressLabel}</small>}{item.status==='in_progress'&&<div className="achievement-progress"><i style={{width:`${item.progress}%`}}/></div>}{item.unlockedAt&&<time>Unlocked {item.unlockedAt}</time>}</div>
</article>}
import { assetUrl } from '../utils/assetUrl';
