import {Request, Response} from 'express';
import { ImageModel } from '../models/image.model';
import { CreateImage, GetImage, GetImages } from '../service/image.service';
import mongoose from 'mongoose';


export async function getImagesHandler(req: Request, res: Response) {
    const images = await GetImages();
    res.json({ images });
}

export async function getImageHandler(req: Request, res: Response) {
    const query = { _id: new mongoose.Types.ObjectId(req.params._id) }
    const image = await GetImage(query);
    if (image === null) {
        res.sendStatus(404);
    } else {
        res.json(image);
    }
}

export async function createImageHandler(req: Request, res: Response){
    try{
        const images = await GetImages();
        const image = await CreateImage(req.body);
        return res.status(200).send(image)
    }catch (e:any){
        return res.status(409).send(e.message);
    }
}
