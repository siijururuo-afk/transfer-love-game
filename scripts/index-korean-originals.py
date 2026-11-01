"""Index supplied HTML paragraphs locally; never upload the originals to the public repo.
Usage: python3 scripts/index-korean-originals.py /path/to/original_html /private/output
The output L numbers in source-headings.json refer to this extracted text, not raw HTML lines.
"""
from html.parser import HTMLParser
from pathlib import Path
import argparse
class Article(HTMLParser):
    def __init__(self):
        super().__init__();self.active=False;self.parts=[]
    def handle_starttag(self,tag,attrs):
        if tag=='article':self.active=True
        if self.active and tag=='br':self.parts.append('\n')
        if self.active and tag=='img':self.parts.append('\n[图片]\n')
    def handle_endtag(self,tag):
        if tag=='article':self.active=False
        if self.active and tag in ['p','blockquote','h1','h2','h3']:self.parts.append('\n')
    def handle_data(self,data):
        if self.active:self.parts.append(data)
def main():
    args=argparse.ArgumentParser();args.add_argument('original_html');args.add_argument('output');a=args.parse_args()
    out=Path(a.output);out.mkdir(parents=True,exist_ok=True)
    for f in sorted(Path(a.original_html).glob('*.html')):
        parser=Article();parser.feed(f.read_text(encoding='utf-8'))
        lines=[x.strip() for x in ''.join(parser.parts).splitlines() if x.strip()]
        (out/(f.name[:2]+'.txt')).write_text('\n'.join(f'{i+1:04} {line}' for i,line in enumerate(lines)),encoding='utf-8')
if __name__=='__main__':main()
