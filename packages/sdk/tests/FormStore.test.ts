/**
 * @file FormStore.test.ts
 * @module SDK/Tests
 * @description Unit tests for FormStore, validating reactive state transitions and field coercions.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: Zod object schemas, field events (set, blur), trigger modes
 * outputs: reactive validity state (isFormValid, errors, touched, dirty)
 * rules: empty strings are coerced to null/undefined based on schema nullable/optional bounds before validation
 *
 * @technical
 * dependencies: vitest, FormStore, zod
 * flow: instantiate form store -> mutate state -> verify validation execution -> check state invariants
 *
 * @estimation
 * complexity: Medium
 * fpa: ILF
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FORM-STORE-01 to TC-FORM-STORE-03
 * ultima prueba exitosa: 2026-04-08 13:35:00
 *
 * @notes
 * decisions: focuses on state management correctness and Zod coercion mechanisms.
 */
import { describe, expect, it } from 'vitest';
import * as z from 'zod';
import { createFormStore } from '../FormStore';

const testSchema = z.object({
  requiredStr: z.string().min(3),
  optionalStr: z.string().optional(),
  nullableStr: z.string().nullable(),
});

describe('FormStore', () => {
  it('TC-FORM-STORE-01: 초기 상태 y defaults se configuran correctamente', () => {
    const useForm = createFormStore(testSchema, 'onChange');
    const state = useForm.getState();

    // Valores por defecto: strings vacíos
    expect(state.values.requiredStr).toBe('');
    expect(state.values.optionalStr).toBe('');
    expect(state.values.nullableStr).toBe('');
    
    // El form no es válido porque `requiredStr` necesita min(3) y está vacío
    expect(state.isFormValid).toBe(false);
    expect(state.isDirty).toBe(false);
  });

  it('TC-FORM-STORE-02: triggerMode onChange valida inmediatamente al hacer set', async () => {
    const useForm = createFormStore(testSchema, 'onChange');
    
    await useForm.getState().set('requiredStr', 'ab');
    let state = useForm.getState();
    expect(state.errors.requiredStr?.length).toBeGreaterThan(0);
    expect(state.isDirty).toBe(true);
    expect(state.isFormValid).toBe(false);

    await useForm.getState().set('requiredStr', 'valid');
    state = useForm.getState();
    expect(state.errors.requiredStr).toBeUndefined();
    expect(state.isFormValid).toBe(true);
  });

  it('TC-FORM-STORE-03: campos optional y nullable coercionan strings vacíos sin fallar validación de Zod', async () => {
    const useForm = createFormStore(testSchema, 'onSubmit');
    
    // Set field to empty str ('') - internally FormStore will coerce to undefined/null for validation
    await useForm.getState().set('optionalStr', '');
    await useForm.getState().set('nullableStr', '');
    await useForm.getState().set('requiredStr', 'valid-text');

    const isValid = await useForm.getState().validate();
    expect(isValid).toBe(true);
    
    // Ensure actual values remain empty strings for React controlled inputs
    expect(useForm.getState().values.optionalStr).toBe('');
    expect(useForm.getState().values.nullableStr).toBe('');
  });
});
