
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.ensureToken = function (req: { headers: { [x: string]: any }; token: any }, res: { sendStatus: (arg0: number) => any; status: (arg0: number) => { (): any; new(): any; send: { (): any; new(): any } } }, next: () => void){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    req.token = token
    if (token == null){
        console.log("token is null")
        return res.sendStatus(401)
    }  // if there isn't any token
    //if there is no token stored in cookies, the request is unauthorized
    if (!token){
        return res.status(403).send()
    }
    let payload
    try{
        //use the jwt.verify method to verify the access token
        //throws an error if the token has expired or has a invalid signature
        payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        next()
    }
    catch(e){
        //if an error occured return request unauthorized error
        console.log("token expired or invalid")
        return res.status(401).send()
    }
}
