import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const files = ['lab.py', 'hf_lora.py', 'check_cad.py', 'requirements.txt', 'requirements-hf.txt',
  'data/train.jsonl', 'data/validation.jsonl', 'data/test.jsonl', 'observed-run.json']

/** Publish only the authored teaching code and synthetic data, never personal sources or checkpoints. */
export async function buildPracticeAssets() {
  for (const file of files) {
    const output = path.join(root, 'docs/public/practice-lab', file)
    await fs.mkdir(path.dirname(output), { recursive: true })
    await fs.copyFile(path.join(root, 'examples/technical-practice', file), output)
  }
}
