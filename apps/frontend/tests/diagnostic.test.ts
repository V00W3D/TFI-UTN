import { describe, expect, it } from 'vitest';
import * as z from 'zod';

describe('Zod Diagnostic', () => {
  it('should have z defined', () => {
    expect(z).toBeDefined();
    expect(z.object).toBeDefined();
    const schema = z.object({ a: z.string() });
    expect(schema.parse({ a: 'test' })).toEqual({ a: 'test' });
  });
});
