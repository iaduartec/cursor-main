// test setup: register additional matchers for DOM testing
// Make sure Vitest's expect is available globally before loading jest-dom
import { expect as vitestExpect, afterEach } from 'vitest';

// Ensure Vitest's expect is present on globalThis, then dynamically load
// @testing-library/jest-dom so it can call expect.extend safely.
(globalThis as any).expect = vitestExpect;

// Ensure React is available globally for modules compiled with the classic JSX runtime
import * as React from 'react';
(globalThis as any).React = React;

(async () => {
	try {
		// primary: import the package entry (it will call expect.extend internally)
		await import('@testing-library/jest-dom');
	} catch {
		// fallback: import the matchers module and extend manually
		try {
			const mod = await import('@testing-library/jest-dom/matchers');
			const matchers = (mod && (mod.default ?? mod));
			vitestExpect.extend(matchers as any);
		} catch {
			// if both fail, continue without jest-dom; tests may still run but matchers won't be available
			// Log to console for diagnostics.
			// eslint-disable-next-line no-console
			console.warn('Could not load @testing-library/jest-dom matchers');
		}
	}
})();

// Ensure DOM is cleaned between tests to avoid leftover elements
import { cleanup } from '@testing-library/react';
afterEach(() => {
	cleanup();
});
