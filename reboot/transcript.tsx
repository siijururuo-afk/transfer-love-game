import React from 'react';

// Paragraphs stay in their original order, including pauses, stage directions and narration.
export function transcriptParts(text:string){return text.split(/\n\s*\n/).filter(Boolean).map(text=>{
 if(/^Q[.．]\s*/.test(text))return {type:'question' as const,text};
 const answer=text.match(/^(宇硕|承衍|金宇硕|曹承衍|男嘉宾\d+|观察员\d+)：([\s\S]*)$/);
 return answer?{type:'answer' as const,text,speaker:answer[1],copy:answer[2]}:{type:'narration' as const,text};
})}
export function Transcript({text,voice=false}:{text:string;voice?:boolean}){return <div className={voice?'programme-transcript voice-transcript':'programme-transcript interview-transcript'}>{transcriptParts(text).map((part,i)=>part.type==='question'?<h3 className="r-question" key={i}>{part.text}</h3>:part.type==='answer'?<div className="transcript-answer" key={i}><strong className="transcript-speaker">{part.speaker}</strong><p>{part.copy}</p></div>:<p className="transcript-narration" key={i}>{part.text}</p>)}</div>}
