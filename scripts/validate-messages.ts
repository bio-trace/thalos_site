import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

type Messages = Record<string, unknown>;
type Schema = Record<string, unknown>;

export function validateMessages(
  schema: Schema,
  locales: Record<string, Messages>
): { ok: true } | { ok: false; errors: string[] } {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const errors: string[] = [];
  for (const [locale, messages] of Object.entries(locales)) {
    if (!validate(messages)) {
      for (const err of validate.errors ?? []) {
        const extra =
          err.keyword === 'additionalProperties' && err.params?.additionalProperty
            ? ` ('${err.params.additionalProperty}')`
            : '';
        errors.push(`[${locale}] ${err.instancePath || '/'} ${err.message}${extra}`);
      }
    }
  }
  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

async function main() {
  const cwd = process.cwd();
  const schemaPath = path.join(cwd, 'lib', 'content', 'messages-schema.json');
  const schema = JSON.parse(await fs.readFile(schemaPath, 'utf8'));
  const locales: Record<string, Messages> = {};
  for (const locale of ['de', 'en']) {
    const file = path.join(cwd, 'messages', `${locale}.json`);
    locales[locale] = JSON.parse(await fs.readFile(file, 'utf8'));
  }
  const result = validateMessages(schema, locales);
  if (result.ok) {
    console.log('✓ messages valid');
    process.exit(0);
  }
  for (const e of result.errors) console.error('✗', e);
  process.exit(1);
}

const __thisFile = fsSync.realpathSync(fileURLToPath(import.meta.url));
const __argv1 = fsSync.realpathSync(process.argv[1]);
if (__thisFile === __argv1) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
