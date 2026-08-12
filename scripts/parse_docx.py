# -*- coding: utf-8 -*-
"""
Parse 换乘恋爱_全文整理版.docx into stable content data.
- One content block per Word paragraph that carries a content bookmark (Pxx_xxxx).
- sourceId = bookmark name (stable across re-runs).
- Chapter derived from sourceId prefix.
- Type/subtype derived from Word style + text heuristics.
- text preserves original paragraph text (intra-paragraph <w:br> -> \n).
- childSegments created only where a single block clearly contains multiple
  labelled speakers (Observer / Dialogue); parent text is preserved exactly.
"""
import json, os, re
from collections import Counter, defaultdict
from docx import Document
from docx.oxml.ns import qn

PATH = r"C:\Users\Administrator\Downloads\换乘恋爱_全文整理版.docx"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "app", "src", "data")
os.makedirs(OUT_DIR, exist_ok=True)

NS = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

doc = Document(PATH)
para_list = doc.paragraphs

# ---- Prefix -> chapter ----
PREFIX2CHAP = {
    'P01': ('第1部分', 1), 'P02': ('第2部分', 2), 'P03': ('第3部分', 3),
    'P04': ('第4部分', 4), 'P05': ('第5部分', 5), 'P06': ('第6部分', 6),
    'P07': ('第7部分', 7), 'P08': ('第8部分', 8),     'P09': ('第9部分', 9),
    'P10': ('完结篇', 10),
}
CHAP_ORDER = ['第1部分','第2部分','第3部分','第4部分','第5部分','第6部分','第7部分','第8部分','第9部分','完结篇']

def chapter_from_source(source_id):
    for pref, (name, idx) in PREFIX2CHAP.items():
        if source_id.startswith(pref):
            return name, idx
    return None, None

# ---- text extraction preserving breaks ----
def para_text(p):
    parts = []
    for node in p._p.iter():
        if node.tag == qn('w:t'):
            parts.append(node.text or '')
        elif node.tag == qn('w:br') or node.tag == qn('w:cr'):
            parts.append('\n')
        elif node.tag == qn('w:tab'):
            parts.append('\t')
    return ''.join(parts).strip()

# ---- bookmark per paragraph ----
content_re = re.compile(r'^P\w+_\d+$')
blocks_raw = []  # (sourceId, style, text)
for i, p in enumerate(para_list):
    bms = p._p.findall(qn('w:bookmarkStart'))
    names = [b.get(NS+'name') for b in bms]
    cname = next((n for n in names if content_re.match(n)), None)
    if not cname:
        continue
    blocks_raw.append((cname, p.style.name, para_text(p)))

print("Raw content blocks parsed:", len(blocks_raw))

# ---- classification ----
def detect_media_subtype(t):
    if '动图' in t: return 'gif'
    if 'YouTube' in t or 'youtube' in t: return 'youtube'
    if '预告' in t: return 'preview'
    if '先公开' in t: return 'early_release'
    if '抢先看' in t: return 'sneak_peek'
    if '视频' in t or '.mp4' in t: return 'video'
    if '图片' in t or '.jpg' in t or '.png' in t or '.gif' in t: return 'image'
    return 'image'

def detect_sms_subtype(t):
    if '匿名' in t or '匿名短信' in t: return 'anonymous'
    return 'normal'

def detect_final_subtype(t):
    if '规则' in t: return 'rule'
    if '通话' in t or '电话' in t: return 'call'
    if '等待' in t: return 'waiting'
    if '行动' in t or '下车' in t: return 'action'
    if '选择' in t or '结果' in t: return 'result'
    return 'step'

def detect_game(t):
    if '真心话' in t or 'truth' in t.lower(): return ('truth_game', None)
    if '手指' in t or 'finger' in t.lower(): return ('finger_game', None)
    return ('truth_game', None)

