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
exports.beforeRunHook = exports.afterRunHook = void 0;
const generateReport_1 = require("./generateReport");
function beforeRunHook() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.beforeRunHook = beforeRunHook;
function afterRunHook(results) {
    return __awaiter(this, void 0, void 0, function* () {
        generateReport_1.default(results);
    });
}
exports.afterRunHook = afterRunHook;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY3lwcmVzc1JlcG9ydGVyL2VudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHFEQUE4QztBQUU5QyxTQUFlLGFBQWE7O0lBRTVCLENBQUM7Q0FBQTtBQU1zQixzQ0FBYTtBQUpwQyxTQUFlLFlBQVksQ0FBQyxPQUFPOztRQUNqQyx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFCLENBQUM7Q0FBQTtBQUVRLG9DQUFZIn0=