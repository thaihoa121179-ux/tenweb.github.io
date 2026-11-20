/* Safari thường xin bytes=0-1 trước khi phát. Không trả nguyên file 200 cho yêu cầu Range. */
((root)=>{
 'use strict';
 function parse(value,size){
  const m=typeof value==='string'&&/^bytes=(\d*)-(\d*)$/.exec(value.trim());if(!m||!Number.isSafeInteger(size)||size<1||(!m[1]&&!m[2]))return null;
  let start,end;if(!m[1]){const count=Number(m[2]);if(!Number.isSafeInteger(count)||count<1)return null;start=Math.max(0,size-count);end=size-1;}
  else{start=Number(m[1]);end=m[2]?Number(m[2]):size-1;if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=size||end<start)return null;end=Math.min(end,size-1);}
  return{start,end};
 }
 async function respond(request,response){
  const range=request.headers.get('Range');if(!range||response.status!==200)return response;
  const bytes=await response.arrayBuffer(),part=parse(range,bytes.byteLength),headers=new Headers(response.headers);headers.delete('Content-Encoding');headers.set('Accept-Ranges','bytes');
  if(!part){headers.set('Content-Range','bytes */'+bytes.byteLength);headers.set('Content-Length','0');return new Response(null,{status:416,headers});}
  headers.set('Content-Range',`bytes ${part.start}-${part.end}/${bytes.byteLength}`);headers.set('Content-Length',String(part.end-part.start+1));return new Response(bytes.slice(part.start,part.end+1),{status:206,headers});
 }
 root.MuseumAudioRange=Object.freeze({parse,respond});
})(globalThis);
