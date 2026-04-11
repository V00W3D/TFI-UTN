// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GlobalProfileCard } from '../../../src/components/shared/GlobalProfileCard';

describe('GlobalProfileCard', () => {
  it('se renderiza correctamente un perfil de cliente', () => {
    const user: any = {
      name: 'Max',
      lname: 'Power',
      role: 'CUSTOMER',
      profile: { tier: 'VIP' },
    };
    render(<GlobalProfileCard user={user} className="test-card" />);
    
    expect(screen.getByText('Max Power')).toBeInTheDocument();
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });

  it('se renderiza correctamente un perfil de staff', () => {
    const user: any = {
      name: 'Anna',
      lname: 'Smith',
      role: 'STAFF',
      profile: { post: 'WAITER' },
    };
    render(<GlobalProfileCard user={user} className="test-card" />);
    
    expect(screen.getByText('Anna Smith')).toBeInTheDocument();
    expect(screen.getByText('WAITER')).toBeInTheDocument();
  });
});
