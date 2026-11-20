"""Server phát triển cục bộ: gzip và HTTP Range giống host tĩnh có hỗ trợ MP3.
Không phải backend của sản phẩm; khi đưa lên Pages chỉ dùng các file tĩnh.
"""
import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from io import BytesIO
from pathlib import Path
import gzip
import re

ROOT=Path(__file__).resolve().parents[2]


class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):
        self.remaining=None
        super().__init__(*args,directory=str(ROOT),**kwargs)

    def send_head(self):
        path=Path(self.translate_path(self.path))
        if path.is_dir():
            path=path/'index.html'
        if path.is_file() and path.suffix=='.mp3':
            size=path.stat().st_size
            value=self.headers.get('Range')
            start,end=0,size-1
            if value:
                match=re.fullmatch(r'bytes=(\d*)-(\d*)',value.strip())
                valid=bool(match and any(match.groups()))
                if valid:
                    left,right=match.groups()
                    if left:
                        start=int(left);end=min(size-1,int(right)) if right else size-1
                    else:
                        count=int(right);valid=count>0;start=max(0,size-count)
                    valid=valid and 0<=start<=end<size
                if not valid:
                    self.send_response(416);self.send_header('Content-Range',f'bytes */{size}');self.send_header('Content-Length','0');self.end_headers();return None
            self.send_response(206 if value else 200)
            self.send_header('Content-Type','audio/mpeg');self.send_header('Accept-Ranges','bytes');self.send_header('Content-Length',str(end-start+1))
            if value:self.send_header('Content-Range',f'bytes {start}-{end}/{size}')
            self.end_headers();f=path.open('rb');f.seek(start);self.remaining=end-start+1;return f
        if path.is_file() and path.suffix in ('.js','.css','.json','.html','.webmanifest') and 'gzip' in self.headers.get('Accept-Encoding',''):
            data=gzip.compress(path.read_bytes(),mtime=0)
            self.send_response(200);self.send_header('Content-Type',self.guess_type(str(path)));self.send_header('Content-Encoding','gzip');self.send_header('Vary','Accept-Encoding');self.send_header('Content-Length',str(len(data)));self.end_headers();return BytesIO(data)
        return super().send_head()

    def copyfile(self,source,output):
        if self.remaining is None:return super().copyfile(source,output)
        while self.remaining:
            data=source.read(min(65536,self.remaining))
            if not data:break
            output.write(data);self.remaining-=len(data)
        self.remaining=None

    def log_message(self,*args):
        pass


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port',type=int,default=8878)
    parser.add_argument('--host',default='127.0.0.1')
    args=parser.parse_args()
    print(f'Museum demo: http://{args.host}:{args.port}/bao-tang-da-nang-v6/',flush=True)
    ThreadingHTTPServer((args.host,args.port),Handler).serve_forever()
