/** @deprecated Use fetch-cambridge-listening-scripts.mjs */
import { spawnSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fetch-cambridge-listening-scripts.mjs')
const result = spawnSync(process.execPath, [script], { stdio: 'inherit' })
process.exit(result.status ?? 1)
