import { RequestHandler, Router } from "express";
import { Repository } from "../repository/repository";

export class AuthenticationController {
    static handler(): RequestHandler{
        let router: Router = Router();
        const repo: Repository = new Repository();

        router.post('/login', async (req, res)=>{
            try {
                console.log(req.body)
                let p = await repo.login(req.body);
                if(p.length>0){
                    let token = await repo.createAccessToken(p[0]);
                    res.send(token);
                } else{
                    res.send(false);
                }
                
            } catch(error){
                console.log('error in login authentication'+error);
            }
        })

        router.post('/createUser', async (req, res)=>{
            try {
                let l = {email: req.body.email, password: req.body.password}

                let r = await repo.createUser(req.body);
                let p = await repo.login(l);

                if(p.length>0){
                    let token = await repo.createAccessToken(p[0]);
                    res.send(token);
                } else{
                    res.send(false);
                }
            } catch(error){
                console.log('error in createUser authentication' +error);
            }
        });

        return router;
    }
}