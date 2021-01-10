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
const cheerio = require('cheerio');
const $ = cheerio.load('<h2 class="title">Hello world</h2>');
const url = 'https://www.data.gv.at/suche/?sort=abc'; // URL we're scraping
const AxiosInstance = axios_1.default.create(); // Create a new Axios Instance
const csv = require('csv-parser');
const fs = require('fs');
const http = require('http');
var Papa = require('papaparse');
const results = [];
const csvurl = 'http://data.linz.gv.at/katalog/gesundheit/akh_herkunft/AKHHER.csv';
/*console.log(Papa.parse(csvurl, {
    download: false,
    step: function(row) {
    console.log("Row:", row.data);
  },
  complete: function() {
      console.log("All done!");
  }
}))*/
/*fs.createReadStream(http.get('https://www.cdc.gov/coronavirus/2019-ncov/map-data-cases.csv', res => res.pipe(fs.createWriteStream('some.csv')))
)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
  });*/
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
server.use(express_1.default.json());
var cors = require('cors');
server.use(cors());
const port = 8080;
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
server.post('/api/saveStatistic', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let x = yield pool.query("INSERT INTO Statistik VALUE (?, ?, ?, ?, ?, ?, ?)", [null, req.body.title, req.body.chartType, req.body.errorRate, req.body.xTitle, req.body.description, req.body.userId]);
        res.send(x);
    }
    catch (ex) {
        res.send("error in saveStatistic \n" + ex);
    }
}));
server.get('/api/findAllStatistic', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let x = yield pool.query("select * from Statistik");
        res.send(x);
    }
    catch (ex) {
        res.send("error in findAllStatistic \n" + ex);
    }
}));
server.put('/api/updateRating', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let x = yield pool.query("update Rating set rating = ? where statistikid = ? and userid = ?", [req.body.rating, req.body.statistikid, req.body.userid]);
        res.send(x);
    }
    catch (ex) {
        res.send("error in updateRating \n" + ex);
    }
}));
server.post('/api/createRating', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let x = yield pool.query("insert into Rating Value (?, ?, ?, ?)", [null, req.body.userid, req.body.statistikid, req.body.rating]);
        res.send(x);
    }
    catch (ex) {
        res.send("error in createRating \n" + ex);
    }
}));
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
        const html2 = response.data;
        const headers = [];
        const parsecsv = Papa.parse(html2);
        for (let i = 0; i < parsecsv.data.length; i++) {
            headers.push(parsecsv.data[i]);
        }
        res.send(headers);
    })
        .catch(console.error);
});
server.post('/api/insertstatistic/', (req, res) => {
});
//# sourceMappingURL=index.js.map