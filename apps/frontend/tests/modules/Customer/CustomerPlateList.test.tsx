/**
 * @file CustomerPlateList.test.tsx
 * @module Customer/Tests
 * @description Unit tests for CustomerPlateList component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: plate array, selection callback
 * outputs: rendered list of plate cards
 * rules: show empty state if no plates; trigger callback on selection
 *
 * @technical
 * dependencies: @testing-library/react, vitest
 * flow: render component -> verify list length -> click item -> verify callback
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-FE-CPL-01, TC-FE-CPL-02
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CustomerPlateList from '../../../src/modules/Customer/components/CustomerPlateList';
import type { CustomerPlate } from '../../../src/modules/Customer/customerPlate';

const mockPlates: CustomerPlate[] = [
  {
    id: 'p1',
    name: 'Plate 1',
    description: 'Desc 1',
    menuPrice: 100,
    size: 'REGULAR',
    isAvailable: true,
    avgRating: 4.5,
    ratingsCount: 10,
    recipe: {
      type: 'MAIN',
      items: [],
    },
    reviews: [],
  } as any,
  {
    id: 'p2',
    name: 'Plate 2',
    description: 'Desc 2',
    menuPrice: 150,
    size: 'LARGE',
    isAvailable: false,
    avgRating: 0,
    ratingsCount: 0,
    recipe: {
      type: 'MAIN',
      items: [],
    },
    reviews: [],
  } as any,
];

describe('CustomerPlateList', () => {
  it('TC-FE-CPL-01: renderiza una lista de platos y permite seleccionar uno', () => {
    const onSelect = vi.fn();
    render(
      <CustomerPlateList 
        plates={mockPlates} 
        selectedPlateId="p1" 
        onSelect={onSelect} 
      />
    );

    expect(screen.getByText('Plate 1')).toBeInTheDocument();
    expect(screen.getByText('Plate 2')).toBeInTheDocument();

    const plate2Btn = screen.getByText('Plate 2').closest('button');
    fireEvent.click(plate2Btn!);

    expect(onSelect).toHaveBeenCalledWith('p2');
  });

  it('TC-FE-CPL-02: muestra mensaje cuando no hay platos', () => {
    render(
      <CustomerPlateList 
        plates={[]} 
        selectedPlateId={null} 
        onSelect={() => {}} 
      />
    );

    expect(screen.getByText(/No hay platos que coincidan/i)).toBeInTheDocument();
  });
});
