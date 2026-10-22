"""Independently check CYL predictions; optionally export valid predictions with CadQuery."""
from __future__ import annotations

import argparse
import json
import math
from pathlib import Path


def check(text: str) -> tuple[int, int] | None:
    words = text.split()
    if len(words) != 3 or words[0] != 'CYL':
        return None
    try:
        r, h = int(words[1]), int(words[2])
    except ValueError:
        return None
    return (r, h) if 1 <= r <= 6 and 1 <= h <= 6 else None


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('metrics', type=Path)
    parser.add_argument('--export-step', type=Path, help='Requires an independently installed CadQuery')
    args = parser.parse_args()
    report = json.loads(args.metrics.read_text(encoding='utf-8'))
    samples = report.get('test', report.get('after', {})).get('predictions', [])
    if not samples:
        raise SystemExit('No test/after predictions found in this report.')
    valid, satisfied = 0, 0
    if args.export_step:
        import cadquery as cq
        args.export_step.mkdir(parents=True, exist_ok=True)
    for index, row in enumerate(samples):
        actual, expected = check(row['prediction']), check(row['target'])
        if expected is None:
            raise SystemExit('Invalid target command in evaluation report.')
        valid += actual is not None
        if actual:
            satisfied += int(actual[0] == expected[0]) + int(actual[1] == expected[1])
            volume = math.pi * actual[0] ** 2 * actual[1]
            assert math.isfinite(volume) and volume > 0
            if args.export_step:
                shape = cq.Workplane('XY').circle(actual[0]).extrude(actual[1])
                cq.exporters.export(shape, str(args.export_step / f'prediction-{index:03d}.step'))
    print(json.dumps({'samples': len(samples), 'valid_command': valid / len(samples),
                      'radius_height_satisfaction': satisfied / (2 * len(samples)),
                      'brep_export_executed': bool(args.export_step)}, indent=2))


if __name__ == '__main__':
    main()
