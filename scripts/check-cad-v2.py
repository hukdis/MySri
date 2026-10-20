"""Verify the published-site layout, research navigation and legacy reading pages."""
import hashlib
import json
import os
import re
import time
from pathlib import Path
from urllib.parse import unquote, urlsplit

from bs4 import BeautifulSoup
from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = os.environ.get('ATLAS_TEST_URL', 'http://127.0.0.1:5173/').rstrip('/') + '/'
BASE_PATH = urlsplit(BASE).path
DATA = json.loads((ROOT / 'catalog/cad-research.json').read_text(encoding='utf-8'))
OUTPUT = ROOT / 'artifacts/cad-v2'
OUTPUT.mkdir(parents=True, exist_ok=True)


def verify_files() -> dict:
    figures = json.loads((ROOT / 'catalog/cad-figure-source-map.json').read_text(encoding='utf-8'))['mappings']
    for item in figures:
        assert hashlib.sha256((ROOT / item['publishedImage']).read_bytes()).hexdigest() == item['sha256']
    snapshot = (ROOT / 'catalog/cad-research.json').read_text(encoding='utf-8')
    assert not re.search(r'(?<![A-Za-z])[A-Za-z]:[\\/]', snapshot)
    for private in ['"profile"', '"local_file"', '"local_notes"', '4090', '2027年3月']:
        assert private not in snapshot, private
    dist = ROOT / 'docs/.vitepress/dist'
    broken = set()
    documents = {}
    for file in dist.rglob('*.html'):
        soup = BeautifulSoup(file.read_text(encoding='utf-8'), 'html.parser')
        reader=soup.select_one('.vp-doc')
        if reader:
            content=reader.get_text(' ',strip=True)
            for phrase in ['待人工复核','来源稿整理','你来填写','论文解读模板','来源与维护']:
                assert phrase not in content,(str(file),phrase)
        if reader and reader.select('.paper-figure'):
            events=[]
            for node in reader.descendants:
                if getattr(node,'name',None)=='figure' and 'paper-figure' in node.get('class',[]):
                    events.append('figure')
                elif getattr(node,'name',None)=='strong':
                    label=node.get_text(strip=True)
                    if label.startswith('原文翻译（'):events.append('translation')
                    elif label=='图表解读':events.append('explanation')
            assert events==['figure','translation','explanation']*len(reader.select('.paper-figure')),(str(file),events)
            assert len([x for x in reader.select('details summary') if x.get_text(strip=True)=='对照英文原文'])==len(reader.select('.paper-figure'))
        documents[file] = soup
    for file, soup in documents.items():
        for link in soup.select('a[href]'):
            href = urlsplit(link['href'])
            if href.scheme or href.netloc or not href.path.startswith('/'):
                continue
            route = unquote(href.path)
            if BASE_PATH != '/' and not route.startswith(BASE_PATH):
                broken.add((str(file.relative_to(dist)), link['href'], 'missing base'))
                continue
            route = route[len(BASE_PATH):]
            candidate = dist / route
            if candidate.is_dir():
                candidate /= 'index.html'
            elif not candidate.suffix:
                candidate = candidate.with_suffix('.html')
            if not candidate.exists():
                broken.add((str(file.relative_to(dist)), link['href'], 'missing path'))
            elif href.fragment and candidate in documents and not documents[candidate].find(id=unquote(href.fragment)):
                broken.add((str(file.relative_to(dist)), link['href'], 'missing anchor'))
    assert not broken, sorted(broken)[:30]
    manifest_path = ROOT / 'catalog/source-manifest.json'
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
        assert all(hashlib.sha256((ROOT / 'sources' / name).read_bytes()).hexdigest() == item['hash'] for name, item in manifest.items())
    return {'htmlPages': len(documents), 'figureFiles': len(figures), 'brokenLinks': len(broken)}


