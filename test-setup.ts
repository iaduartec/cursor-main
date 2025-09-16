// test setup: register additional matchers for DOM testing
/* eslint-disable @typescript-eslint/no-explicit-any */
// Note: the dynamic import below may reference declaration-merged matchers
// from '@testing-library/jest-dom' which are not exported as a module type.
// Use a targeted ts-ignore on the import to avoid TS2306 while keeping the
// rest of this file type-checked.
// Make sure Vitest's expect is available globally before loading jest-dom
import { expect as vitestExpect, afterEach } from 'vitest';

// Ensure Vitest's expect is present on globalThis, then dynamically load
// @testing-library/jest-dom so it can call expect.extend safely.
// Expose Vitest's expect globally for libraries that augment it (jest-dom)
(globalThis as unknown as { expect?: typeof vitestExpect }).expect = vitestExpect;

// Ensure React is available globally for modules compiled with the classic JSX runtime
import * as React from 'react';
// Expose React globally for modules compiled with the classic JSX runtime
(globalThis as unknown as { React?: typeof React }).React = React;

(async () => {
	try {
		// primary: import the package entry (it will call expect.extend internally)
		// @ts-expect-error TS2306: jest-dom provides declaration merging matchers, not a module
		await import('@testing-library/jest-dom');
	} catch {
		// fallback: import the matchers module and extend manually
		try {
			const mod = await import('@testing-library/jest-dom/matchers');
			const matchers = (mod && (mod.default ?? mod));
			// matchers may be an object of matcher functions; cast to unknown then to Record of functions
			vitestExpect.extend(matchers as unknown as Record<string, (...args: any[]) => any>);
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
