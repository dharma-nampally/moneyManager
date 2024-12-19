"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IO_1 = require("./IO");
const paths = [".results", ".results/results.html", ".results/results.json"];
const defaultJsonData = {
    test_case_results: [],
};
function resetResultsDirectory() {
    try {
        if (IO_1.IO.existsSync(paths[0])) {
            IO_1.IO.rmSync(paths[0], { recursive: true, force: true });
        }
        IO_1.IO.mkDirSync(paths[0]);
        IO_1.IO.writeFileSync(paths[1], "");
        IO_1.IO.writeFileSync(paths[2], JSON.stringify(defaultJsonData, null, 2));
    }
    catch (error) {
        console.error("Error resetting results directory:", error);
    }
}
resetResultsDirectory();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwb3J0ZXJQZXJxdWlzaXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9SZXBvcnRlclBlcnF1aXNpdGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTBCO0FBRzFCLE1BQU0sS0FBSyxHQUFHLENBQUMsVUFBVSxFQUFFLHVCQUF1QixFQUFFLHVCQUF1QixDQUFDLENBQUM7QUFHN0UsTUFBTSxlQUFlLEdBQUc7SUFDdEIsaUJBQWlCLEVBQUUsRUFBRTtDQUN0QixDQUFDO0FBR0YsU0FBUyxxQkFBcUI7SUFDNUIsSUFBSTtRQUVGLElBQUksT0FBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMzQixPQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7U0FDdkQ7UUFHRCxPQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBR3ZCLE9BQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRy9CLE9BQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3RFO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzVEO0FBQ0gsQ0FBQztBQUdELHFCQUFxQixFQUFFLENBQUMifQ==