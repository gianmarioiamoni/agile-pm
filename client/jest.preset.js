export default {
    // set Jest to look for test files in the folder "__tests__" or in the folders ending with ".test.js"
    testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],

    // set Jest to use the React preset to configure tests for my React applecations
    preset: 'react',

    setupFilesAfterEnv: ['./src/setupTests.js'],
    transform: {}

    // other Jest options here...
};


