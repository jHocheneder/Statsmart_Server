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
exports.AuthenticationController = void 0;
const express_1 = require("express");
const repository_1 = require("../repository/repository");
class AuthenticationController {
    static handler() {
        let router = express_1.Router();
        const repo = new repository_1.Repository();
        router.post('/login', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                let p = yield repo.login(req.body);
                if (p.length > 0) {
                    let token = yield repo.createAccessToken(p[0]);
                    res.send(token);
                }
                else {
                    res.send(false);
                }
            }
            catch (error) {
                console.log('error in login authentication' + error);
            }
        }));
        router.post('/createUser', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let l = { email: req.body.email, password: req.body.password };
                let r = yield repo.createUser(req.body);
                let p = yield repo.login(l);
                if (p.length > 0) {
                    let token = yield repo.createAccessToken(p[0]);
                    res.send(token);
                }
                else {
                    res.send(false);
                }
            }
            catch (error) {
                console.log('error in createUser authentication' + error);
            }
        }));
        return router;
    }
}
exports.AuthenticationController = AuthenticationController;
//# sourceMappingURL=authentication.js.map