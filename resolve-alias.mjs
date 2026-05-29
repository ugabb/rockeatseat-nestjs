import { pathToFileURL } from 'node:url';
import { resolve as pathResolve } from 'node:path';

const aliasRoot = pathResolve(process.cwd(), 'dist', 'src');

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const url = pathToFileURL(pathResolve(aliasRoot, specifier.slice(2)));
    return nextResolve(url.href);
  }
  return nextResolve(specifier);
}
