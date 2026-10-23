"""Inspectable CAD-paper mechanism examples; standard library only, no model downloads.

All vectors, commands and scores are authored teaching fixtures, not paper results.
Run each subcommand from the same directory as the website's practical examples.
"""
from __future__ import annotations

import argparse
import json
import math


# region representation
def quantize(value: float, bins: int = 256) -> int:
    if not 0 <= value <= 1 or bins < 2:
        raise ValueError('Expected normalized value in [0, 1] and at least two bins.')
    return round(value * (bins - 1))


def representation(bins: int) -> dict:
    values = [0.0, 0.125, 0.5, 0.9, 1.0]
    return {'bins': bins, 'values': [
        {'value': v, 'token': quantize(v, bins), 'decoded': quantize(v, bins) / (bins - 1),
         'absolute_error': abs(v - quantize(v, bins) / (bins - 1))} for v in values],
         'sequence': ['SOL', 'LINE 0 0', 'LINE 1 0', 'LINE 1 1', 'LINE 0 1', 'EXTRUDE 0.5', 'EOS'],
         'geometry_executed': False}
# endregion representation


# region features
def farthest_points(points: list[list[float]], count: int) -> list[int]:
    selected = [0]
    while len(selected) < min(count, len(points)):
        candidates = [i for i in range(len(points)) if i not in selected]
        selected.append(max(candidates, key=lambda i: min(
            sum((a - b) ** 2 for a, b in zip(points[i], points[j])) for j in selected)))
    return selected


def fourier(point: list[float], frequencies: list[int]) -> list[float]:
    return point + [fn(2 * math.pi * f * coordinate)
                    for f in frequencies for coordinate in point for fn in (math.sin, math.cos)]


def features() -> dict:
    points = [[math.cos(i * math.pi / 4), math.sin(i * math.pi / 4), z]
              for z in (0.0, 1.0) for i in range(8)]
    selected = farthest_points(points, 4)
    encoded = [fourier(points[i], [1, 2]) for i in selected]
    return {'input_shape': [16, 3], 'selected_indices': selected,
            'encoded_shape': [len(encoded), len(encoded[0])], 'first_feature': encoded[0],
            'learned_encoder': False, 'projection_trained': False}
# endregion features


# region attention
def attention() -> dict:
    queries = [[1.0, 0.0], [0.0, 1.0]]
    keys = [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]]
    values = [[2.0, 0.0], [0.0, 4.0], [1.0, 1.0]]
    weights, outputs = [], []
    for query in queries:
        scores = [sum(q * k for q, k in zip(query, key)) / math.sqrt(len(query)) for key in keys]
        unnormalized = [math.exp(s - max(scores)) for s in scores]
        row = [w / sum(unnormalized) for w in unnormalized]
        weights.append(row)
        outputs.append([sum(w * value[d] for w, value in zip(row, values)) for d in range(2)])
    return {'queries': queries, 'keys': keys, 'values': values,
            'weights': weights, 'outputs': outputs, 'trained': False}
# endregion attention


# region editing
def lcs_pairs(before: list[str], after: list[str]) -> list[tuple[int, int]]:
    table = [[0] * (len(after) + 1) for _ in range(len(before) + 1)]
    for i in range(len(before) - 1, -1, -1):
        for j in range(len(after) - 1, -1, -1):
            table[i][j] = 1 + table[i + 1][j + 1] if before[i] == after[j] else max(table[i + 1][j], table[i][j + 1])
    pairs, i, j = [], 0, 0
    while i < len(before) and j < len(after):
        if before[i] == after[j]:
            pairs.append((i, j))
            i, j = i + 1, j + 1
        elif table[i + 1][j] >= table[i][j + 1]:
            i += 1
        else:
            j += 1
    return pairs


def editing() -> dict:
    before = ['SKETCH', 'RECT', '10', '6', 'EXTRUDE', '4', 'EOS']
    after = ['SKETCH', 'RECT', '10', '6', 'EXTRUDE', '6', 'EOS']
    pairs = lcs_pairs(before, after)
    retained = {i for i, _ in pairs}
    return {'instruction': 'Change only the extrusion height from 4 to 6.',
            'before': before, 'after': after, 'retained_pairs': pairs,
            'masked': [token if i in retained else '<mask>' for i, token in enumerate(before)],
            'removed': [token for i, token in enumerate(before) if i not in retained],
            'inserted': [token for j, token in enumerate(after) if j not in {b for _, b in pairs}],
            'training_labels_from_paired_answers': True, 'learned_locator_executed': False}
# endregion editing


# region feedback
def feedback() -> dict:
    target = {'width': 10, 'depth': 6, 'height': 6}
    candidates = [{'width': 10, 'depth': 6, 'height': 4},
                  {'width': 12, 'depth': 6, 'height': 6}, target.copy()]
    trace = []
    for candidate in candidates:
        failures = [key for key, expected in target.items() if candidate[key] != expected]
        trace.append({'candidate': candidate, 'failed_requirements': failures, 'accepted': not failures})
    return {'requirements': target, 'trace': trace, 'model_called': False,
            'geometry_executed': False, 'selection': 'first candidate passing every supplied check'}
# endregion feedback


# region preference
def dpo_loss(policy_chosen: float, policy_rejected: float,
             ref_chosen: float, ref_rejected: float, beta: float = 0.1) -> float:
    margin = beta * ((policy_chosen - policy_rejected) - (ref_chosen - ref_rejected))
    return max(-margin, 0) + math.log1p(math.exp(-abs(margin)))


def preference() -> dict:
    # Log-probabilities are invented scalars to explain the objective, not model measurements.
    cases = [('same_as_reference', -5.0, -7.0), ('prefer_chosen_more', -4.0, -8.0),
             ('prefer_rejected_more', -6.0, -6.0)]
    return {'beta': 0.1, 'reference': {'chosen_logp': -5.0, 'rejected_logp': -7.0},
            'cases': [{'name': name, 'loss': dpo_loss(chosen, rejected, -5.0, -7.0)}
                      for name, chosen, rejected in cases], 'model_trained': False}
# endregion preference


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('topic', choices=['representation', 'features', 'attention', 'editing', 'feedback', 'preference'])
    parser.add_argument('--bins', type=int, default=256)
    args = parser.parse_args()
    if args.bins < 2:
        parser.error('bins must be at least two')
    result = representation(args.bins) if args.topic == 'representation' else {
        'features': features, 'attention': attention, 'editing': editing,
        'feedback': feedback, 'preference': preference}[args.topic]()
    print(json.dumps(result, indent=2))
