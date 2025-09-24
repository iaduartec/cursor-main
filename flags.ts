import { flag } from 'flags/next';

// Helper para crear flags booleanos con decide mínimo.
function booleanFlag(key: string, description: string, defaultValue = false) {
    return flag<boolean>({
        key,
        description,
        defaultValue,
        decide: () => defaultValue,
    });
}

export const exampleFlag = booleanFlag('example-flag', 'An example feature flag');
export const newFeatureFlag = booleanFlag('new-feature', 'Enable new feature rollout');
export const betaFeatureFlag = booleanFlag('beta-feature', 'Beta feature for testing');

export const flags = {
    exampleFlag,
    newFeatureFlag,
    betaFeatureFlag,
};

export type Flags = typeof flags;