#!/usr/bin/env python3
"""Generate the English interface from the shared app and reviewed phrase map.

Fails on untranslated Chinese text. --check verifies committed output is current.
No network access or third-party packages are needed.
"""
import json
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
dist = root / 'dist'
translations = json.loads((root / 'locales/en.json').read_text())
names = ['index.html', 'compare.js', 'illustrations.js', 'bench.html',
         'app.js', 'evidence.js', 'method-content.html']
shared = ['compare.css', 'style.css', 'readability.css', 'optics.js',
          'worker.js', 'illustration-worker.js', 'halo-display.js',
          'pj-night.png', 'pj-day.png', 'pj-guava.png']
check = '--check' in sys.argv
errors = []
for name in names:
    content = (dist / name).read_text()
    for source in sorted(translations, key=len, reverse=True):
        content = content.replace(source, translations[source])
    if re.search(r'[\u3400-\u9fff]', content):
        missing = re.findall(r'''[^<>\n"']*[\u3400-\u9fff][^<>\n"']*''', content)
        errors.append(f'{name}: untranslated phrases: {missing}')
        continue
    content = content.replace('lang="zh-Hans"', 'lang="en"')
    for asset in shared:
        content = content.replace("'./" + asset + "'", "'../" + asset + "'")
        content = content.replace("'" + asset + "'", "'../" + asset + "'")
        content = content.replace('"' + asset + '"', '"../' + asset + '"')
    content = content.replace('href="en/"', 'href="../"')
    content = content.replace('href="en/bench.html"', 'href="../bench.html"')
    content = content.replace('hreflang="en"', 'hreflang="zh-Hans"')
    content = content.replace('class="language-switch"', 'class="language-switch" lang="zh-Hans"')
    content = content.replace('>English</a>', '>中文</a>')
    destination = dist / 'en' / name
    if check:
        if not destination.exists() or destination.read_text() != content:
            errors.append(f'{destination.relative_to(root)} is stale')
    else:
        destination.parent.mkdir(exist_ok=True)
        destination.write_text(content)
audit_source = root / 'locales/VALIDATION.en.md'
if audit_source.exists():
    target = dist / 'en/VALIDATION.md'
    if check:
        if not target.exists() or target.read_text() != audit_source.read_text():
            errors.append('English validation document is stale')
    else:
        target.write_text(audit_source.read_text())
if errors:
    raise SystemExit('\n'.join(errors))
print('English interface is current.' if check else 'Generated English interface.')
