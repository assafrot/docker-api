import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { verifyJwt } from '../utils/jwt.utils';

export const authCheck = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req, "headers.authorization", "").replace(
        /^Bearer\s/,
        ""
    );
    if (!accessToken) return res.sendStatus(401)

    const decoded = verifyJwt(accessToken);
    if (decoded.valid) {
        next()
    } else {
        res.sendStatus(401)
    }

}
