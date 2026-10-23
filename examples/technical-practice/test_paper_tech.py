"""Behavioral checks for the inspectable mathematical mechanism examples."""
import math
import unittest

from paper_tech import attention, dpo_loss, farthest_points, lcs_pairs, quantize


class MechanismTests(unittest.TestCase):
    def test_quantization_endpoints_and_error_bound(self):
        for bins in [2, 16, 256]:
            self.assertEqual(quantize(0, bins), 0)
            self.assertEqual(quantize(1, bins), bins - 1)
            for step in range(101):
                value = step / 100
                self.assertLessEqual(abs(quantize(value, bins) / (bins - 1) - value),
                                     0.5 / (bins - 1) + 1e-12)
        with self.assertRaises(ValueError):
            quantize(1.1)

    def test_sampling_uses_distance_to_the_whole_selected_set(self):
        # The final interior point must be measured against both endpoints.
        points = [[0.0], [1.0], [4.0], [10.0]]
        self.assertEqual(farthest_points(points, 3), [0, 3, 2])
        self.assertEqual(len(set(farthest_points(points, 10))), 4)

    def test_lcs_handles_repeated_values_and_noncontiguous_matches(self):
        before = list('ABCBDAB')
        after = list('BDCABA')
        pairs = lcs_pairs(before, after)
        self.assertEqual(len(pairs), 4)
        self.assertTrue(all(before[i] == after[j] for i, j in pairs))
        self.assertTrue(all(i < k and j < l for (i, j), (k, l) in zip(pairs, pairs[1:])))
        self.assertEqual(lcs_pairs([], after), [])

    def test_attention_is_a_convex_combination_of_values(self):
        result = attention()
        for weights, output in zip(result['weights'], result['outputs']):
            self.assertAlmostEqual(sum(weights), 1.0)
            self.assertTrue(all(w > 0 for w in weights))
            for d, value in enumerate(output):
                bounds = [v[d] for v in result['values']]
                self.assertLessEqual(min(bounds), value)
                self.assertLessEqual(value, max(bounds))
        self.assertNotEqual(result['weights'][0], result['weights'][1])

    def test_dpo_is_relative_to_reference_and_numerically_stable(self):
        neutral = dpo_loss(-5, -7, -5, -7)
        self.assertAlmostEqual(neutral, math.log(2))
        self.assertLess(dpo_loss(-4, -8, -5, -7), neutral)
        self.assertGreater(dpo_loss(-6, -6, -5, -7), neutral)
        self.assertAlmostEqual(dpo_loss(-15, -17, -5, -7), neutral)
        self.assertTrue(math.isfinite(dpo_loss(-10000, 0, 0, 0)))


if __name__ == '__main__':
    unittest.main()
