import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Vite PWA virtual module
vi.mock('virtual:pwa-register', () => ({
    registerSW: vi.fn(),
}));