def detect_date_subtype(t):
    if '指定X' in t or 'X指定' in t: return 'assigned_x_date'
    if '指定' in t: return 'assigned_date'
    if '突袭' in t or '突击' in t: return 'surprise_date'
    if '双选' in t or '相互' in t: return 'mutual_choice_date'
    if 'X约会' in t or 'X 约会' in t: return 'x_date'
    if '秘密' in t: return 'secret_date'
    if '旅行' in t: return 'travel_date'
    return 'assigned_date'

def detect_identity_subtype(t):
    if 'X关系' in t or 'X 关系' in t or 'X身份' in t: return 'x_relation'
    if '职业' in t: return 'occupation'
    if '年龄' in t: return 'age'
    return 'profile'

def classify(style, t):
    if style == 'Media': return ('media', detect_media_subtype(t))
    if style == 'Forum Comment': return ('forum', 'comment')
    if style == 'Forum Body': return ('forum', 'body')
    if style == 'Forum Title': return ('forum', 'title')
    if style == 'Forum Count': return ('forum', 'count')
    if style == 'Dialogue': return ('dialogue', None)
    if style == 'Narrative': return ('narrative', None)
    if style == 'Interview Question': return ('interview', 'question')
    if style == 'Interview Answer': return ('interview', 'answer')
    if style == 'Interview Header': return ('interview', 'header')
    if style == 'X Room': return ('x_room', None)
    if style == 'Caption': return ('program_caption', None)
    if style == 'Final Choice': return ('final_choice', detect_final_subtype(t))
    if style == 'Chat': return ('text_chat', None)
    if style == 'Game Card': return detect_game(t)
    if style == 'Observer': return ('observation_room', None)
    if style == 'Date Task': return ('date_task', detect_date_subtype(t))
    if style == 'Epilogue': return ('epilogue', None)
    if style == 'SMS Result': return ('sms', 'result')
    if style == 'Task Card': return ('program_task', None)
    if style == 'SMS': return ('sms', detect_sms_subtype(t))
    if style == 'Scene Card': return ('scene_card', None)
    if style == 'Talking Room': return ('talking_room', None)
    if style == 'Letter': return ('letter', None)
    if style == 'Identity': return ('identity_reveal', detect_identity_subtype(t))
    if style == 'Social': return ('social_media', None)
    if style == 'Notice': return ('program_notice', None)
    if style == 'Guide': return ('program_rule', None)
    if style == 'Lyrics': return ('lyrics', None)
    if style == 'Interlude': return ('interlude', None)
    if style == 'Normal': return ('narrative', None)
    return ('fallback', None)

# ---- speaker extraction (display-only; text preserved) ----
def extract_speaker(t):
    m = re.match(r'^([A-Za-z0-9一-龥·．.]{1,14})[：:]\s*', t)
    if m:
        return m.group(1), t[m.end():]
    return None, t

def make_child_segments(source_id, t):
    """Split an Observer block that contains multiple labelled observers."""
    segs = re.split(r'(?=(?:观察员[1-4])[：:])', t)
    segs = [s for s in segs if s.strip()]
    if len(segs) <= 1:
        return None
    children = []
    for idx, s in enumerate(segs):
        sp, body = extract_speaker(s)
        children.append({
            'parentSourceId': source_id,
            'segmentId': f'{source_id}-c{idx+1}',
            'order': idx + 1,
            'speaker': sp,
            'text': s,
        })
    if ''.join(s['text'] for s in children) != t:
        return None
    return children

# ---- build blocks ----
blocks = []
type_counter = Counter()
subtype_counter = Counter()
child_total = 0
empty_text = 0
for order_global, (sid, style, text) in enumerate(blocks_raw):
    chap_name, chap_idx = chapter_from_source(sid)
    if chap_name is None:
        raise SystemExit(f"Cannot map chapter for sourceId {sid}")
    ttype, tsub = classify(style, text)
    speaker, display = extract_speaker(text)
    # forum username extraction (display-only; text preserved)
    if ttype == 'forum' and speaker is None:
        m = re.match(r'^([^|｜]{1,20})[|｜]\s*(.*)$', text)
        if m:
            speaker = m.group(1)
    blk = {
        'sourceId': sid,
        'chapter': chap_name,
        'chapterIndex': chap_idx,
        'globalOrder': order_global,
        'order': 0,  # set per-chapter below
        'type': ttype,
        'subtype': tsub,
        'style': style,
        'speaker': speaker,
        'text': text,
    }
    # child segments for observer blocks with multiple labelled observers
    if style == 'Observer':
        cs = make_child_segments(sid, text)
        if cs:
            blk['childSegments'] = cs
            child_total += len(cs)
    if not text:
        empty_text += 1
    type_counter[ttype] += 1
    if tsub:
        subtype_counter[f'{ttype}/{tsub}'] += 1
    else:
        subtype_counter[ttype] += 1
    blocks.append(blk)

