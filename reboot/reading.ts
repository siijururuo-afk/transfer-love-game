/** Match visible content, including short pages and iOS fractional scroll positions. */
export function atReadEnd(top:number,height:number,total:number){return height>0&&top+height>=total-40;}

export function readOnOpen(app:string){return app==='messages';}
