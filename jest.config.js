const SuiteCloudJestConfiguration = require("@oracle/suitecloud-unit-testing/jest-configuration/SuiteCloudJestConfiguration");
const cliConfig = require("./suitecloud.config");

module.exports = {
	...SuiteCloudJestConfiguration.build({
		projectFolder: cliConfig.defaultProjectFolder,
		projectType: SuiteCloudJestConfiguration.ProjectType.SUITEAPP,
	}),
	// Measure coverage against the SuiteScript source deployed to NetSuite
	collectCoverageFrom: [
		"<rootDir>/src/FileCabinet/SuiteApps/**/*.js",
	],
	coverageThreshold: {
		global: {
			statements: 100,
			branches: 100,
			functions: 100,
			lines: 100,
		},
	},
};
