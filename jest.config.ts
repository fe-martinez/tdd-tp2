
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    setupFiles: ['<rootDir>/setupTests.ts'], // Agrega esta línea
};


