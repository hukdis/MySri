"""Import the user's HTML as a publication-safe snapshot; never execute its scripts."""
import argparse
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path


class ResearchData(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.active = False
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == 'script' and dict(attrs).get('id') == 'research-data':
            self.active = True

    def handle_endtag(self, tag: str) -> None:
        if tag == 'script':
            self.active = False

    def handle_data(self, data: str) -> None:
        if self.active:
            self.parts.append(data)


def select(record: dict, keys: str) -> dict:
    return {key: record[key] for key in keys.split() if key in record}


def public_fields(value):
    """Drop local evidence paths and personal planning fields at every depth."""
    blocked = {'local', 'local_file', 'local_notes', 'source', 'compute', 'fit',
               'effort', 'user_role', 'ai_role', 'profile', 'reading_tier'}
    if isinstance(value, dict):
        return {key: public_fields(item) for key, item in value.items() if key not in blocked}
    if isinstance(value, list):
        return [public_fields(item) for item in value]
    return value


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('source', type=Path)
    args = parser.parse_args()
    raw = args.source.read_bytes()
    html = ResearchData()
    html.feed(raw.decode('utf-8'))
    source = json.loads(''.join(html.parts))
    existing = {
        'Wu21': ('cad-0101', 'deepcad'), 'Kha24b': ('cad-0102', 'text2cad'),
        'Li25': ('cad-0103', 'cad-llama'), 'Ruk24': ('cad-0104', 'cad-recode'),
        'Xu24': ('cad-0105', 'cad-mllm'), 'Che25': ('cad-0106', 'cadreview'),
        'Mal26': ('cad-0107', 'cadtests'), 'Yua25': ('cad-0108', 'cad-editor'),
        'Mal24': ('cad-0109', 'cad-assistant'),
    }
    papers = []
    for item in source['papers']:
        paper = select(item, 'id short title authors doi url dates timeline_date timeline_basis year contribution scope version_note source_refs dataset_ids issue_ids')
        paper['classification'] = select(item['classification'], 'entry_type primary_task secondary_tasks applicable_tasks tags resource_types rationale provisional')
        article_id, slug = existing.get(item['id'], ('cad-ref-' + item['id'].lower(), None))
        paper.update(articleId=article_id, urlLocal='/cad/' + slug if slug else '/cad/papers/' + item['id'].lower(), hasReading=bool(slug))
        papers.append(paper)
    issues = []
    for item in source['issues']:
        issue = select(item, 'id title status primary_task secondary_tasks scenario failure consequence remaining_gap evidence nearest_solutions causes methods data_plan experiment paper_ids dataset_ids')
        issues.append(public_fields(issue))
    datasets = []
    for item in source['datasets']:
        dataset = select(item, 'id name year paper_links formats tasks scale license access versions storage split provenance first_use limitations source_refs sample_checks task_ids year_basis availability_note issue_ids')
        # Only publication fields from usage and sample records are retained.
        dataset['first_use'] = select(item.get('first_use', {}), 'steps backend expected')
        dataset['sample_checks'] = [select(check, 'id url checked_on operation geometry_execution http_status final_url format_check status') for check in item.get('sample_checks', [])]
        datasets.append(public_fields(dataset))
    output = {
        'edition': 2, 'sourceEdition': source['edition'], 'cutoff': source['cutoff'],
        'classificationUpdated': source['classification_updated_on'], 'importedOn': '2026-10-19',
        'provenance': {'label': '用户提供的研究发展树 HTML（第四版）', 'sha256': hashlib.sha256(raw).hexdigest()},
        'tasks': source['task_tracks'], 'facets': source['facet_catalog'],
        'papers': public_fields(papers), 'datasets': datasets, 'issues': issues,
        'relations': public_fields([select(item, 'id from to type status description evidence via') for item in source['relations']]),
        'concepts': source['relation_concepts'],
        'externalPapers': public_fields([select(item, 'id title url year contribution_scope') for item in source['external_papers']]),
    }
    root = Path(__file__).resolve().parents[1]
    (root / 'catalog/cad-research.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    mapping = {
        'sourceSha256': output['provenance']['sha256'], 'importedOn': output['importedOn'],
        'paperMappings': [{'sourceId': p['id'], 'articleId': p['articleId'], 'url': p['urlLocal'], 'action': '关联现有详读' if p['hasReading'] else '新增资料记录'} for p in papers],
        'counts': {'papers': len(papers), 'datasets': len(datasets), 'issues': len(issues), 'relations': len(output['relations'])},
        'duplicatePolicy': '每条来源记录保留稳定 ID；九篇同一论文关联已有详读，不按短名合并其他版本或同名工作。',
        'reviewed': False,
    }
    (root / 'catalog/cad-v2-source-map.json').write_text(json.dumps(mapping, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(mapping['counts']))


if __name__ == '__main__':
    main()
