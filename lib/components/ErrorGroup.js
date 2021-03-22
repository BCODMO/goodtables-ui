"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorGroup = void 0;
const marked_1 = __importDefault(require("marked"));
const classnames_1 = __importDefault(require("classnames"));
const hex_to_rgba_1 = __importDefault(require("hex-to-rgba"));
const react_1 = __importStar(require("react"));
const startCase_1 = __importDefault(require("lodash/startCase"));
const spec_json_1 = __importDefault(require("../spec.json"));
function ErrorGroup(props) {
    const { errorGroup, spec, skipHeaderIndex } = props;
    const [isDetailsVisible, setIsDetailsVisible] = react_1.useState(false);
    const [visibleRowsCount, setVisibleRowsCount] = react_1.useState(10);
    const specError = getSpecError(errorGroup, spec || spec_json_1.default);
    const isHeadersVisible = getIsHeadersVisible(specError);
    const description = getDescription(specError);
    const rowNumbers = getRowNumbers(errorGroup);
    return (react_1.default.createElement("div", { className: "result" },
        react_1.default.createElement("div", { className: "d-flex align-items-center" },
            react_1.default.createElement("span", { className: "count" },
                errorGroup.count,
                " x"),
            react_1.default.createElement("a", { role: "button", className: classnames_1.default({
                    badge: true,
                    'badge-error': true,
                    collapsed: !isDetailsVisible,
                }), "data-toggle": "collapse", onClick: () => setIsDetailsVisible(!isDetailsVisible), "aria-expanded": "false", style: { backgroundColor: getRgbaColor(specError) } }, specError.name)),
        react_1.default.createElement("div", { className: classnames_1.default(['collapse', { show: isDetailsVisible }]) },
            react_1.default.createElement("div", { className: "error-details", style: { borderColor: getRgbaColor(specError) } },
                description && (react_1.default.createElement("div", { className: "error-description" },
                    react_1.default.createElement("div", { dangerouslySetInnerHTML: { __html: description } }))),
                react_1.default.createElement("div", { className: "error-list", style: { borderTopColor: getRgbaColor(specError) } },
                    react_1.default.createElement("p", { className: "error-list-heading", style: {
                            backgroundColor: getRgbaColor(specError, 0.1),
                            borderBottomColor: getRgbaColor(specError, 0.25),
                        } }, "The full list of error messages:"),
                    react_1.default.createElement("ul", { style: {
                            backgroundColor: getRgbaColor(specError, 0.05),
                        } }, errorGroup.messages.map((message, index) => (react_1.default.createElement("li", { key: index }, message))))))),
        !['source-error'].includes(errorGroup.code) && (react_1.default.createElement("div", { className: "table-view" },
            react_1.default.createElement("div", { className: "inner" },
                react_1.default.createElement(ErrorGroupTable, { specError: specError, errorGroup: errorGroup, visibleRowsCount: visibleRowsCount, rowNumbers: rowNumbers, isHeadersVisible: isHeadersVisible, skipHeaderIndex: skipHeaderIndex })))),
        visibleRowsCount < rowNumbers.length && (react_1.default.createElement("a", { className: "show-more", onClick: () => setVisibleRowsCount(visibleRowsCount + 10) },
            "Show more ",
            react_1.default.createElement("span", { className: "icon-keyboard_arrow_down" })))));
}
exports.ErrorGroup = ErrorGroup;
function ErrorGroupTable(props) {
    const { specError, errorGroup, visibleRowsCount, rowNumbers, isHeadersVisible, skipHeaderIndex, } = props;
    return (react_1.default.createElement("table", { className: "table table-sm" },
        react_1.default.createElement("tbody", null,
            errorGroup.headers && isHeadersVisible && (react_1.default.createElement("tr", { className: "before-fail" },
                react_1.default.createElement("td", { className: "text-center" }, skipHeaderIndex ? '' : '1'),
                errorGroup.headers.map((header, index) => (react_1.default.createElement("td", { key: index }, header))))),
            rowNumbers.map((rowNumber, index) => index < visibleRowsCount && (react_1.default.createElement("tr", { key: index, className: classnames_1.default({ fail: errorGroup.code.includes('row') }) },
                react_1.default.createElement("td", { style: { backgroundColor: getRgbaColor(specError, 0.25) }, className: "result-row-index" }, rowNumber || (skipHeaderIndex ? '' : 1)),
                errorGroup.rows[rowNumber].values.map((value, innerIndex) => (react_1.default.createElement("td", { key: innerIndex, style: { backgroundColor: getRgbaColor(specError, 0.25) }, className: classnames_1.default({
                        fail: errorGroup.rows[rowNumber].badcols.has(innerIndex + 1),
                    }) }, value)))))),
            react_1.default.createElement("tr", { className: "after-fail" },
                react_1.default.createElement("td", { className: "result-row-index" }, rowNumbers[rowNumbers.length - 1] ? rowNumbers[rowNumbers.length - 1] + 1 : 2),
                errorGroup.headers && errorGroup.headers.map((_header, index) => react_1.default.createElement("td", { key: index }))))));
}
// Helpers
function getSpecError(errorGroup, spec) {
    // Get code handling legacy codes
    let code = errorGroup.code;
    if (code === 'non-castable-value') {
        code = 'type-or-format-error';
    }
    // Get details handling custom errors
    let details = spec.errors[code];
    if (!details) {
        details = {
            name: startCase_1.default(code),
            type: 'custom',
            context: 'body',
            message: 'custom',
            description: '',
            weight: 0,
        };
    }
    return details;
}
function getRgbaColor(specError, alpha = 1) {
    return specError.hexColor ? hex_to_rgba_1.default(specError.hexColor, alpha) : undefined;
}
function getIsHeadersVisible(specError) {
    return specError.context === 'body';
}
function getDescription(specError) {
    let description = specError.description;
    if (description) {
        description = description.replace('{validator}', '`goodtables.yml`');
        description = marked_1.default(description);
    }
    return description;
}
function getRowNumbers(errorGroup) {
    return Object.keys(errorGroup.rows)
        .map((item) => parseInt(item, 10))
        .sort((a, b) => a - b);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJyb3JHcm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0Vycm9yR3JvdXAudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBMkI7QUFDM0IsNERBQW1DO0FBQ25DLDhEQUFtQztBQUNuQywrQ0FBdUM7QUFDdkMsaUVBQXdDO0FBQ3hDLDZEQUFzQztBQVN0QyxTQUFnQixVQUFVLENBQUMsS0FBdUI7SUFDaEQsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLEdBQUcsS0FBSyxDQUFBO0lBQ25ELE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQyxHQUFHLGdCQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDL0QsTUFBTSxDQUFDLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDLEdBQUcsZ0JBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUM1RCxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksSUFBSSxtQkFBVyxDQUFDLENBQUE7SUFDL0QsTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUN2RCxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDN0MsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQzVDLE9BQU8sQ0FDTCx1Q0FBSyxTQUFTLEVBQUMsUUFBUTtRQUVyQix1Q0FBSyxTQUFTLEVBQUMsMkJBQTJCO1lBQ3hDLHdDQUFNLFNBQVMsRUFBQyxPQUFPO2dCQUFFLFVBQVUsQ0FBQyxLQUFLO3FCQUFVO1lBQ25ELHFDQUNFLElBQUksRUFBQyxRQUFRLEVBQ2IsU0FBUyxFQUFFLG9CQUFVLENBQUM7b0JBQ3BCLEtBQUssRUFBRSxJQUFJO29CQUNYLGFBQWEsRUFBRSxJQUFJO29CQUNuQixTQUFTLEVBQUUs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QUMsU0FBcUI7SUFDaEQsT0FBTyxTQUFTLENBQUMsT0FBTyxLQUFLLE1BQU0sQ0FBQTtBQUNyQyxDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsU0FBcUI7SUFDM0MsSUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQTtJQUN2QyxJQUFJLFdBQVcsRUFBRTtRQUNmLFdBQVcsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFBO1FBQ3BFLFdBQVcsR0FBRyxnQkFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0tBQ2xDO0lBQ0QsT0FBTyxXQUFXLENBQUE7QUFDcEIsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLFVBQXVCO0lBQzVDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO1NBQ2hDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztTQUNqQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDMUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtYXJrZWQgZnJvbSAnbWFya2VkJ1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcydcbmltcG9ydCBoZXhUb1JnYmEgZnJvbSAnaGV4LXRvLXJnYmEnXG5pbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBzdGFydENhc2UgZnJvbSAnbG9kYXNoL3N0YXJ0Q2FzZSdcbmltcG9ydCBkZWZhdWx0U3BlYyBmcm9tICcuLi9zcGVjLmpzb24nXG5pbXBvcnQgeyBJU3BlYywgSVNwZWNFcnJvciwgSUVycm9yR3JvdXAgfSBmcm9tICcuLi9jb21tb24nXG5cbmV4cG9ydCBpbnRlcmZhY2UgSUVycm9yR3JvdXBQcm9wcyB7XG4gIGVycm9yR3JvdXA6IElFcnJvckdyb3VwXG4gIHNwZWM/OiBJU3BlY1xuICBza2lwSGVhZGVySW5kZXg/OiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFcnJvckdyb3VwKHByb3BzOiBJRXJyb3JHcm91cFByb3BzKSB7XG4gIGNvbnN0IHsgZXJyb3JHcm91cCwgc3BlYywgc2tpcEhlYWRlckluZGV4IH0gPSBwcm9wc1xuICBjb25zdCBbaXNEZXRhaWxzVmlzaWJsZSwgc2V0SXNEZXRhaWxzVmlzaWJsZV0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3Zpc2libGVSb3dzQ291bnQsIHNldFZpc2libGVSb3dzQ291bnRdID0gdXNlU3RhdGUoMTApXG4gIGNvbnN0IHNwZWNFcnJvciA9IGdldFNwZWNFcnJvcihlcnJvckdyb3VwLCBzcGVjIHx8IGRlZmF1bHRTcGVjKVxuICBjb25zdCBpc0hlYWRlcnNWaXNpYmxlID0gZ2V0SXNIZWFkZXJzVmlzaWJsZShzcGVjRXJyb3IpXG4gIGNvbnN0IGRlc2NyaXB0aW9uID0gZ2V0RGVzY3JpcHRpb24oc3BlY0Vycm9yKVxuICBjb25zdCByb3dOdW1iZXJzID0gZ2V0Um93TnVtYmVycyhlcnJvckdyb3VwKVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzdWx0XCI+XG4gICAgICB7LyogSGVhZGluZyAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlclwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb3VudFwiPntlcnJvckdyb3VwLmNvdW50fSB4PC9zcGFuPlxuICAgICAgICA8YVxuICAgICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyh7XG4gICAgICAgICAgICBiYWRnZTogdHJ1ZSxcbiAgICAgICAgICAgICdiYWRnZS1lcnJvcic6IHRydWUsXG4gICAgICAgICAgICBjb2xsYXBzZWQ6ICFpc0RldGFpbHNWaXNpYmxlLFxuICAgICAgICAgIH0pfVxuICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElzRGV0YWlsc1Zpc2libGUoIWlzRGV0YWlsc1Zpc2libGUpfVxuICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiXG4gICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiBnZXRSZ2JhQ29sb3Ioc3BlY0Vycm9yKSB9fVxuICAgICAgICA+XG4gICAgICAgICAge3NwZWNFcnJvci5uYW1lfVxuICAgICAgICA8L2E+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIEVycm9yIGRldGFpbHMgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhbJ2NvbGxhcHNlJywgeyBzaG93OiBpc0RldGFpbHNWaXNpYmxlIH1dKX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZXJyb3ItZGV0YWlsc1wiIHN0eWxlPXt7IGJvcmRlckNvbG9yOiBnZXRSZ2JhQ29sb3Ioc3BlY0Vycm9yKSB9fT5cbiAgICAgICAgICB7ZGVzY3JpcHRpb24gJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJlcnJvci1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICA8ZGl2IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogZGVzY3JpcHRpb24gfX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJlcnJvci1saXN0XCIgc3R5bGU9e3sgYm9yZGVyVG9wQ29sb3I6IGdldFJnYmFDb2xvcihzcGVjRXJyb3IpIH19PlxuICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZXJyb3ItbGlzdC1oZWFkaW5nXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGdldFJnYmFDb2xvcihzcGVjRXJyb3IsIDAuMSksXG4gICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tQ29sb3I6IGdldFJnYmFDb2xvcihzcGVjRXJyb3IsIDAuMjUpLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBUaGUgZnVsbCBsaXN0IG9mIGVycm9yIG1lc3NhZ2VzOlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHVsXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBnZXRSZ2JhQ29sb3Ioc3BlY0Vycm9yLCAwLjA1KSxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2Vycm9yR3JvdXAubWVzc2FnZXMubWFwKChtZXNzYWdlLCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e2luZGV4fT57bWVzc2FnZX08L2xpPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBUYWJsZSB2aWV3ICovfVxuICAgICAgeyFbJ3NvdXJjZS1lcnJvciddLmluY2x1ZGVzKGVycm9yR3JvdXAuY29kZSkgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhYmxlLXZpZXdcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlubmVyXCI+XG4gICAgICAgICAgICA8RXJyb3JHcm91cFRhYmxlXG4gICAgICAgICAgICAgIHNwZWNFcnJvcj17c3BlY0Vycm9yfVxuICAgICAgICAgICAgICBlcnJvckdyb3VwPXtlcnJvckdyb3VwfVxuICAgICAgICAgICAgICB2aXNpYmxlUm93c0NvdW50PXt2aXNpYmxlUm93c0NvdW50fVxuICAgICAgICAgICAgICByb3dOdW1iZXJzPXtyb3dOdW1iZXJzfVxuICAgICAgICAgICAgICBpc0hlYWRlcnNWaXNpYmxlPXtpc0hlYWRlcnNWaXNpYmxlfVxuICAgICAgICAgICAgICBza2lwSGVhZGVySW5kZXg9e3NraXBIZWFkZXJJbmRleH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgey8qIFNob3cgbW9yZSAqL31cbiAgICAgIHt2aXNpYmxlUm93c0NvdW50IDwgcm93TnVtYmVycy5sZW5ndGggJiYgKFxuICAgICAgICA8YSBjbGFzc05hbWU9XCJzaG93LW1vcmVcIiBvbkNsaWNrPXsoKSA9PiBzZXRWaXNpYmxlUm93c0NvdW50KHZpc2libGVSb3dzQ291bnQgKyAxMCl9PlxuICAgICAgICAgIFNob3cgbW9yZSA8c3BhbiBjbGFzc05hbWU9XCJpY29uLWtleWJvYXJkX2Fycm93X2Rvd25cIiAvPlxuICAgICAgICA8L2E+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIEVycm9yR3JvdXBUYWJsZShwcm9wczoge1xuICBzcGVjRXJyb3I6IElTcGVjRXJyb3JcbiAgZXJyb3JHcm91cDogSUVycm9yR3JvdXBcbiAgdmlzaWJsZVJvd3NDb3VudDogbnVtYmVyXG4gIHJvd051bWJlcnM6IG51bWJlcltdXG4gIGlzSGVhZGVyc1Zpc2libGU6IGJvb2xlYW5cbiAgc2tpcEhlYWRlckluZGV4PzogYm9vbGVhblxufSkge1xuICBjb25zdCB7XG4gICAgc3BlY0Vycm9yLFxuICAgIGVycm9yR3JvdXAsXG4gICAgdmlzaWJsZVJvd3NDb3VudCxcbiAgICByb3dOdW1iZXJzLFxuICAgIGlzSGVhZGVyc1Zpc2libGUsXG4gICAgc2tpcEhlYWRlckluZGV4LFxuICB9ID0gcHJvcHNcbiAgcmV0dXJuIChcbiAgICA8dGFibGUgY2xhc3NOYW1lPVwidGFibGUgdGFibGUtc21cIj5cbiAgICAgIDx0Ym9keT5cbiAgICAgICAge2Vycm9yR3JvdXAuaGVhZGVycyAmJiBpc0hlYWRlcnNWaXNpYmxlICYmIChcbiAgICAgICAgICA8dHIgY2xhc3NOYW1lPVwiYmVmb3JlLWZhaWxcIj5cbiAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPntza2lwSGVhZGVySW5kZXggPyAnJyA6ICcxJ308L3RkPlxuICAgICAgICAgICAge2Vycm9yR3JvdXAuaGVhZGVycy5tYXAoKGhlYWRlciwgaW5kZXgpID0+IChcbiAgICAgICAgICAgICAgPHRkIGtleT17aW5kZXh9PntoZWFkZXJ9PC90ZD5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvdHI+XG4gICAgICAgICl9XG4gICAgICAgIHtyb3dOdW1iZXJzLm1hcChcbiAgICAgICAgICAocm93TnVtYmVyLCBpbmRleCkgPT5cbiAgICAgICAgICAgIGluZGV4IDwgdmlzaWJsZVJvd3NDb3VudCAmJiAoXG4gICAgICAgICAgICAgIDx0ciBrZXk9e2luZGV4fSBjbGFzc05hbWU9e2NsYXNzTmFtZXMoeyBmYWlsOiBlcnJvckdyb3VwLmNvZGUuaW5jbHVkZXMoJ3JvdycpIH0pfT5cbiAgICAgICAgICAgICAgICA8dGRcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogZ2V0UmdiYUNvbG9yKHNwZWNFcnJvciwgMC4yNSkgfX1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlc3VsdC1yb3ctaW5kZXhcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtyb3dOdW1iZXIgfHwgKHNraXBIZWFkZXJJbmRleCA/ICcnIDogMSl9XG4gICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICB7ZXJyb3JHcm91cC5yb3dzW3Jvd051bWJlcl0udmFsdWVzLm1hcCgodmFsdWUsIGlubmVySW5kZXgpID0+IChcbiAgICAgICAgICAgICAgICAgIDx0ZFxuICAgICAgICAgICAgICAgICAgICBrZXk9e2lubmVySW5kZXh9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogZ2V0UmdiYUNvbG9yKHNwZWNFcnJvciwgMC4yNSkgfX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKHtcbiAgICAgICAgICAgICAgICAgICAgICBmYWlsOiBlcnJvckdyb3VwLnJvd3Nbcm93TnVtYmVyXS5iYWRjb2xzLmhhcyhpbm5lckluZGV4ICsgMSksXG4gICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7dmFsdWV9XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgKVxuICAgICAgICApfVxuICAgICAgICA8dHIgY2xhc3NOYW1lPVwiYWZ0ZXItZmFpbFwiPlxuICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJyZXN1bHQtcm93LWluZGV4XCI+XG4gICAgICAgICAgICB7cm93TnVtYmVyc1tyb3dOdW1iZXJzLmxlbmd0aCAtIDFdID8gcm93TnVtYmVyc1tyb3dOdW1iZXJzLmxlbmd0aCAtIDFdICsgMSA6IDJ9XG4gICAgICAgICAgPC90ZD5cbiAgICAgICAgICB7ZXJyb3JHcm91cC5oZWFkZXJzICYmIGVycm9yR3JvdXAuaGVhZGVycy5tYXAoKF9oZWFkZXIsIGluZGV4KSA9PiA8dGQga2V5PXtpbmRleH0gLz4pfVxuICAgICAgICA8L3RyPlxuICAgICAgPC90Ym9keT5cbiAgICA8L3RhYmxlPlxuICApXG59XG5cbi8vIEhlbHBlcnNcblxuZnVuY3Rpb24gZ2V0U3BlY0Vycm9yKGVycm9yR3JvdXA6IElFcnJvckdyb3VwLCBzcGVjOiBJU3BlYykge1xuICAvLyBHZXQgY29kZSBoYW5kbGluZyBsZWdhY3kgY29kZXNcbiAgbGV0IGNvZGUgPSBlcnJvckdyb3VwLmNvZGVcbiAgaWYgKGNvZGUgPT09ICdub24tY2FzdGFibGUtdmFsdWUnKSB7XG4gICAgY29kZSA9ICd0eXBlLW9yLWZvcm1hdC1lcnJvcidcbiAgfVxuXG4gIC8vIEdldCBkZXRhaWxzIGhhbmRsaW5nIGN1c3RvbSBlcnJvcnNcbiAgbGV0IGRldGFpbHMgPSBzcGVjLmVycm9yc1tjb2RlXVxuICBpZiAoIWRldGFpbHMpIHtcbiAgICBkZXRhaWxzID0ge1xuICAgICAgbmFtZTogc3RhcnRDYXNlKGNvZGUpLFxuICAgICAgdHlwZTogJ2N1c3RvbScsXG4gICAgICBjb250ZXh0OiAnYm9keScsXG4gICAgICBtZXNzYWdlOiAnY3VzdG9tJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgIHdlaWdodDogMCxcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGV0YWlsc1xufVxuXG5mdW5jdGlvbiBnZXRSZ2JhQ29sb3Ioc3BlY0Vycm9yOiBJU3BlY0Vycm9yLCBhbHBoYTogbnVtYmVyID0gMSkge1xuICByZXR1cm4gc3BlY0Vycm9yLmhleENvbG9yID8gaGV4VG9SZ2JhKHNwZWNFcnJvci5oZXhDb2xvciwgYWxwaGEpIDogdW5kZWZpbmVkXG59XG5cbmZ1bmN0aW9uIGdldElzSGVhZGVyc1Zpc2libGUoc3BlY0Vycm9yOiBJU3BlY0Vycm9yKSB7XG4gIHJldHVybiBzcGVjRXJyb3IuY29udGV4dCA9PT0gJ2JvZHknXG59XG5cbmZ1bmN0aW9uIGdldERlc2NyaXB0aW9uKHNwZWNFcnJvcjogSVNwZWNFcnJvcikge1xuICBsZXQgZGVzY3JpcHRpb24gPSBzcGVjRXJyb3IuZGVzY3JpcHRpb25cbiAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbi5yZXBsYWNlKCd7dmFsaWRhdG9yfScsICdgZ29vZHRhYmxlcy55bWxgJylcbiAgICBkZXNjcmlwdGlvbiA9IG1hcmtlZChkZXNjcmlwdGlvbilcbiAgfVxuICByZXR1cm4gZGVzY3JpcHRpb25cbn1cblxuZnVuY3Rpb24gZ2V0Um93TnVtYmVycyhlcnJvckdyb3VwOiBJRXJyb3JHcm91cCkge1xuICByZXR1cm4gT2JqZWN0LmtleXMoZXJyb3JHcm91cC5yb3dzKVxuICAgIC5tYXAoKGl0ZW0pID0+IHBhcnNlSW50KGl0ZW0sIDEwKSlcbiAgICAuc29ydCgoYSwgYikgPT4gYSAtIGIpXG59XG4iXX0=