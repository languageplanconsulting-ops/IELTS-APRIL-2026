import re, json, sys

def validate(tsfile, jsonfile, exid):
    src = open(tsfile).read()
    data = json.load(open(jsonfile))
    ex = next(e for e in data if e['exId'] == exid)
    paras = {p['role']: p['text'] for p in ex['paragraphs']}

    n_typ = len(re.findall(r'\btyp2\(', src))
    n_sel = len(re.findall(r'\bsel2\(', src))
    print(f"{exid}: typ2={n_typ} sel2={n_sel} total={n_typ+n_sel}")

    steps = []
    for m in re.finditer(r"role:\s*'(\w+)'", src):
        role = m.group(1)
        seg_kw = 'segments: ['
        seg_start = src.index(seg_kw, m.end())
        i = seg_start + len(seg_kw)
        depth = 1
        while depth > 0:
            if src[i] == '[': depth += 1
            elif src[i] == ']': depth -= 1
            i += 1
        body = src[seg_start+len(seg_kw):i-1]
        steps.append((role, body))

    ok = True
    for role, body in steps:
        recon = []
        pattern = re.compile(r"(t2|typ2|sel2)\(")
        for mm in pattern.finditer(body):
            start = mm.end()
            depth = 1
            j = start
            while depth > 0:
                if body[j] == '(': depth += 1
                elif body[j] == ')': depth -= 1
                j += 1
            argstr = body[start:j-1]
            fn = mm.group(1)
            if fn == 't2':
                recon.append(eval(argstr, {}, {}))
            elif fn == 'typ2':
                args = split_args(argstr)
                answers = eval(args[2], {}, {})
                recon.append(answers[0])
            elif fn == 'sel2':
                args = split_args(argstr)
                answer = eval(args[2], {'WGB2_NO_ARTICLE': '(ไม่ต้องใส่)'})
                recon.append('' if answer == '(ไม่ต้องใส่)' else answer)
        full = ''.join(recon)
        expected = paras.get(role)
        if expected is None:
            continue
        if full == expected:
            print(f"  [{role}] OK")
        else:
            ok = False
            print(f"  [{role}] MISMATCH")
            for k in range(min(len(full), len(expected))):
                if full[k] != expected[k]:
                    print(f"    first diff at {k}: got={full[max(0,k-20):k+20]!r} exp={expected[max(0,k-20):k+20]!r}")
                    break
            else:
                print(f"    length diff: got {len(full)} expected {len(expected)}")
    return ok

def split_args(s):
    args = []
    depth = 0
    cur = ''
    in_str = None
    i = 0
    while i < len(s):
        c = s[i]
        if in_str:
            cur += c
            if c == '\\' and i+1 < len(s):
                cur += s[i+1]; i += 2; continue
            if c == in_str: in_str = None
            i += 1; continue
        if c in ("'", '"'):
            in_str = c; cur += c
        elif c in '[(':
            depth += 1; cur += c
        elif c in '])':
            depth -= 1; cur += c
        elif c == ',' and depth == 0:
            args.append(cur); cur = ''
        else:
            cur += c
        i += 1
    if cur.strip(): args.append(cur)
    return [a.strip() for a in args]

if __name__ == '__main__':
    validate(sys.argv[1], sys.argv[2], sys.argv[3])
