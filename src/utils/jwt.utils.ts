import jwt from 'jsonwebtoken'
import config from 'config'


const privateKey = config.get<string>("privateKey");
const publicKey = config.get<string>("publicKey");

export function signJwt(userName: string){
return jwt.sign({userName},privateKey, {
    expiresIn: config.get("accessTokenTtl"),
    algorithm: 'RS256'
})
}

export function verifyJwt(token: string){
    try{
        const decoded = jwt.verify(token, publicKey)
        return {
            valid: true,
            expired: false,
            decoded: decoded
        }
    }catch(e:any){
        return {
            valid: false,
            expired: e.message === 'jwt expired',
            decoded: null
        }
    }

}
