"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Processor = void 0;
const _ = require("lodash");
const escapeHtml = require("escape-html");
const Constants_1 = require("./Constants");
const IO_1 = require("../utils/IO");
const path = require("path");
const Logger_1 = require("../utils/Logger");
const chalk = require("chalk");
const util_1 = require("util");
const Config_1 = require("./Config");
const ImageSnapshotDifference_1 = require("../render/diff/ImageSnapshotDifference");
class Processor {
  constructor(mResults, mExplicitConfig, mProcessParms) {
    this.mResults = mResults;
    this.mExplicitConfig = mExplicitConfig;
    this.mProcessParms = mProcessParms;
    this.testResultObject = (suiteName, testId, testDescription) => {
      return {
        ancestorTitles: [suiteName],
        duration: 0,
        failureDetails: [""],
        failureMessages: [""],
        fullName: suiteName + " " + testDescription,
        invocations: 1,
        location: null,
        numPassingAsserts: 0,
        status: "failed",
        title: testDescription,
        id: testId,
      };
    };
    this.getTestCasesFromTestFile = (testFilePath) => {
      const testFileContent = IO_1.IO.readFileSync(testFilePath);
      let splittedContent = testFileContent.split(":::");
      let testResults = [];
      let suiteName = "";
      let describeTitleMatch = testFileContent.match(/(?<=describe\()\".*?\"/);
      if (describeTitleMatch && Array.isArray(describeTitleMatch)) {
        suiteName = describeTitleMatch[0].split(":::")[2].replace(/\"+$/, "");
        let contentToBeRead = testFileContent.split(
          /(?<=describe\()[\",\'].*?[\",\']/
        )[1];
        do {
          const itTestDescription = contentToBeRead.match(/(?<=it\()\".*?\"/);
          const testDescription = contentToBeRead.match(/(?<=test\()\".*?\"/);
          let testId = "";
          let testDisplayText = "";
          if (testDescription) {
            testId = testDescription[0].split(":::")[1];
            testDisplayText = testDescription[0]
              .split(":::")[2]
              .replace(/\"+$/, "");
            contentToBeRead = contentToBeRead.split(testDescription[0])[1];
          } else if (itTestDescription) {
            testId = itTestDescription[0].split(":::")[1];
            testDisplayText = itTestDescription[0]
              .split(":::")[2]
              .replace(/\"+$/, "");
            contentToBeRead = contentToBeRead.split(itTestDescription[0])[1];
          } else {
            break;
          }
          const result = this.testResultObject(
            suiteName,
            testId,
            testDisplayText
          );
          testResults.push(result);
        } while (contentToBeRead);
      } else {
        describeTitleMatch = testFileContent.match(/(?<=describe\()\'.*?\'/);
        if (describeTitleMatch) {
          suiteName = describeTitleMatch[0].split(":::")[2].replace(/\'+$/, "");
          let contentToBeRead = testFileContent.split(
            /(?<=describe\()[\",\'].*?[\",\']/
          )[1];
          do {
            const itTestDescription = contentToBeRead.match(/(?<=it\()\'.*?\'/);
            const testDescription = contentToBeRead.match(/(?<=test\()\'.*?\'/);
            let testId = "";
            let testDisplayText = "";
            if (testDescription) {
              testId = testDescription[0].split(":::")[1];
              testDisplayText = testDescription[0]
                .split(":::")[2]
                .replace(/\'+$/, "");
              contentToBeRead = contentToBeRead.split(testDescription[0])[1];
            } else if (itTestDescription) {
              testId = itTestDescription[0].split(":::")[1];
              testDisplayText = itTestDescription[0]
                .split(":::")[2]
                .replace(/\'+$/, "");
              contentToBeRead = contentToBeRead.split(itTestDescription[0])[1];
            } else {
              break;
            }
            const result = this.testResultObject(
              suiteName,
              testId,
              testDisplayText
            );
            testResults.push(result);
          } while (contentToBeRead);
        }
      }
      return testResults;
    };
    this.getErrorMessageOnMatcherResult = (failureDetails) => {
      let errorMessage = "";
      if (
        failureDetails.matcherResult &&
        failureDetails.matcherResult.message &&
        typeof failureDetails.matcherResult.message === "function"
      ) {
        const matcherMessage = failureDetails.matcherResult.message();
        if (matcherMessage) {
          errorMessage = this.getErrorMessageOnMatcherResult(matcherMessage);
        }
      } else if (
        !failureDetails.matcherResult &&
        typeof failureDetails === "string"
      ) {
        const splittedErrorMessages = failureDetails.split("\n");
        if (splittedErrorMessages.length > 0) {
          errorMessage = this.getErrorMessageOnMatchToBe(splittedErrorMessages);
        }
      } else if (
        failureDetails.matcherResult &&
        failureDetails.matcherResult.message &&
        !failureDetails.matcherResult.expected &&
        !failureDetails.matcherResult.actual
      ) {
        if (typeof failureDetails.matcherResult.message === "function") {
          const matcherMessage = failureDetails.matcherResult.message();
          if (matcherMessage) {
            errorMessage = this.getErrorMessageOnMatcherResult(matcherMessage);
          }
        } else if (failureDetails.matcherResult.message) {
          const splittedErrorMessages =
            failureDetails.matcherResult.message.split("\n");
          if (splittedErrorMessages.length > 0) {
            errorMessage = this.getErrorMessageOnMatchToBe(
              splittedErrorMessages
            );
          }
        }
      } else {
        const readableMessage = `Expected "${failureDetails.matcherResult.expected}", but received "${failureDetails.matcherResult.actual}"`;
        errorMessage = readableMessage;
      }
      return errorMessage;
    };
    this.getErrorMessageOnMatchToBe = (splittedErrorMessages) => {
      let errorMessage = "";
      splittedErrorMessages.forEach((eachLine) => {
        if (
          eachLine.includes("Expected") ||
          eachLine.includes("Received") ||
          eachLine.includes("Number of calls")
        ) {
          errorMessage = errorMessage + "\n" + eachLine;
        }
      });
      return errorMessage.replace(/\x1B\[[0-9;]*m/g, "");
    };
    this.getErrorMessageFromFailureMessage = (failureMessages) => {
      let readableMessage = "";
      if (failureMessages && failureMessages.length > 0) {
        const errorMessage = failureMessages[0].split("\n")[0].trim();
        readableMessage = errorMessage.replace(/\x1B\[[0-9;]*m/g, "");
      }
      return readableMessage;
    };
  }
  static run(results, explicitConfig, parms) {
    return new Processor(results, explicitConfig, parms).generate();
  }
  getEvaluationResultStatus(status) {
    switch (status) {
      case "passed":
        return "CORRECT";
      case "failed":
        return "INCORRECT";
      case "pending":
      default:
        return "INCORRECT";
    }
  }
  generate() {
    var _a;
    const substitute = {};
    const substituteWithCustomData = {};
    if (util_1.isNullOrUndefined(this.mResults)) {
      throw new Error(Constants_1.Constants.NO_INPUT);
    }
    const config = new Config_1.Config(
      this.logger,
      this.mExplicitConfig,
      this.mProcessParms
    ).buildConfig();
    const results = this.mResults;
    results.testResults = results.testResults.map((eachSuite) => {
      if (eachSuite.testResults.length === 0) {
        eachSuite.testResults = this.getTestCasesFromTestFile(
          eachSuite.testFilePath
        );
        results.numFailedTests =
          results.numFailedTests + eachSuite.testResults.length;
        results.numTotalTests =
          results.numTotalTests + eachSuite.testResults.length;
        eachSuite.numFailingTests = eachSuite.testResults.length;
      } else {
        eachSuite.testResults = eachSuite.testResults.map((eachTest) => {
          if (!eachTest.id && eachTest.ancestorTitles && eachTest.fullName) {
            const ancestorTitles = eachTest.ancestorTitles.map(
              (eachAncestorTitle) => eachAncestorTitle.split(":::")[2]
            );
            const idAndTitle = eachTest.title.split(":::");
            const fullName = ancestorTitles.join(" ").concat(idAndTitle[2]);
            let errorMessages = [];
            if (
              eachTest.failureDetails &&
              eachTest.failureDetails.length > 0 &&
              eachTest.failureDetails[0].actual &&
              eachTest.failureDetails[0].expected &&
              !eachTest.failureDetails[0].pass
            ) {
              const readableMessage = `Expected ${eachTest.failureDetails[0].expected}, but received ${eachTest.failureDetails[0].actual}`;
              errorMessages.push(readableMessage);
            } else if (
              eachTest.failureDetails &&
              eachTest.failureDetails.length > 0
            ) {
              let haveMatcherResult = false;
              eachTest.failureDetails.forEach((eachFailureDetails) => {
                if (eachFailureDetails.matcherResult) {
                  haveMatcherResult = true;
                  const readableMessage =
                    this.getErrorMessageOnMatcherResult(eachFailureDetails);
                  if (readableMessage) {
                    errorMessages.push(readableMessage);
                  }
                }
              });
              if (!haveMatcherResult) {
                const errorMessage = this.getErrorMessageFromFailureMessage(
                  eachTest.failureMessages
                );
                if (errorMessage) {
                  errorMessages.push(errorMessage);
                }
              }
            } else {
              const errorMessage = this.getErrorMessageFromFailureMessage(
                eachTest.failureMessages
              );
              if (errorMessage) {
                errorMessages.push(errorMessage);
              }
            }
            eachTest.id = idAndTitle[1];
            eachTest.title = idAndTitle[2];
            eachTest.ancestorTitles = ancestorTitles;
            eachTest.fullName = fullName;
            eachTest.errorMessages = errorMessages;
          }
          return eachTest;
        });
      }
      return eachSuite;
    });
    const customConfigResults = results.testResults.map((eachTestSuite) => {
      return eachTestSuite.testResults.map((eachTest) => {
        return {
          test_case_id: eachTest.id,
          evaluation_result: this.getEvaluationResultStatus(eachTest.status),
          title: eachTest.title,
          errorMessages: eachTest.errorMessages,
        };
      });
    });
    const flattenedResults = _.flatten(customConfigResults);
    substitute.results = results;
    substitute.rawResults = JSON.stringify(results, null, 2);
    substitute.jestStareConfig = config;
    substitute.rawJestStareConfig = JSON.stringify(config, null, 2);
    const resultsData = {
      test_case_results: [],
    };
    if (
      IO_1.IO.existsSync(
        config.resultDir + substitute.jestStareConfig.resultJson
      )
    ) {
      let existingResults = IO_1.IO.readFileSync(
        config.resultDir + substitute.jestStareConfig.resultJson
      );
      let existingTestCases = [];
      if (existingResults) {
        existingResults = JSON.parse(existingResults);
        existingTestCases =
          (_a = existingResults.test_case_results) !== null && _a !== void 0
            ? _a
            : [];
        resultsData.test_case_results = [...existingTestCases];
      }
    }
    resultsData.test_case_results = [
      ...resultsData.test_case_results,
      ...flattenedResults,
    ];
    substituteWithCustomData.results = resultsData;
    substituteWithCustomData.rawResults = JSON.stringify(resultsData, null, 2);
    substituteWithCustomData.jestStareConfig = config;
    substituteWithCustomData.rawJestStareConfig = JSON.stringify(
      config,
      null,
      2
    );
    if (this.mProcessParms && this.mProcessParms.reporter) {
      this.mProcessParms.reporter.jestStareConfig = config;
      substitute.globalConfig = JSON.stringify(
        this.mProcessParms.reporter.mGlobalConfig,
        null,
        2
      );
    }
    this.generateReport(
      config.resultDir,
      substitute,
      this.mProcessParms,
      substituteWithCustomData
    );
    this.collectImageSnapshots(config.resultDir, this.mResults);
    if (config.additionalResultsProcessors != null) {
      this.execute(this.mResults, config.additionalResultsProcessors);
    }
    return this.mResults;
  }
  collectImageSnapshots(resultDir, results) {
    results.testResults.forEach((rootResult) => {
      if (rootResult.numFailingTests) {
        rootResult.testResults.forEach((testResult) => {
          testResult.failureMessages.forEach((failureMessage) => {
            if (
              typeof failureMessage === "string" &&
              ImageSnapshotDifference_1.ImageSnapshotDifference.containsDiff(
                failureMessage
              )
            ) {
              const diffImagePath =
                ImageSnapshotDifference_1.ImageSnapshotDifference.parseDiffImagePath(
                  failureMessage
                );
              const diffImageName =
                ImageSnapshotDifference_1.ImageSnapshotDifference.parseDiffImageName(
                  failureMessage
                );
              if (IO_1.IO.existsSync(diffImagePath)) {
                IO_1.IO.mkdirsSync(
                  resultDir + Constants_1.Constants.IMAGE_SNAPSHOT_DIFF_DIR
                );
                const reportDiffImagePath =
                  resultDir +
                  Constants_1.Constants.IMAGE_SNAPSHOT_DIFF_DIR +
                  diffImageName;
                IO_1.IO.copyFileSync(diffImagePath, reportDiffImagePath);
              }
            }
          });
        });
      }
    });
  }
  e(str) {
    return escapeHtml(str).replace(/&#39/g, "&#x27");
  }
  createBaseHtml(substitute) {
    const head = `<head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>ccbp test reporter</title>
            <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
            <link rel="preconnect" href="https://fonts.gstatic.com">
	        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
            <script src="https://kit.fontawesome.com/522ee478c4.js" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/2.3.0/alpine.js"></script>
            <script src="js/view.js"></script>
        </head>`;
    const body = `<body><div id="test-results">${this.e(
      substitute.rawResults
    )}</div></body>`;
    const html = `<html lang="en">${head}${body}</html>`;
    return html;
  }
  generateReport(resultDir, substitute, parms, substituteWithCustomData) {
    IO_1.IO.mkdirsSync(resultDir);
    const jsDir = resultDir + Constants_1.Constants.JS_DIR;
    IO_1.IO.mkdirsSync(jsDir);
    IO_1.IO.writeFileSync(
      jsDir + Constants_1.Constants.JEST_STARE_JS,
      this.obtainJsRenderFile(Constants_1.Constants.JEST_STARE_JS)
    );
    IO_1.IO.writeFileSync(
      resultDir + substitute.jestStareConfig.resultHtml,
      this.createBaseHtml(substitute)
    );
    IO_1.IO.writeFileSync(
      resultDir + substitute.jestStareConfig.resultJson,
      substituteWithCustomData.rawResults
    );
    let type = " ";
    type +=
      parms && parms.reporter
        ? Constants_1.Constants.REPORTERS
        : Constants_1.Constants.TEST_RESULTS_PROCESSOR;
    this.logger.info(
      Constants_1.Constants.LOGO +
        type +
        Constants_1.Constants.LOG_MESSAGE +
        resultDir +
        substitute.jestStareConfig.resultHtml +
        Constants_1.Constants.SUFFIX
    );
  }
  execute(jestTestData, processors) {
    for (const processor of processors) {
      if (processor === Constants_1.Constants.NAME) {
        this.logger.error(
          "Error: In order to avoid infinite loops, " +
            "jest-stare cannot be listed as an additional processor. Skipping... "
        );
        continue;
      }
      try {
        require(processor)(jestTestData);
        this.logger.info(
          Constants_1.Constants.LOGO +
            " passed results to additional processor " +
            chalk.white('"' + processor + '"') +
            Constants_1.Constants.SUFFIX
        );
      } catch (e) {
        this.logger.error(
          'Error executing additional processor: "' + processor + '" ' + e
        );
      }
    }
  }
  addThirdParty(dependency) {
    return __awaiter(this, void 0, void 0, function* () {
      const location = require.resolve(dependency.requireDir + dependency.file);
      yield IO_1.IO.writeFileSync(
        dependency.targetDir + dependency.file,
        IO_1.IO.readFileSync(location)
      );
    });
  }
  obtainWebFile(name) {
    return IO_1.IO.readFileSync(path.resolve(__dirname + "/../../web/" + name));
  }
  obtainJsRenderFile(name) {
    return IO_1.IO.readFileSync(path.resolve(__dirname + "/../render/" + name));
  }
  set logger(logger) {
    this.mLog = logger;
  }
  get logger() {
    if (util_1.isNullOrUndefined(this.mLog)) {
      this.logger = new Logger_1.Logger();
    }
    return this.mLog;
  }
}
exports.Processor = Processor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Byb2Nlc3Nvci9Qcm9jZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVCLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxQywyQ0FBd0M7QUFFeEMsb0NBQWlDO0FBRWpDLDZCQUE2QjtBQUU3Qiw0Q0FBeUM7QUFDekMsK0JBQStCO0FBRy9CLCtCQUF5QztBQUV6QyxxQ0FBa0M7QUFDbEMsb0ZBQWlGO0FBU2pGLE1BQWEsU0FBUztJQWtDcEIsWUFDVSxRQUEwQixFQUMxQixlQUFrQyxFQUNsQyxhQUE2QjtRQUY3QixhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQUMxQixvQkFBZSxHQUFmLGVBQWUsQ0FBbUI7UUFDbEMsa0JBQWEsR0FBYixhQUFhLENBQWdCO1FBZXZDLHFCQUFnQixHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsRUFBRTtZQUN4RCxPQUFPO2dCQUNMLGNBQWMsRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDM0IsUUFBUSxFQUFFLENBQUM7Z0JBQ1gsY0FBYyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNwQixlQUFlLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3JCLFFBQVEsRUFBRSxTQUFTLEdBQUcsR0FBRyxHQUFHLGVBQWU7Z0JBQzNDLFdBQVcsRUFBRSxDQUFDO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLGlCQUFpQixFQUFFLENBQUM7Z0JBQ3BCLE1BQU0sRUFBRSxRQUFRO2dCQUNoQixLQUFLLEVBQUUsZUFBZTtnQkFDdEIsRUFBRSxFQUFFLE1BQU07YUFDWCxDQUFDO1FBQ0osQ0FBQyxDQUFDO1FBRUYsNkJBQXdCLEdBQUcsQ0FBQyxZQUFZLEVBQUUsRUFBRTtZQUMxQyxNQUFN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
