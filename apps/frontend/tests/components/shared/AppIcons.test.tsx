// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import * as Icons from '../../../src/components/shared/AppIcons';

describe('AppIcons', () => {
  it('se renderizan correctamente como SVG', () => {
    const { container } = render(
      <>
        <Icons.PlateIcon />
        <Icons.StarIcon />
        <Icons.TrendingIcon />
      </>
    );
    expect(container.querySelectorAll('svg')).toHaveLength(3);
  });
});
