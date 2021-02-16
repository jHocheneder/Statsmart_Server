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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mariadb = __importStar(require("mariadb"));
console.log('Project setup correctly!');
/*import axios from 'axios';

const url = 'https://www.data.gv.at/suche/?sort=abc'; // URL we're scraping
const AxiosInstance = axios.create(); // Create a new Axios Instance

// Send an async HTTP Get request to the url
AxiosInstance.get(url)
  .then( // Once we have data returned ...
    response => {
      const html = response.data; // Get the HTML from the HTTP request
      console.log(html);
    }
  )
  .catch(console.error);*/
const axios_1 = __importDefault(require("axios"));
const link_1 = require("./class/link");
const downloadLink_1 = require("./class/downloadLink");
const statistic_1 = require("./controller/statistic");
const authentication_1 = require("./controller/authentication");
const encoder = require('iconv-lite');
const cheerio = require('cheerio');
const $ = cheerio.load('<h2 class="title">Hello world</h2>');
const url = 'https://www.data.gv.at/suche/?sort=abc'; // URL we're scraping
const AxiosInstance = axios_1.default.create(); // Create a new Axios Instance
const csv = require('csv-parser');
const fs = require('fs');
const http = require('http');
const { ensureToken } = require('./middleware');
const jwt = require("jsonwebtoken");
var Papa = require('papaparse');
const results = [];
const csvurl = 'http://data.linz.gv.at/katalog/gesundheit/akh_herkunft/AKHHER.csv';
let links = [];
let dl = "";
let download = [];
// Send an async HTTP Get request to the url
const pool = mariadb.createPool({
    host: '195.128.100.64',
    user: 'statsmart',
    password: 'Statsmart_01',
    database: 'statsmart',
    connectionLimit: 15
});
var server = express_1.default();
const bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(express_1.default.json());
var cors = require('cors');
server.use(cors());
const port = 8080;
server.use('/statistic', ensureToken, statistic_1.StatisticController.handler());
server.use('/authenticate', authentication_1.AuthenticationController.handler());
server.listen(port, function () {
    console.log('API is listening on port ' + port);
});
AxiosInstance.get(url)
    .then(response => {
    const html = response.data;
    const selector = cheerio.load(html);
    const searchResults = selector("body").find(".data-item > .mb-1");
    searchResults.each((i, elem) => {
        //if(i < 100){
        var link = new link_1.Link();
        link.id = i;
        link.title = $(elem).text().split(" (", 2).join(" ");
        link.link = $(elem).find('a').attr('href');
        links.push(link);
        //}
    });
    console.log("Ready!");
})
    .catch(console.error);
server.get('/api/getLinks', (req, res) => {
    res.send(links);
});
server.get('/api/downloadLinks/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resUrl = 'https://www.data.gv.at' + links[req.params.id].link;
    AxiosInstance.get(resUrl)
        .then(response => {
        const html2 = response.data;
        const selector2 = cheerio.load(html2);
        const searchResults2 = selector2("body").find(".resource-list > .resource-item");
        download = [];
        searchResults2.each((i, elem) => {
            var link = new downloadLink_1.DownloadLink();
            link.id = i;
            link.link = $(elem).find('a').attr('href');
            link.title = $(elem).find('a').attr('title');
            link.type = $(elem).find('span').html();
            download.push(link);
        });
        res.send(download);
    })
        .catch(console.error);
}));
server.get('/api/findAllStatistic', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let x = yield pool.query('SELECT s.id, title, chartType, errorRate, xTitle, description, s.userId, u.username, nvl(sum(Rating), 0) "Rating" ' +
            'from Statistik s left outer join Rating r ON s.id = r.statistikid JOIN User u ON s.userid = u.id group BY s.id');
        res.send(x);
    }
    catch (ex) {
        res.send("error in findAllStatistic \n" + ex);
    }
}));
server.get('/api/getLinksForStatistics/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let x = yield pool.query('SELECT f1.link "link1", f2.link "link2", f1.xValue, f1.yTitle "yTitle1", f1.yValue "yValue1", f2.yTitle "yTitle2", f2.yValue "yValue2" FROM (SELECT * FROM File WHERE statistikid = ? ORDER BY id DESC LIMIT 1) AS f1,' +
            '(SELECT * FROM File WHERE statistikid = ? ORDER BY id ASC LIMIT 1) AS f2;', [req.params.id, req.params.id]);
        res.send(x);
    }
    catch (ex) {
        res.send("error in getLinksForStatistics \n" + ex);
    }
}));
server.post('/api/download/', (req, res) => {
    const resUrl = 'https://www.data.gv.at' + req.body.link;
    AxiosInstance.get(resUrl)
        .then(response => {
        const html2 = response.data;
        const selector2 = cheerio.load(html2);
        const searchResults2 = selector2("body").find(".clearfix > .muted");
        searchResults2.each((i, elem) => {
            download = $(elem).find('a').attr('href');
        });
        res.send(download);
    })
        .catch(console.error);
});
server.post('/api/downloadcsv/', (req, res) => {
    const csvlink = req.body.link;
    AxiosInstance.get(csvlink)
        .then(response => {
        //const html2 = encoder.encode(response.data, 'iso 8859-1')
        const html2 = response.data;
        const headers = [];
        console.log(encoder.encodingExists('iso 8859-1'));
        console.log(response.headers['content-type']);
        console.log(html2);
        const parsecsv = Papa.parse(html2, {
            encoding: "utf-8"
        });
        console.log(parsecsv);
        for (let i = 0; i < parsecsv.data.length; i++) {
            headers.push(parsecsv.data[i]);
        }
        res.send(headers);
    })
        .catch(console.error);
    let response = axios_1.default.request({
        method: 'GET',
        url: req.body.link,
        responseType: 'arraybuffer'
    });
});
//# sourceMappingURL=index.js.map