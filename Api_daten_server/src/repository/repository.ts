import * as mariadb from 'mariadb';

const jwt = require('jsonwebtoken')
require('dotenv').config()

export class Repository {
    public pool: mariadb.Pool = mariadb.createPool({
        host: '195.128.100.64',
        user: 'statsmart',
        password: 'Statsmart_01',
        database: 'statsmart',
        connectionLimit: 15
      });
    
    public getPayload(authHeader: any){
        try {
            const token = authHeader && authHeader.split(' ')[1]
            let payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            return payload.user.id
        } catch(ex) {
            return false
        }
    }

    public async createUser(user){
        try {
            let x = await this.pool.query("INSERT INTO User VALUE (?, ?, ?, ?)",
             [null, user.email, user.password, user.username]);
           
            return x
        } catch(ex){
            console.log("error in createUser repo" + ex)
        }
    }

    public async login(user){
        try {
            console.log(user)
            let x = await this.pool.query("select * from User where email=? AND password=?", 
            [user.email, user.password])
            
            return x
        } catch (ex) {
            console.log("error in sender login" + ex)
        }
    }

    public async createAccessToken(user: any){
        try {
            let token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 18000})
            
            return token
        } catch(ex){
            console.log("error in create token")
        }
        
    }

}