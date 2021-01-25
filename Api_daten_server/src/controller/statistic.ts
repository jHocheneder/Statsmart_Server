import { RequestHandler, Router } from "express";
import { Repository } from "../repository/repository";
import * as mariadb from 'mariadb';

export class StatisticController {
    static handler(): RequestHandler{
        let router: Router = Router();
        const repo: Repository = new Repository();

        const pool: mariadb.Pool = mariadb.createPool({
            host: '195.128.100.64',
            user: 'statsmart',
            password: 'Statsmart_01',
            database: 'statsmart',
            connectionLimit: 15
          });

        router.post('/saveStatistic', async (req, res) => {
            try {
                let x = await pool.query("INSERT INTO Statistik VALUE (?, ?, ?, ?, ?, ?, ?)",
                    [null, req.body.title, req.body.chartType, req.body.errorRate, req.body.xTitle, req.body.description, repo.getPayload(req.headers['authorization'])])
                
                res.send(x)
            } catch (ex) {
                res.send("error in saveStatistic \n" + ex)
            }
        });
        
        router.get('/clearAllStatistic', async (req, res) => {
            try {
                let x = await pool.query("delete from Statistik")
            
                res.send(x)
            } catch (ex) {
                res.send("error in clearAllStatistic \n" + ex)
            }
        })
        
        router.put('/updateRating', async (req, res) => {
            try {
                let x = await pool.query("select * from Rating where statistikid = ? and userid = ?",
                    [req.body.statistikid, repo.getPayload(req.headers['authorization'])])

                if (x[0] == null) {
                    x = await createRating(repo.getPayload(req.headers['authorization']), req.body)
                } else {
                    x = await pool.query("update Rating set rating = ? where statistikid = ? and userid = ?", 
                        [req.body.rating, req.body.statistikid, repo.getPayload(req.headers['authorization'])])
                }
            
                res.send(x)
            } catch (ex) {
                res.send("error in updateRating \n" + ex)
            }
        })

        async function createRating(id, body) {
            try {
                let x = await pool.query("insert into Rating Value (?, ?, ?, ?)",
                    [null, id, body.statistikid, body.rating])
            
                return(x)
            } catch (ex) {
                return("error in createRating \n" + ex)
            }
        }
  

        return router;
    }
}