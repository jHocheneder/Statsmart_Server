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
exports.StatisticController = void 0;
const express_1 = require("express");
const repository_1 = require("../repository/repository");
const mariadb = __importStar(require("mariadb"));
class StatisticController {
    static handler() {
        let router = express_1.Router();
        const repo = new repository_1.Repository();
        const pool = mariadb.createPool({
            host: '195.128.100.64',
            user: 'statsmart',
            password: 'Statsmart_01',
            database: 'statsmart',
            connectionLimit: 15
        });
        router.post('/saveStatistic', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let x = yield pool.query("INSERT INTO Statistik VALUE (?, ?, ?, ?, ?, ?, ?)", [null, req.body.title, req.body.chartType, req.body.errorRate, req.body.xTitle, req.body.description, repo.getPayload(req.headers['authorization'])]);
                let y = yield pool.query("INSERT INTO File VALUE (?, ?, ?, ?, ?, ?)", [null, req.body.link1, req.body.xValue, req.body.yValue1, req.body.yTitle1, x.insertId]);
                let z = yield pool.query("INSERT INTO File VALUE (?, ?, ?, ?, ?, ?)", [null, req.body.link2, req.body.xValue, req.body.yValue2, req.body.yTitle2, x.insertId]);
                res.send(x + y + z);
            }
            catch (ex) {
                res.send("error in saveStatistic \n" + ex);
            }
        }));
        router.get('/clearAllStatistic', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let x = yield pool.query("delete from Statistik");
                res.send(x);
            }
            catch (ex) {
                res.send("error in clearAllStatistic \n" + ex);
            }
        }));
        router.put('/updateRating', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let x = yield pool.query("select * from Rating where statistikid = ? and userid = ?", [req.body.statistikid, repo.getPayload(req.headers['authorization'])]);
                if (x[0] == null) {
                    x = yield createRating(repo.getPayload(req.headers['authorization']), req.body);
                }
                else {
                    x = yield pool.query("update Rating set rating = ? where statistikid = ? and userid = ?", [req.body.rating, req.body.statistikid, repo.getPayload(req.headers['authorization'])]);
                }
                res.send(x);
            }
            catch (ex) {
                res.send("error in updateRating \n" + ex);
            }
        }));
        function createRating(id, body) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let x = yield pool.query("insert into Rating Value (?, ?, ?, ?)", [null, id, body.statistikid, body.rating]);
                    return (x);
                }
                catch (ex) {
                    return ("error in createRating \n" + ex);
                }
            });
        }
        return router;
    }
}
exports.StatisticController = StatisticController;
//# sourceMappingURL=statistic.js.map