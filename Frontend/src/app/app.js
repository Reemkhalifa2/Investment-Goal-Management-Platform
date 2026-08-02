"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
@(0, core_1.Component)({
    selector: 'app-root',
    imports: [router_1.RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
class App {
    title = (0, core_1.signal)('frontend');
}
exports.App = App;
//# sourceMappingURL=app.js.map