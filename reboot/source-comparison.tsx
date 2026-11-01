import React from 'react';
import reviewed from './source-reviewed.json';
import type {Scene} from './model';
type SourceRecord={sourceFile:string;sourceSha256:string;segments:{korean:string;translation:string;sourceStartLine:number;sourceEndLine:number}[]};
export const SOURCE_REVIEWED=reviewed as Record<string,SourceRecord>;
export function SourceComparison({scene}:{scene:Scene}){
 const source=SOURCE_REVIEWED[scene.id];
 if(!source)return <aside className="source-review-pending" role="note">原文只保留了未保存的图片槽位，无法核实这条贴纸中的文字；不提供推测的韩文。</aside>;
 return <details className="source-comparison"><summary>韩中原文对照 · 已核对</summary><p className="source-provenance">{source.sourceFile}</p>{source.segments.map((segment,i)=><section key={i} className="source-pair"><small>原文 L{segment.sourceStartLine}{segment.sourceEndLine!==segment.sourceStartLine?`–${segment.sourceEndLine}`:''}</small><p lang="ko">{segment.korean}</p><p lang="zh-CN">{segment.translation}</p></section>)}</details>
}
