import clsx from 'clsx';

/**
 * Utility for conditional class name merging.
 * Centralized for project-wide consistency and AI safety.
 */
export const cn = (...inputs: any[]) => clsx(inputs);
