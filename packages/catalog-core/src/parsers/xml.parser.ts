import type { ParseResult } from '../types';

export function parseXml(_buffer: Buffer): ParseResult {
  throw new Error('XML catalog parsing is not enabled in V1.');
}
