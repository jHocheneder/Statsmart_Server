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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Repository = void 0;
const mariadb = __importStar(require("mariadb"));
const jwt = require('jsonwebtoken');
require('dotenv').config();
class Repository {
    constructor() {
        this.pool = mariadb.createPool({
            host: '195.128.100.64',
            user: 'statsmart',
            password: 'Statsmart_01',
            database: 'statsmart',
            connectionLimit: 15
        });
    }
    getPayload(authHeader) {
        try {
            const token = authHeader && authHeader.split(' ')[1];
            let payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            return payload.user.id;
        }
        catch (ex) {
            return false;
        }
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let x = yield this.pool.query("INSERT INTO User VALUE (?, ?, ?, ?)", [null, user.email, user.password, user.username]);
                return x;
            }
            catch (ex) {
                console.log("error in createUser repo" + ex);
            }
        });
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(user);
                let x = yield this.pool.query("select * from User where email=? AND password=?", [user.email, user.password]);
                return x;
            }
            catch (ex) {
                console.log("error in sender login" + ex);
            }
        });
    }
    createAccessToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 18000 });
                return token;
            }
            catch (ex) {
                console.log("error in create token");
            }
        });
    }
}
exports.Repository = Repository;
//# sourceMappingURL=repository.js.map