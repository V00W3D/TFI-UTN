// @vitest-environment jsdom
/**
 * @file Contact.test.tsx
 * @module Landing/Tests
 * @description Unit tests for Contact (footer) section component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: none (static presentation)
 * outputs: footer with contact and social information
 * rules: show social links; show address; show hours; show legal links
 *
 * @technical
 * dependencies: @testing-library/react, vitest
 * flow: render -> verify branding -> verify address -> verify hours -> verify social links
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-CONTACT-01
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Contact from '../../../src/modules/Landing/components/Contact';

// Mock icons
vi.mock('../../../src/components/shared/AppIcons', () => ({
  ClockIcon: () => <div data-testid="clock-icon" />,
  FacebookIcon: () => <div data-testid="fb-icon" />,
  InstagramIcon: () => <div data-testid="ig-icon" />,
  MapPinIcon: () => <div data-testid="map-icon" />,
  TikTokIcon: () => <div data-testid="tt-icon" />,
  WhatsAppIcon: () => <div data-testid="wa-icon" />,
}));

describe('Contact', () => {
  it('TC-FE-CONTACT-01: renderiza toda la información de contacto correctamente', () => {
    render(<Contact />);

    // Branding
    expect(screen.getByText('QART.')).toBeInTheDocument();
    
    // Address
    expect(screen.getByText(/Rivadavia 1050/i)).toBeInTheDocument();
    // Using loose regex to avoid encoding issues with accents in test runners
    expect(screen.getByText(/San Miguel de Tucum/i)).toBeInTheDocument();
    
    // Hours
    expect(screen.getByText(/Lunes a jueves: 12:00 a 23:00/i)).toBeInTheDocument();
    expect(screen.getByText(/ABIERTO/i)).toBeInTheDocument();
    
    // Social Links
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('TikTok')).toBeInTheDocument();
    expect(screen.getByLabelText('WhatsApp')).toBeInTheDocument();
    
    // Legal Links
    expect(screen.getByText(/Términos de uso/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacidad/i)).toBeInTheDocument();
  });
});
