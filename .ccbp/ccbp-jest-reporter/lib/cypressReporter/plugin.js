"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const entry_1 = require("./entry");
function cypressReporter(on) {
    on("before:run", (details) => __awaiter(this, void 0, void 0, function* () {
        yield entry_1.beforeRunHook();
    }));
    on("after:run", (results) => __awaiter(this, void 0, void 0, function* () {
        yield entry_1.afterRunHook(results);
    }));
}
exports.default = cypressReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2N5cHJlc3NSZXBvcnRlci9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBc0Q7QUFFdEQsU0FBUyxlQUFlLENBQUMsRUFBRTtJQUN6QixFQUFFLENBQUMsWUFBWSxFQUFFLENBQU8sT0FBTyxFQUFFLEVBQUU7UUFDakMsTUFBTSxxQkFBYSxFQUFFLENBQUM7SUFDeEIsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBTyxPQUFPLEVBQUUsRUFBRTtRQUNoQyxNQUFNLG9CQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxrQkFBZSxlQUFlLENBQUMifQ==