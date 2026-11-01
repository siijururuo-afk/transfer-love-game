export function boundedPosition(position:number,duration:number){return Number.isFinite(position)&&position>0?Math.min(position,Number.isFinite(duration)&&duration>0?Math.max(0,duration-.05):position):0}
export function isInterruptedPlay(error:unknown){return !!error&&typeof error==='object'&&'name'in error&&error.name==='AbortError'}
