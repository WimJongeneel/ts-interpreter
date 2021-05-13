module.exports = {
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "__tests__\/(?!utils)",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverageFrom: ['src/*'],
    collectCoverage: true,
    verbose: true
};