# per-chapter order
per_chap = defaultdict(int)
for b in blocks:
    per_chap[b['chapter']] += 1
    b['order'] = per_chap[b['chapter']]

# ---- duplicate detection (intentional duplicate groups) ----
dup_groups = 0
for i in range(len(blocks) - 2):
    if blocks[i]['text'] and blocks[i]['text'] == blocks[i+1]['text'] == blocks[i+2]['text']:
        dup_groups += 1

# ---- validation ----
source_ids = [b['sourceId'] for b in blocks]
missing_sid = sum(1 for s in source_ids if not s)
dup_sid = len(source_ids) - len(set(source_ids))
chapters_present = sorted(set(b['chapter'] for b in blocks), key=lambda c: CHAP_ORDER.index(c))
order_ok = (chapters_present == CHAP_ORDER)
unclassified = sum(1 for b in blocks if b['type'] == 'fallback')

# ---- write per-chapter JSON ----
CHAP_FILE_PREFIX = {'第1部分':'01','第2部分':'02','第3部分':'03','第4部分':'04','第5部分':'05',
                    '第6部分':'06','第7部分':'07','第8部分':'08','第9部分':'09','完结篇':'10'}
chapter_files = {}
for chap in CHAP_ORDER:
    cblocks = [b for b in blocks if b['chapter'] == chap]
    fname = 'chapter-' + CHAP_FILE_PREFIX[chap] + '.json'
    fpath = os.path.join(OUT_DIR, fname)
    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(cblocks, f, ensure_ascii=False, indent=1)
    chapter_files[chap] = {'file': fname, 'count': len(cblocks),
                           'first': cblocks[0]['sourceId'], 'last': cblocks[-1]['sourceId']}

# ---- manifest ----
manifest = {
    'title': '换乘恋爱 · 观众视角互动阅读',
    'totalChapters': len(CHAP_ORDER),
    'totalBlocks': len(blocks),
    'childSegments': child_total,
    'chapters': [
        {
            'id': idx+1,
            'name': chap,
            'file': chapter_files[chap]['file'],
            'blockCount': chapter_files[chap]['count'],
            'firstSourceId': chapter_files[chap]['first'],
            'lastSourceId': chapter_files[chap]['last'],
        } for idx, chap in enumerate(CHAP_ORDER)
    ],
    'typeCounts': dict(type_counter),
    'subtypeCounts': dict(subtype_counter),
}
with open(os.path.join(OUT_DIR, 'manifest.json'), 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

# ---- report ----
report = {
    'chapters': len(CHAP_ORDER),
    'blocks': len(blocks),
    'childSegments': child_total,
    'unclassified': unclassified,
    'missingSourceId': missing_sid,
    'duplicateSourceId': dup_sid,
    'chapterOrderOk': order_ok,
    'emptyText': empty_text,
    'dupGroups': dup_groups,
    'perChapter': {chap: chapter_files[chap]['count'] for chap in CHAP_ORDER},
    'typeCounts': dict(type_counter),
    'subtypeCounts': dict(subtype_counter),
}
with open(os.path.join(OUT_DIR, '..', 'coverage-report.json'), 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

print(json.dumps(report, ensure_ascii=False, indent=2))
print("\nPer-chapter files:")
for chap in CHAP_ORDER:
    print(f"  {chap}: {chapter_files[chap]['count']} blocks  {chapter_files[chap]['first']} .. {chapter_files[chap]['last']}")
