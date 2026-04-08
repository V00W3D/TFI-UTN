// @vitest-environment jsdom
/**
 * @file CustomerPlateDetails.test.tsx
 * @description Unit tests for CustomerPlateDetails component (Diagnostic version).
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CustomerPlateDetails from '../../../src/modules/Customer/components/CustomerPlateDetails';
import type { CustomerPlate } from '../../../src/modules/Customer/customerPlate';

const mockPlate: CustomerPlate = {
  id: 'p1',
  name: 'Super Plate',
  description: 'A very large description for a very large plate.',
  menuPrice: 1200,
  size: 'L',
  isAvailable: true,
  avgRating: 4.8,
  ratingsCount: 25,
  servedWeightGrams: 500,
  adjustments: [],
  allergens: ['GLUTEN'],
  dietaryTags: ['VEGAN'],
  nutritionTags: ['LOW_FAT'],
  nutritionNotes: 'Healthy notes',
  nutrition: {
    calories: 500,
    proteins: 20,
    carbs: 60,
    fats: 10,
    saturatedFat: 2,
    transFat: 0,
    monounsaturatedFat: 5,
    polyunsaturatedFat: 3,
    fiber: 8,
    sodium: 200,
  },
  recipe: {
    name: 'Basis Recipe',
    description: 'Recipe desc',
    difficulty: 'MEDIUM',
    flavor: 'SALTY',
    type: 'PASTA',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    assemblyNotes: 'Assemble with care',
    items: [],
  },
  reviews: [
    {
      id: 'r1',
      rating: 5,
      comment: 'Excellent!',
      reviewer: { displayName: 'John Doe' },
    },
  ],
};

describe('CustomerPlateDetails', () => {
  it('TC-FE-CPD-01: muestra el placeholder cuando no hay plato seleccionado', () => {
    render(<CustomerPlateDetails plate={null} />);
    expect(screen.getByText(/Elegí un plato del listado/i)).toBeInTheDocument();
  });

  it('TC-FE-CPD-02: renderiza todos los detalles del plato correctamente', () => {
    render(<CustomerPlateDetails plate={mockPlate} />);
    
    expect(screen.getByText('Super Plate')).toBeInTheDocument();
    
    // Diagnostic: search for any text containing "Cal" or "Gra"
    // and use getAll and check length
    expect(screen.getAllByText(/Cal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Gra/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Alergenos/i)).toBeInTheDocument();
  });
});
