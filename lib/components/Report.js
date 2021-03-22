"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const react_1 = __importDefault(require("react"));
const jsonschema_1 = require("jsonschema");
const spec_json_1 = __importDefault(require("../spec.json"));
const spec_json_2 = __importDefault(require("../profiles/spec.json"));
const report_json_1 = __importDefault(require("../profiles/report.json"));
const helpers_1 = require("../helpers");
const Table_1 = require("./Table");
function Report(props) {
    const { report, spec, skipHeaderIndex = false } = props;
    // Invalid report
    const reportValidation = validateReport(report);
    if (!reportValidation.valid) {
        return (react_1.default.createElement("div", { className: "goodtables-ui-report" },
            react_1.default.createElement("h5", null,
                react_1.default.createElement("strong", null, "Invalid report")),
            react_1.default.createElement("hr", null),
            react_1.default.createElement("div", { style: { whiteSpace: 'pre', fontFamily: 'courier' } }, JSON.stringify(reportValidation.errors, null, 2)),
            react_1.default.createElement("hr", null),
            react_1.default.createElement("div", { style: { whiteSpace: 'pre', fontFamily: 'courier' } }, JSON.stringify(report, null, 2))));
    }
    // Invalid spec
    const specValidation = validateSpec(spec || spec_json_1.default);
    if (!specValidation.valid) {
        return (react_1.default.createElement("div", { className: "goodtables-ui-report" },
            react_1.default.createElement("h5", null,
                react_1.default.createElement("strong", null, "Invalid spec")),
            react_1.default.createElement("hr", null),
            react_1.default.createElement("div", { style: { whiteSpace: 'pre', fontFamily: 'courier' } }, JSON.stringify(specValidation.errors, null, 2)),
            react_1.default.createElement("hr", null),
            react_1.default.createElement("div", { style: { whiteSpace: 'pre', fontFamily: 'courier' } }, JSON.stringify(spec, null, 2))));
    }
    // Valid report/spec
    const processedWarnings = getProcessedWarnings(report);
    const tables = getTables(report);
    return (react_1.default.createElement("div", { className: "goodtables-ui-report" },
        !!processedWarnings.length && (react_1.default.createElement("div", { className: "file warning" },
            react_1.default.createElement("h4", { className: "file-heading" },
                react_1.default.createElement("div", { className: "inner" },
                    react_1.default.createElement("a", { className: "file-name" },
                        react_1.default.createElement("strong", null, "Warnings")))),
            react_1.default.createElement("ul", { className: "passed-tests result" }, processedWarnings.map((warning, index) => (react_1.default.createElement("li", { key: index },
                react_1.default.createElement("span", { className: "badge badge-warning" }, warning))))))),
        tables.map((table, index) => (react_1.default.createElement(Table_1.Table, { key: table.source, table: table, tableNumber: index + 1, tablesCount: tables.length, spec: spec || spec_json_1.default, skipHeaderIndex: skipHeaderIndex })))));
}
exports.Report = Report;
// Helpers
function validateReport(report) {
    return jsonschema_1.validate(report, report_json_1.default);
}
function validateSpec(spec) {
    return jsonschema_1.validate(spec, spec_json_2.default);
}
function getProcessedWarnings(report) {
    // Before `goodtables@1.0` there was no warnings property
    return (report.warnings || []).map((warning) => helpers_1.removeBaseUrl(warning));
}
function getTables(report) {
    return [
        ...report.tables.filter((table) => !table.valid),
        ...report.tables.filter((table) => table.valid),
    ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbXBvbmVudHMvUmVwb3J0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBeUI7QUFDekIsMkNBQXFDO0FBQ3JDLDZEQUFzQztBQUN0QyxzRUFBK0M7QUFDL0MsMEVBQW1EO0FBQ25ELHdDQUEwQztBQUUxQyxtQ0FBK0I7QUFRL0IsU0FBZ0IsTUFBTSxDQUFDLEtBQW1CO0lBQ3hDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLGVBQWUsR0FBRyxLQUFLLEVBQUUsR0FBRyxLQUFLLENBQUE7SUFFdkQsaUJBQWlCO0lBQ2pCLE1BQU0sZ0JBQWdCLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQy9DLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUU7UUFDM0IsT0FBTyxDQUNMLHVDQUFLLFNBQVMsRUFBQyxzQkFBc0I7WUFDbkM7Z0JBQ0UsK0RBQStCLENBQzVCO1lBQ0wseUNBQU07WUFDTix1Q0FBSyxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsSUFDckQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUM3QztZQUNOLHlDQUFNO1lBQ04sdUNBQUssS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLElBQ3JELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FDNUIsQ0FDRixDQUNQLENBQUE7S0FDRjtJQUVELGVBQWU7SUFDZixNQUFNLGNBQWMsR0FBRyxZQUFZLENBQUMsSUFBSSxJQUFJLG1CQUFXLENBQUMsQ0FBQTtJQUN4RCxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtRQUN6QixPQUFPLENB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bXBvcnQgeyB2YWxpZGF0ZSB9IGZyb20gJ2pzb25zY2hlbWEnXG5pbXBvcnQgZGVmYXVsdFNwZWMgZnJvbSAnLi4vc3BlYy5qc29uJ1xuaW1wb3J0IHByb2ZpbGVTcGVjIGZyb20gJy4uL3Byb2ZpbGVzL3NwZWMuanNvbidcbmltcG9ydCBwcm9maWxlUmVwb3J0IGZyb20gJy4uL3Byb2ZpbGVzL3JlcG9ydC5qc29uJ1xuaW1wb3J0IHsgcmVtb3ZlQmFzZVVybCB9IGZyb20gJy4uL2hlbHBlcnMnXG5pbXBvcnQgeyBJUmVwb3J0LCBJU3BlYyB9IGZyb20gJy4uL2NvbW1vbidcbmltcG9ydCB7IFRhYmxlIH0gZnJvbSAnLi9UYWJsZSdcblxuZXhwb3J0IGludGVyZmFjZSBJUmVwb3J0UHJvcHMge1xuICByZXBvcnQ6IElSZXBvcnRcbiAgc3BlYz86IElTcGVjXG4gIHNraXBIZWFkZXJJbmRleD86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlcG9ydChwcm9wczogSVJlcG9ydFByb3BzKSB7XG4gIGNvbnN0IHsgcmVwb3J0LCBzcGVjLCBza2lwSGVhZGVySW5kZXggPSBmYWxzZSB9ID0gcHJvcHNcblxuICAvLyBJbnZhbGlkIHJlcG9ydFxuICBjb25zdCByZXBvcnRWYWxpZGF0aW9uID0gdmFsaWRhdGVSZXBvcnQocmVwb3J0KVxuICBpZiAoIXJlcG9ydFZhbGlkYXRpb24udmFsaWQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnb29kdGFibGVzLXVpLXJlcG9ydFwiPlxuICAgICAgICA8aDU+XG4gICAgICAgICAgPHN0cm9uZz5JbnZhbGlkIHJlcG9ydDwvc3Ryb25nPlxuICAgICAgICA8L2g1PlxuICAgICAgICA8aHIgLz5cbiAgICAgICAgPGRpdiBzdHlsZT17eyB3aGl0ZVNwYWNlOiAncHJlJywgZm9udEZhbWlseTogJ2NvdXJpZXInIH19PlxuICAgICAgICAgIHtKU09OLnN0cmluZ2lmeShyZXBvcnRWYWxpZGF0aW9uLmVycm9ycywgbnVsbCwgMil9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8aHIgLz5cbiAgICAgICAgPGRpdiBzdHlsZT17eyB3aGl0ZVNwYWNlOiAncHJlJywgZm9udEZhbWlseTogJ2NvdXJpZXInIH19PlxuICAgICAgICAgIHtKU09OLnN0cmluZ2lmeShyZXBvcnQsIG51bGwsIDIpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIC8vIEludmFsaWQgc3BlY1xuICBjb25zdCBzcGVjVmFsaWRhdGlvbiA9IHZhbGlkYXRlU3BlYyhzcGVjIHx8IGRlZmF1bHRTcGVjKVxuICBpZiAoIXNwZWNWYWxpZGF0aW9uLnZhbGlkKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ29vZHRhYmxlcy11aS1yZXBvcnRcIj5cbiAgICAgICAgPGg1PlxuICAgICAgICAgIDxzdHJvbmc+SW52YWxpZCBzcGVjPC9zdHJvbmc+XG4gICAgICAgIDwvaDU+XG4gICAgICAgIDxociAvPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHdoaXRlU3BhY2U6ICdwcmUnLCBmb250RmFtaWx5OiAnY291cmllcicgfX0+XG4gICAgICAgICAge0pTT04uc3RyaW5naWZ5KHNwZWNWYWxpZGF0aW9uLmVycm9ycywgbnVsbCwgMil9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8aHIgLz5cbiAgICAgICAgPGRpdiBzdHlsZT17eyB3aGl0ZVNwYWNlOiAncHJlJywgZm9udEZhbWlseTogJ2NvdXJpZXInIH19PlxuICAgICAgICAgIHtKU09OLnN0cmluZ2lmeShzcGVjLCBudWxsLCAyKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICAvLyBWYWxpZCByZXBvcnQvc3BlY1xuICBjb25zdCBwcm9jZXNzZWRXYXJuaW5ncyA9IGdldFByb2Nlc3NlZFdhcm5pbmdzKHJlcG9ydClcbiAgY29uc3QgdGFibGVzID0gZ2V0VGFibGVzKHJlcG9ydClcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdvb2R0YWJsZXMtdWktcmVwb3J0XCI+XG4gICAgICB7LyogV2FybmluZ3MgKi99XG4gICAgICB7ISFwcm9jZXNzZWRXYXJuaW5ncy5sZW5ndGggJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbGUgd2FybmluZ1wiPlxuICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJmaWxlLWhlYWRpbmdcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5uZXJcIj5cbiAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZmlsZS1uYW1lXCI+XG4gICAgICAgICAgICAgICAgPHN0cm9uZz5XYXJuaW5nczwvc3Ryb25nPlxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2g0PlxuICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJwYXNzZWQtdGVzdHMgcmVzdWx0XCI+XG4gICAgICAgICAgICB7cHJvY2Vzc2VkV2FybmluZ3MubWFwKCh3YXJuaW5nLCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgICA8bGkga2V5PXtpbmRleH0+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYmFkZ2UgYmFkZ2Utd2FybmluZ1wiPnt3YXJuaW5nfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgey8qIFRhYmxlcyAqL31cbiAgICAgIHt0YWJsZXMubWFwKCh0YWJsZSwgaW5kZXgpID0+IChcbiAgICAgICAgPFRhYmxlXG4gICAgICAgICAga2V5PXt0YWJsZS5zb3VyY2V9XG4gICAgICAgICAgdGFibGU9e3RhYmxlfVxuICAgICAgICAgIHRhYmxlTnVtYmVyPXtpbmRleCArIDF9XG4gICAgICAgICAgdGFibGVzQ291bnQ9e3RhYmxlcy5sZW5ndGh9XG4gICAgICAgICAgc3BlYz17c3BlYyB8fCBkZWZhdWx0U3BlY31cbiAgICAgICAgICBza2lwSGVhZGVySW5kZXg9e3NraXBIZWFkZXJJbmRleH1cbiAgICAgICAgLz5cbiAgICAgICkpfVxuICAgIDwvZGl2PlxuICApXG59XG5cbi8vIEhlbHBlcnNcblxuZnVuY3Rpb24gdmFsaWRhdGVSZXBvcnQocmVwb3J0OiBJUmVwb3J0KSB7XG4gIHJldHVybiB2YWxpZGF0ZShyZXBvcnQsIHByb2ZpbGVSZXBvcnQpXG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlU3BlYyhzcGVjOiBJU3BlYykge1xuICByZXR1cm4gdmFsaWRhdGUoc3BlYywgcHJvZmlsZVNwZWMpXG59XG5cbmZ1bmN0aW9uIGdldFByb2Nlc3NlZFdhcm5pbmdzKHJlcG9ydDogSVJlcG9ydCkge1xuICAvLyBCZWZvcmUgYGdvb2R0YWJsZXNAMS4wYCB0aGVyZSB3YXMgbm8gd2FybmluZ3MgcHJvcGVydHlcbiAgcmV0dXJuIChyZXBvcnQud2FybmluZ3MgfHwgW10pLm1hcCgod2FybmluZykgPT4gcmVtb3ZlQmFzZVVybCh3YXJuaW5nKSlcbn1cblxuZnVuY3Rpb24gZ2V0VGFibGVzKHJlcG9ydDogSVJlcG9ydCkge1xuICByZXR1cm4gW1xuICAgIC4uLnJlcG9ydC50YWJsZXMuZmlsdGVyKCh0YWJsZSkgPT4gIXRhYmxlLnZhbGlkKSxcbiAgICAuLi5yZXBvcnQudGFibGVzLmZpbHRlcigodGFibGUpID0+IHRhYmxlLnZhbGlkKSxcbiAgXVxufVxuIl19