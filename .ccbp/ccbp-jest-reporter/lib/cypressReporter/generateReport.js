"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IO_1 = require("../utils/IO");
const getEvaluationResultStatus = (status) => {
    switch (status) {
        case "passed":
            return "CORRECT";
        case "failed":
            return "INCORRECT";
        case "pending":
        default:
            return "INCORRECT";
    }
};
function generateReport(results) {
    var _a;
    const testCasesResults = [];
    if (results.runs && results.runs.length) {
        results.runs.forEach((eachRun) => {
            if (eachRun.tests && eachRun.tests.length) {
                eachRun.tests.forEach((eachTest) => {
                    const testCaseDescription = eachTest.title[1].split(":::");
                    const title = testCaseDescription[2];
                    const testCaseId = testCaseDescription[1];
                    const evaluationResult = eachTest.attempts.length > 0 ? eachTest.attempts[0].state : "";
                    const eachTestCaseResult = {
                        test_case_id: testCaseId,
                        evaluation_result: getEvaluationResultStatus(evaluationResult),
                        title,
                        errorMessages: [],
                    };
                    testCasesResults.push(eachTestCaseResult);
                });
            }
        });
    }
    const finalResults = {
        test_case_results: [],
    };
    if (IO_1.IO.existsSync(".results/results.json")) {
        let existingResults = IO_1.IO.readFileSync(".results/results.json");
        let existingTestCases = [];
        if (existingResults) {
            existingResults = JSON.parse(existingResults);
            existingTestCases = (_a = existingResults.test_case_results) !== null && _a !== void 0 ? _a : [];
            finalResults.test_case_results = [...existingTestCases];
        }
    }
    finalResults.test_case_results = [
        ...finalResults.test_case_results,
        ...testCasesResults,
    ];
    IO_1.IO.writeFileSync(".results/results.json", JSON.stringify(finalResults, null, 2));
}
exports.default = generateReport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVSZXBvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY3lwcmVzc1JlcG9ydGVyL2dlbmVyYXRlUmVwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQWlDO0FBRWpDLE1BQU0seUJBQXlCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRTtJQUMzQyxRQUFRLE1BQU0sRUFBRTtRQUNkLEtBQUssUUFBUTtZQUNYLE9BQU8sU0FBUyxDQUFDO1FBQ25CLEtBQUssUUFBUTtZQUNYLE9BQU8sV0FBVyxDQUFDO1FBQ3JCLEtBQUssU0FBUyxDQUFDO1FBQ2Y7WUFDRSxPQUFPLFdBQVcsQ0FBQztLQUN0QjtBQUNILENBQUMsQ0FBQztBQUVGLFNBQVMsY0FBYyxDQUFDLE9BQU87O0lBQzdCLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQzVCLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQy9CLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtnQkFDekMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFDakMsTUFBTSxtQkFBbUIsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDM0QsTUFBTSxLQUFLLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JDLE1BQU0sVUFBVSxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxNQUFNLGdCQUFnQixHQUNwQixRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQ2pFLE1BQU0sa0JBQWtCLEdBQUc7d0JBQ3pCLFlBQVksRUFBRSxVQUFVO3dCQUN4QixpQkFBaUIsRUFBRSx5QkFBeUIsQ0FBQyxnQkFBZ0IsQ0FBQzt3QkFDOUQsS0FBSzt3QkFDTCxhQUFhLEVBQUUsRUFBRTtxQkFDbEIsQ0FBQztvQkFDRixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDNUMsQ0FBQyxDQUFDLENBQUM7YUFDSjtRQUNILENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFFRCxNQUFNLFlBQVksR0FBRztRQUNuQixpQkFBaUIsRUFBRSxFQUFFO0tBQ3RCLENBQUM7SUFFRixJQUFJLE9BQUUsQ0FBQyxVQUFVLENBQUMsdUJBQXVCLENBQUMsRUFBRTtRQUMxQyxJQUFJLGVBQWUsR0FBUSxPQUFFLENBQUMsWUFBWSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDcEUsSUFBSSxpQkFBaUIsR0FBUSxFQUFFLENBQUM7UUFDaEMsSUFBSSxlQUFlLEVBQUU7WUFDbkIsZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDOUMsaUJBQWlCLEdBQUcsTUFBQSxlQUFlLENBQUMsaUJBQWlCLG1DQUFJLEVBQUUsQ0FBQztZQUM1RCxZQUFZLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLENBQUM7U0FDekQ7S0FDRjtJQUVELFlBQVksQ0FBQyxpQkFBaUIsR0FBRztRQUMvQixHQUFHLFlBQVksQ0FBQyxpQkFBaUI7UUFDakMsR0FBRyxnQkFBZ0I7S0FDcEIsQ0FBQztJQUVGLE9BQUUsQ0FBQyxhQUFhLENBQ2QsdUJBQXVCLEVBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FDdEMsQ0FBQztBQUNKLENBQUM7QUFFRCxrQkFBZSxjQUFjLENBQUMifQ==