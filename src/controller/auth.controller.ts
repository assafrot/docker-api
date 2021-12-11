import { Request, Response } from 'express';
import { signJwt } from '../utils/jwt.utils';
import config from 'config';

export async function getTokenHandler(req: Request, res: Response) {
    const accessToken = signJwt(
        req.body.userName
    );

    return res.send({accessToken})
}
