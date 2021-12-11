import { Request, Response } from 'express';
import { ImageService } from '../service/image.service';
import mongoose from 'mongoose';

const imageService = new ImageService

export async function getImagesHandler(req: Request, res: Response) {
    try{
        let parsedLimit = req.query.limit ? +req.query.limit : undefined;
        let parsedSkip = req.query.skip ? +req.query.skip : undefined;
        const images = await imageService.getImages(parsedLimit, parsedSkip);
        res.status(200).send({images})
    }catch(e:any){
        return res.status(500).send(e.message);
    }

}

export async function getImageHandler(req: Request, res: Response) {
    try{
        const image = await imageService.getImageById(req.params._id);
        if (image === null) {
            res.sendStatus(404);
        } else {
            res.status(200).send(image)
        }
    }catch(e: any){
        return res.status(500).send(e.message);
    }

}

export async function createImageHandler(req: Request, res: Response) {
    try {
        const image = await imageService.createImage(req.body);
        return res.status(200).send(image)
    } catch (e: any) {
        return res.status(409).send(e.message);
    }
}

export async function updateImageHandler(req: Request, res: Response) {
    try {
        const query = {_id: new mongoose.Types.ObjectId(req.params._id)}
        const update = req.body;
        const updatedImage = await imageService.updateImage(query, update);
        return res.status(200).send(updatedImage)
    } catch (e: any) {
        if (e.messege === 'Image not exists'){
            return res.status(404).send(e.message);
        } else{
            return res.status(500).send(e.message);
        }
    }
}

export async function getImagesCombinationsHandler(req: Request, res: Response) {
    try{
        const images = await imageService.getImagesCombinations(+req.params.length);
        res.status(200).send(images);
    }catch(e:any){
        return res.status(500).send(e.message);
    }
}
