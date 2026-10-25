"""Build a Shopify theme ZIP with the required directories at the archive root."""
import json
import re
import zipfile
from pathlib import Path

project = Path(__file__).resolve().parents[1]
theme = project / 'shopify-theme'
output = project / 'artifacts' / 'Print-Shopify.zip'
allowed = {'assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'}
files = sorted(path for path in theme.rglob('*') if path.is_file())
assert (theme / 'layout/theme.liquid').is_file()
assert (theme / 'templates/index.json').is_file()
for path in files:
    relative = path.relative_to(theme)
    assert relative.parts[0] in allowed, relative
    assert not path.is_symlink(), relative
    if path.suffix == '.json':
        data = json.loads(path.read_text())
        if relative.parts[0] == 'templates':
            for section in data.get('sections', {}).values():
                assert (theme / 'sections' / f"{section['type']}.liquid").exists(), relative
    if path.suffix == '.liquid':
        source = path.read_text()
        for raw_schema in re.findall(r'{%\s*schema\s*%}(.*?){%\s*endschema\s*%}', source, re.S):
            json.loads(raw_schema)
        for snippet in re.findall(r"{%[-\s]*render\s+'([^']+)'", source):
            assert (theme / 'snippets' / f'{snippet}.liquid').exists(), (relative, snippet)
output.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in files:
        archive.write(path, path.relative_to(theme).as_posix())
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    assert 'layout/theme.liquid' in archive.namelist()
    assert all(not name.startswith(('/', '../', 'shopify-theme/')) for name in archive.namelist())
print(f'{output}: {len(files)} fichiers, {output.stat().st_size} octets ; archive et schémas JSON valides.')
