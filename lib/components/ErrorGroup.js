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
    let afterFailRowNumber = 1;
    if (rowNumbers[rowNumbers.length - 1]) {
        afterFailRowNumber = rowNumbers[rowNumbers.length - 1] + 1;
    }
    else if (skipHeaderIndex) {
        afterFailRowNumber = 1;
    }
    else {
        afterFailRowNumber = 2;
    }
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
                react_1.default.createElement("td", { className: "result-row-index" }, afterFailRowNumber),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJyb3JHcm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0Vycm9yR3JvdXAudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBMkI7QUFDM0IsNERBQW1DO0FBQ25DLDhEQUFtQztBQUNuQywrQ0FBdUM7QUFDdkMsaUVBQXdDO0FBQ3hDLDZEQUFzQztBQVN0QyxTQUFnQixVQUFVLENBQUMsS0FBdUI7SUFDaEQsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLEdBQUcsS0FBSyxDQUFBO0lBQ25ELE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQyxHQUFHLGdCQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDL0QsTUFBTSxDQUFDLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDLEdBQUcsZ0JBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUM1RCxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksSUFBSSxtQkFBVyxDQUFDLENBQUE7SUFDL0QsTUFBTSxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUN2RCxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDN0MsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQzVDLE9BQU8sQ0FDTCx1Q0FBSyxTQUFTLEVBQUMsUUFBUTtRQUVyQix1Q0FBSyxTQUFTLEVBQUMsMkJBQTJCO1lBQ3hDLHdDQUFNLFNBQVMsRUFBQyxPQUFPO2dCQUFFLFVBQVUsQ0FBQyxLQUFLO3FCQUFVO1lBQ25ELHFDQUNFLElBQUksRUFBQyxRQUFRLEVBQ2IsU0FBUyxFQUFFLG9CQUFVLENBQUM7b0JBQ3BCLEtBQUssRUFBRSxJQUFJO29CQUNYLGFBQWEsRUFBRSxJQUFJO29CQUNuQixTQUFTLEVBQUUs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QUM7SUFDNUQsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxxQkFBUyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQTtBQUM5RSxDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxTQUFxQjtJQUNoRCxPQUFPLFNBQVMsQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFBO0FBQ3JDLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxTQUFxQjtJQUMzQyxJQUFJLFdBQVcsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFBO0lBQ3ZDLElBQUksV0FBVyxFQUFFO1FBQ2YsV0FBVyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDLENBQUE7UUFDcEUsV0FBVyxHQUFHLGdCQUFNLENBQUMsV0FBVyxDQUFDLENBQUE7S0FDbEM7SUFDRCxPQUFPLFdBQVcsQ0FBQTtBQUNwQixDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsVUFBdUI7SUFDNUMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7U0FDaEMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ2pDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUMxQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnXG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJ1xuaW1wb3J0IGhleFRvUmdiYSBmcm9tICdoZXgtdG8tcmdiYSdcbmltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHN0YXJ0Q2FzZSBmcm9tICdsb2Rhc2gvc3RhcnRDYXNlJ1xuaW1wb3J0IGRlZmF1bHRTcGVjIGZyb20gJy4uL3NwZWMuanNvbidcbmltcG9ydCB7IElTcGVjLCBJU3BlY0Vycm9yLCBJRXJyb3JHcm91cCB9IGZyb20gJy4uL2NvbW1vbidcblxuZXhwb3J0IGludGVyZmFjZSBJRXJyb3JHcm91cFByb3BzIHtcbiAgZXJyb3JHcm91cDogSUVycm9yR3JvdXBcbiAgc3BlYz86IElTcGVjXG4gIHNraXBIZWFkZXJJbmRleD86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVycm9yR3JvdXAocHJvcHM6IElFcnJvckdyb3VwUHJvcHMpIHtcbiAgY29uc3QgeyBlcnJvckdyb3VwLCBzcGVjLCBza2lwSGVhZGVySW5kZXggfSA9IHByb3BzXG4gIGNvbnN0IFtpc0RldGFpbHNWaXNpYmxlLCBzZXRJc0RldGFpbHNWaXNpYmxlXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbdmlzaWJsZVJvd3NDb3VudCwgc2V0VmlzaWJsZVJvd3NDb3VudF0gPSB1c2VTdGF0ZSgxMClcbiAgY29uc3Qgc3BlY0Vycm9yID0gZ2V0U3BlY0Vycm9yKGVycm9yR3JvdXAsIHNwZWMgfHwgZGVmYXVsdFNwZWMpXG4gIGNvbnN0IGlzSGVhZGVyc1Zpc2libGUgPSBnZXRJc0hlYWRlcnNWaXNpYmxlKHNwZWNFcnJvcilcbiAgY29uc3QgZGVzY3JpcHRpb24gPSBnZXREZXNjcmlwdGlvbihzcGVjRXJyb3IpXG4gIGNvbnN0IHJvd051bWJlcnMgPSBnZXRSb3dOdW1iZXJzKGVycm9yR3JvdXApXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyZXN1bHRcIj5cbiAgICAgIHsvKiBIZWFkaW5nICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvdW50XCI+e2Vycm9yR3JvdXAuY291bnR9IHg8L3NwYW4+XG4gICAgICAgIDxhXG4gICAgICAgICAgcm9sZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKHtcbiAgICAgICAgICAgIGJhZGdlOiB0cnVlLFxuICAgICAgICAgICAgJ2JhZGdlLWVycm9yJzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbGxhcHNlZDogIWlzRGV0YWlsc1Zpc2libGUsXG4gICAgICAgICAgfSl9XG4gICAgICAgICAgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNEZXRhaWxzVmlzaWJsZSghaXNEZXRhaWxzVmlzaWJsZSl9XG4gICAgICAgICAgYXJpYS1leHBhbmRlZD1cImZhbHNlXCJcbiAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kQ29sb3I6IGdldFJnYmFDb2xvcihzcGVjRXJyb3IpIH19XG4gICAgICAgID5cbiAgICAgICAgICB7c3BlY0Vycm9yLm5hbWV9XG4gICAgICAgIDwvYT5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogRXJyb3IgZGV0YWlscyAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFsnY29sbGFwc2UnLCB7IHNob3c6IGlzRGV0YWlsc1Zpc2libGUgfV0pfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJlcnJvci1kZXRhaWxzXCIgc3R5bGU9e3sgYm9yZGVyQ29sb3I6IGdldFJnYmFDb2xvcihzcGVjRXJyb3IpIH19PlxuICAgICAgICAgIHtkZXNjcmlwdGlvbiAmJiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgIDxkaXYgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBkZXNjcmlwdGlvbiB9fSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yLWxpc3RcIiBzdHlsZT17eyBib3JkZXJUb3BDb2xvcjogZ2V0UmdiYUNvbG9yKHNwZWNFcnJvcikgfX0+XG4gICAgICAgICAgICA8cFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJlcnJvci1saXN0LWhlYWRpbmdcIlxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogZ2V0UmdiYUNvbG9yKHNwZWNFcnJvciwgMC4xKSxcbiAgICAgICAgICAgICAgICBib3JkZXJCb3R0b21Db2xvcjogZ2V0UmdiYUNvbG9yKHNwZWNFcnJvciwgMC4yNSksXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIFRoZSBmdWxsIGxpc3Qgb2YgZXJyb3IgbWVzc2FnZXM6XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8dWxcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGdldFJnYmFDb2xvcihzcGVjRXJyb3IsIDAuMDUpLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7ZXJyb3JHcm91cC5tZXNzYWdlcy5tYXAoKG1lc3NhZ2UsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgPGxpIGtleT17aW5kZXh9PnttZXNzYWdlfTwvbGk+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIFRhYmxlIHZpZXcgKi99XG4gICAgICB7IVsnc291cmNlLWVycm9yJ10uaW5jbHVkZXMoZXJyb3JHcm91cC5jb2RlKSAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFibGUtdmlld1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5uZXJcIj5cbiAgICAgICAgICAgIDxFcnJvckdyb3VwVGFibGVcbiAgICAgICAgICAgICAgc3BlY0Vycm9yPXtzcGVjRXJyb3J9XG4gICAgICAgICAgICAgIGVycm9yR3JvdXA9e2Vycm9yR3JvdXB9XG4gICAgICAgICAgICAgIHZpc2libGVSb3dzQ291bnQ9e3Zpc2libGVSb3dzQ291bnR9XG4gICAgICAgICAgICAgIHJvd051bWJlcnM9e3Jvd051bWJlcnN9XG4gICAgICAgICAgICAgIGlzSGVhZGVyc1Zpc2libGU9e2lzSGVhZGVyc1Zpc2libGV9XG4gICAgICAgICAgICAgIHNraXBIZWFkZXJJbmRleD17c2tpcEhlYWRlckluZGV4fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7LyogU2hvdyBtb3JlICovfVxuICAgICAge3Zpc2libGVSb3dzQ291bnQgPCByb3dOdW1iZXJzLmxlbmd0aCAmJiAoXG4gICAgICAgIDxhIGNsYXNzTmFtZT1cInNob3ctbW9yZVwiIG9uQ2xpY2s9eygpID0+IHNldFZpc2libGVSb3dzQ291bnQodmlzaWJsZVJvd3NDb3VudCArIDEwKX0+XG4gICAgICAgICAgU2hvdyBtb3JlIDxzcGFuIGNsYXNzTmFtZT1cImljb24ta2V5Ym9hcmRfYXJyb3dfZG93blwiIC8+XG4gICAgICAgIDwvYT5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZnVuY3Rpb24gRXJyb3JHcm91cFRhYmxlKHByb3BzOiB7XG4gIHNwZWNFcnJvcjogSVNwZWNFcnJvclxuICBlcnJvckdyb3VwOiBJRXJyb3JHcm91cFxuICB2aXNpYmxlUm93c0NvdW50OiBudW1iZXJcbiAgcm93TnVtYmVyczogbnVtYmVyW11cbiAgaXNIZWFkZXJzVmlzaWJsZTogYm9vbGVhblxuICBza2lwSGVhZGVySW5kZXg/OiBib29sZWFuXG59KSB7XG4gIGNvbnN0IHtcbiAgICBzcGVjRXJyb3IsXG4gICAgZXJyb3JHcm91cCxcbiAgICB2aXNpYmxlUm93c0NvdW50LFxuICAgIHJvd051bWJlcnMsXG4gICAgaXNIZWFkZXJzVmlzaWJsZSxcbiAgICBza2lwSGVhZGVySW5kZXgsXG4gIH0gPSBwcm9wc1xuICBsZXQgYWZ0ZXJGYWlsUm93TnVtYmVyID0gMVxuICBpZiAocm93TnVtYmVyc1tyb3dOdW1iZXJzLmxlbmd0aCAtIDFdKSB7XG4gICAgYWZ0ZXJGYWlsUm93TnVtYmVyID0gcm93TnVtYmVyc1tyb3dOdW1iZXJzLmxlbmd0aCAtIDFdICsgMVxuICB9IGVsc2UgaWYgKHNraXBIZWFkZXJJbmRleCkge1xuICAgIGFmdGVyRmFpbFJvd051bWJlciA9IDFcbiAgfSBlbHNlIHtcbiAgICBhZnRlckZhaWxSb3dOdW1iZXIgPSAyXG4gIH1cbiAgcmV0dXJuIChcbiAgICA8dGFibGUgY2xhc3NOYW1lPVwidGFibGUgdGFibGUtc21cIj5cbiAgICAgIDx0Ym9keT5cbiAgICAgICAge2Vycm9yR3JvdXAuaGVhZGVycyAmJiBpc0hlYWRlcnNWaXNpYmxlICYmIChcbiAgICAgICAgICA8dHIgY2xhc3NOYW1lPVwiYmVmb3JlLWZhaWxcIj5cbiAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPntza2lwSGVhZGVySW5kZXggPyAnJyA6ICcxJ308L3RkPlxuICAgICAgICAgICAge2Vycm9yR3JvdXAuaGVhZGVycy5tYXAoKGhlYWRlciwgaW5kZXgpID0+IChcbiAgICAgICAgICAgICAgPHRkIGtleT17aW5kZXh9PntoZWFkZXJ9PC90ZD5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvdHI+XG4gICAgICAgICl9XG4gICAgICAgIHtyb3dOdW1iZXJzLm1hcChcbiAgICAgICAgICAocm93TnVtYmVyLCBpbmRleCkgPT5cbiAgICAgICAgICAgIGluZGV4IDwgdmlzaWJsZVJvd3NDb3VudCAmJiAoXG4gICAgICAgICAgICAgIDx0ciBrZXk9e2luZGV4fSBjbGFzc05hbWU9e2NsYXNzTmFtZXMoeyBmYWlsOiBlcnJvckdyb3VwLmNvZGUuaW5jbHVkZXMoJ3JvdycpIH0pfT5cbiAgICAgICAgICAgICAgICA8dGRcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogZ2V0UmdiYUNvbG9yKHNwZWNFcnJvciwgMC4yNSkgfX1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlc3VsdC1yb3ctaW5kZXhcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtyb3dOdW1iZXIgfHwgKHNraXBIZWFkZXJJbmRleCA/ICcnIDogMSl9XG4gICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICB7ZXJyb3JHcm91cC5yb3dzW3Jvd051bWJlcl0udmFsdWVzLm1hcCgodmFsdWUsIGlubmVySW5kZXgpID0+IChcbiAgICAgICAgICAgICAgICAgIDx0ZFxuICAgICAgICAgICAgICAgICAgICBrZXk9e2lubmVySW5kZXh9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogZ2V0UmdiYUNvbG9yKHNwZWNFcnJvciwgMC4yNSkgfX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKHtcbiAgICAgICAgICAgICAgICAgICAgICBmYWlsOiBlcnJvckdyb3VwLnJvd3Nbcm93TnVtYmVyXS5iYWRjb2xzLmhhcyhpbm5lckluZGV4ICsgMSksXG4gICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7dmFsdWV9XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgKVxuICAgICAgICApfVxuICAgICAgICA8dHIgY2xhc3NOYW1lPVwiYWZ0ZXItZmFpbFwiPlxuICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJyZXN1bHQtcm93LWluZGV4XCI+e2FmdGVyRmFpbFJvd051bWJlcn08L3RkPlxuICAgICAgICAgIHtlcnJvckdyb3VwLmhlYWRlcnMgJiYgZXJyb3JHcm91cC5oZWFkZXJzLm1hcCgoX2hlYWRlciwgaW5kZXgpID0+IDx0ZCBrZXk9e2luZGV4fSAvPil9XG4gICAgICAgIDwvdHI+XG4gICAgICA8L3Rib2R5PlxuICAgIDwvdGFibGU+XG4gIClcbn1cblxuLy8gSGVscGVyc1xuXG5mdW5jdGlvbiBnZXRTcGVjRXJyb3IoZXJyb3JHcm91cDogSUVycm9yR3JvdXAsIHNwZWM6IElTcGVjKSB7XG4gIC8vIEdldCBjb2RlIGhhbmRsaW5nIGxlZ2FjeSBjb2Rlc1xuICBsZXQgY29kZSA9IGVycm9yR3JvdXAuY29kZVxuICBpZiAoY29kZSA9PT0gJ25vbi1jYXN0YWJsZS12YWx1ZScpIHtcbiAgICBjb2RlID0gJ3R5cGUtb3ItZm9ybWF0LWVycm9yJ1xuICB9XG5cbiAgLy8gR2V0IGRldGFpbHMgaGFuZGxpbmcgY3VzdG9tIGVycm9yc1xuICBsZXQgZGV0YWlscyA9IHNwZWMuZXJyb3JzW2NvZGVdXG4gIGlmICghZGV0YWlscykge1xuICAgIGRldGFpbHMgPSB7XG4gICAgICBuYW1lOiBzdGFydENhc2UoY29kZSksXG4gICAgICB0eXBlOiAnY3VzdG9tJyxcbiAgICAgIGNvbnRleHQ6ICdib2R5JyxcbiAgICAgIG1lc3NhZ2U6ICdjdXN0b20nLFxuICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgd2VpZ2h0OiAwLFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkZXRhaWxzXG59XG5cbmZ1bmN0aW9uIGdldFJnYmFDb2xvcihzcGVjRXJyb3I6IElTcGVjRXJyb3IsIGFscGhhOiBudW1iZXIgPSAxKSB7XG4gIHJldHVybiBzcGVjRXJyb3IuaGV4Q29sb3IgPyBoZXhUb1JnYmEoc3BlY0Vycm9yLmhleENvbG9yLCBhbHBoYSkgOiB1bmRlZmluZWRcbn1cblxuZnVuY3Rpb24gZ2V0SXNIZWFkZXJzVmlzaWJsZShzcGVjRXJyb3I6IElTcGVjRXJyb3IpIHtcbiAgcmV0dXJuIHNwZWNFcnJvci5jb250ZXh0ID09PSAnYm9keSdcbn1cblxuZnVuY3Rpb24gZ2V0RGVzY3JpcHRpb24oc3BlY0Vycm9yOiBJU3BlY0Vycm9yKSB7XG4gIGxldCBkZXNjcmlwdGlvbiA9IHNwZWNFcnJvci5kZXNjcmlwdGlvblxuICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICBkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uLnJlcGxhY2UoJ3t2YWxpZGF0b3J9JywgJ2Bnb29kdGFibGVzLnltbGAnKVxuICAgIGRlc2NyaXB0aW9uID0gbWFya2VkKGRlc2NyaXB0aW9uKVxuICB9XG4gIHJldHVybiBkZXNjcmlwdGlvblxufVxuXG5mdW5jdGlvbiBnZXRSb3dOdW1iZXJzKGVycm9yR3JvdXA6IElFcnJvckdyb3VwKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhlcnJvckdyb3VwLnJvd3MpXG4gICAgLm1hcCgoaXRlbSkgPT4gcGFyc2VJbnQoaXRlbSwgMTApKVxuICAgIC5zb3J0KChhLCBiKSA9PiBhIC0gYilcbn1cbiJdfQ==