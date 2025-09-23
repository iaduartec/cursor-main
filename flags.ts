import { flag } from 'flags/next';

export const exampleFlag = flag<boolean>({
    key: 'example-flag',
    defaultValue: false,
    description: 'An example feature flag',
});

export const newFeatureFlag = flag<boolean>({
    key: 'new-feature',
    defaultValue: false,
    description: 'Enable new feature rollout',
});

export const betaFeatureFlag = flag<boolean>({
    key: 'beta-feature',
    defaultValue: false,
    description: 'Beta feature for testing',
});