def main() -> None:
    result = verify_files()
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # A cold route module can arrive after the HTML; the first choice must survive initialization.
        slow = browser.new_page(viewport={'width':1440, 'height':1000})
        def delay_route(route):
            time.sleep(1)
            route.continue_()
        slow.route('**/cad_index.md.*.js', delay_route)
        slow.goto(BASE + 'cad/', wait_until='domcontentloaded')
        slow.get_by_label('任务',exact=True).select_option('EDIT')
        expect(slow.locator('.cad-record')).to_have_count(11)
        slow.close()
        page = browser.new_page(viewport={'width':1440, 'height':1000})
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('response', lambda response: errors.append(f'HTTP {response.status}: {response.url}') if response.status >= 400 and response.url.startswith(BASE) else None)
        page.goto(BASE + 'cad/')
        expect(page.locator('.cad-task-card')).to_have_count(4)
        expect(page.locator('.cad-record')).to_have_count(103)
        page.screenshot(path=str(OUTPUT / 'overview-desktop.png'))
        page.get_by_label('任务', exact=True).select_option('EDIT')
        expect(page.locator('.cad-record')).to_have_count(11)
        page.wait_for_url('**task=EDIT')
        page.get_by_label('任务', exact=True).select_option('REC')
        expect(page.locator('.cad-record')).to_have_count(31)
        page.wait_for_url('**task=REC')
        page.go_back()
        expect(page.get_by_label('任务', exact=True)).to_have_value('EDIT')
        expect(page.locator('.cad-record')).to_have_count(11)
        page.goto(BASE + 'cad/reading-navigation.html?reading=1')
        expect(page.locator('.cad-record')).to_have_count(9)
        page.get_by_role('button', name='重置筛选', exact=True).click()
        expect(page.locator('.cad-record')).to_have_count(134)
        page.get_by_label('搜索当前资料', exact=True).fill('IterCAD')
        expect(page.locator('.cad-record')).to_have_count(2)
        page.get_by_label('搜索当前资料', exact=True).fill('nonexistent-probe-4721')
        expect(page.locator('.cad-empty')).to_be_visible()
        page.get_by_role('button', name='重置筛选', exact=True).click()
        page.get_by_role('button', name='展开五类标签筛选 +', exact=True).click()
        page.get_by_label('方法', exact=True).select_option('强化学习')
        expect(page.locator('.cad-record').first).to_be_visible()
        assert page.locator('.cad-record').count() < 134
        page.screenshot(path=str(OUTPUT / 'library-filter.png'))
        for task, count in [('generation',42),('reconstruction',31),('editing',11),('analysis',19)]:
            page.goto(BASE + 'cad/tasks/' + task + '.html')
            expect(page.locator('.cad-record')).to_have_count(count)
        page.goto(BASE + 'cad/foundations.html')
        expect(page.locator('.cad-record')).to_have_count(9)
        page.goto(BASE + 'cad/resources.html')
        expect(page.locator('.cad-record')).to_have_count(35)
        page.get_by_label('数据格式', exact=True).select_option('STEP')
        expect(page.locator('.cad-record').first).to_be_visible()
        assert page.locator('.cad-record').count() < 35
        page.goto(BASE + 'cad/issues.html')
        expect(page.locator('.cad-record')).to_have_count(26)
        page.get_by_label('问题证据', exact=True).select_option('candidate_needs_validation')
        expect(page.locator('.cad-record')).to_have_count(4)
        page.goto(BASE + 'cad/issues/i-a-01.html')
        expect(page.locator('.vp-doc h2').filter(has_text='最小验证与否定条件')).to_be_visible()
        assert not page.locator('mjx-merror').count()
        page.goto(BASE + 'cad/relationships.html')
        expect(page.locator('.cad-relation-edge')).to_have_count(4)
        page.get_by_label('关系图中心记录',exact=True).select_option('Kha24b')
        expect(page.locator('.cad-relation-edge')).to_have_count(sum(1 for r in DATA['relations'] if r['from']=='Kha24b' or r['to']=='Kha24b'))
        page.goto(BASE + 'cad/deepcad.html')
        expect(page.locator('.paper-figure')).to_have_count(11)
        page.get_by_role('button',name='放大原图',exact=True).first.click()
        expect(page.locator('.paper-image-dialog[open]')).to_be_visible()
        image=page.locator('.paper-image-dialog[open] img')
        page.wait_for_function('(image)=>image.complete && image.naturalWidth>0',arg=image.element_handle())
        page.keyboard.press('Escape')
        expect(page.locator('.paper-image-dialog[open]')).to_have_count(0)
        for name in ['ppo','grpo']:
            page.goto(BASE + 'reinforcement-learning/' + name + '.html')
            expect(page.locator('.diagram-compact svg')).to_be_visible(timeout=30000)
            assert page.locator('.diagram-compact svg').bounding_box()['height'] <= 180.5
            assert not page.locator('mjx-merror').count()
        page.goto(BASE + 'cad/')
        page.get_by_role('button',name='搜索笔记',exact=True).click()
        page.locator('.VPLocalSearchBox input').fill('HierCAD')
        expect(page.locator('.VPLocalSearchBox a[href*="cad/papers/xu26b"]').first).to_be_visible(timeout=20000)
        page.keyboard.press('Escape')
        page.get_by_role('switch',name='切换到深色主题').click()
        expect(page.locator('html')).to_have_class('dark')
        assert page.locator('html').evaluate('(e)=>getComputedStyle(e).getPropertyValue("--vp-c-bg").trim()') == '#101010'
        page.screenshot(path=str(OUTPUT / 'overview-dark.png'))
        mobile=browser.new_page(viewport={'width':390,'height':844},is_mobile=True)
        for url in ['cad/','cad/reading-navigation.html','cad/resources.html','cad/issues.html','cad/deepcad.html']:
            mobile.goto(BASE + url)
            expect(mobile.locator('.vp-doc h1')).to_be_visible()
            assert mobile.evaluate('document.documentElement.scrollWidth<=innerWidth'), url
        mobile.goto(BASE+'cad/')
        mobile.screenshot(path=str(OUTPUT / 'overview-mobile.png'))
        mobile.get_by_label('搜索当前资料',exact=True).fill('DeepCAD')
        expect(mobile.get_by_role('link',name='DeepCAD ↗',exact=True)).to_be_visible()
        assert mobile.locator('.cad-record').count() < 103
        mobile.get_by_role('link',name='DeepCAD ↗',exact=True).click()
        expect(mobile.locator('.paper-figure')).to_have_count(11)
        browser.close()
    assert not errors, errors
    result.update(browserErrors=errors, academicReview=False, base=BASE)
    (OUTPUT / 'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(result))


if __name__ == '__main__':
    main()
