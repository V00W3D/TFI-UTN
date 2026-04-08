/**
 * @file ApiClient.test.ts
 * @module SDK/Tests
 * @description Unit tests for ApiClient frontend factory using mock fetch and Contracts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: defineEndpoint contracts, config, payload
 * outputs: reactive zustand stores, callable endpoint logic, URL encoding
 * rules: collision safe endpoint names; empty string -> null recursion; fetch state management isFetching/error/data
 *
 * @technical
 * dependencies: vitest, z, defineEndpoint, createClientApi
 * flow: mock global fetch; build contracts; instantiate client; call endpoint; verify HTTP calls and state updates
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-API-CLIENT-01 to TC-API-CLIENT-05
 * ultima prueba exitosa: 2026-04-08 12:56:00
 *
 * @notes
 * decisions: global.fetch is mocked directly with vi.fn to intercept call configurations
 */
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import * as z from 'zod';
import { defineEndpoint, collectContracts } from '../Contracts';
import { createClientApi } from '../ApiClient';

const mockSuccessResponse = z.object({ data: z.object({ id: z.string() }) });
const mockInput = z.object({ name: z.string().optional(), empty: z.string().nullable().optional() });

const testContract1 = defineEndpoint('public', 'POST /users/profile')
  .IO(mockInput, z.object({ id: z.string() }))
  .doc('T1', 'D1')
  .build();

const testContract2 = defineEndpoint('public', 'GET /users/profile')
  .IO(mockInput, z.object({ id: z.string() }))
  .doc('T2', 'D2')
  .build();

const testContract3 = defineEndpoint('public', 'DELETE /users/profile')
  .IO(z.void(), z.void())
  .doc('T3', 'D3')
  .build();

const contracts = collectContracts(testContract1, testContract2, testContract3);

const mockFetch = vi.fn();

describe('ApiClient', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('TC-API-CLIENT-01: crea API anidada por modulos y resuelve colisiones de acciones con el verbo', () => {
    const api = createClientApi(contracts, { baseURL: 'http://test' });
    
    // Resoluciones de colisión: 'profile', 'getProfile', 'deleteProfile'
    expect(typeof api.users.profile).toBe('function');
    expect(typeof api.users.getProfile).toBe('function');
    expect(typeof api.users.deleteProfile).toBe('function');
    expect(api.$modules).toContain('users');
  });

  it('TC-API-CLIENT-02: coerciona strings vacías a null y gestiona estado isFetching', async () => {
    const api = createClientApi(contracts, { baseURL: 'http://test' });
    
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ data: { id: 'usr-1' } }),
    });

    const endpoint = api.users.profile;
    expect(endpoint.isFetching).toBe(false);

    const promise = endpoint({ name: 'Victor', empty: '' });
    
    const result = await promise;

    expect(endpoint.isFetching).toBe(false);
    expect(result).toEqual({ data: { id: 'usr-1' } });

    const fetchCallInfo = mockFetch.mock.calls[0]?.[1];
    const sentBody = JSON.parse(fetchCallInfo.body);
    // '' coagula a null
    expect(sentBody.empty).toBeNull();
    expect(sentBody.name).toBe('Victor');
  });

  it('TC-API-CLIENT-03: verbos bodyless (GET/DELETE) construyen query string correctamente', async () => {
    const api = createClientApi(contracts, { baseURL: 'https://test' });
    
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ data: { id: 'usr-2' } }),
    });

    await api.users.getProfile({ name: 'Andrés' });

    const requestUrl = mockFetch.mock.calls[0]?.[0] as string;
    expect(requestUrl).toBe('https://test/users/profile?name=Andr%C3%A9s');
    expect(mockFetch.mock.calls[0]?.[1].body).toBeUndefined();
  });

  it('TC-API-CLIENT-04: manejar estado 204 No Content correctamente', async () => {
    const api = createClientApi(contracts, { baseURL: 'http://test' });
    
    mockFetch.mockResolvedValueOnce({
      status: 204,
    });

    const result = await api.users.deleteProfile(undefined);

    expect(result).toBeUndefined();
  });

  it('TC-API-CLIENT-05: manejar excepciones de fetch y propagar al $use store', async () => {
    const api = createClientApi(contracts, { baseURL: 'http://test' });
    
    const errorObj = new Error('Network fail');
    mockFetch.mockRejectedValueOnce(errorObj);

    await expect(api.users.profile({ name: 'Test' })).rejects.toThrow('Network fail');
    
    expect(api.users.profile.isFetching).toBe(false);
  });
});
