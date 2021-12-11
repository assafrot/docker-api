import { DocumentDefinition } from 'mongoose'
import { ImageDocument, ImageModel } from '../models/image.model';
import { combination } from '../utils/combinations';
import flatifyObject from 'flatify-obj';
import mongoose from 'mongoose';

export class ImageService {
    constructor() {
    }

    async createImage(input: DocumentDefinition<Omit<ImageDocument, "createdAt" | "updatedAt">>) {
        try {
            return await ImageModel.create(input);
        } catch (e: any) {
            if (e['code'] === 11000) {
                throw new Error("Image Already Exists")
            } else {
                throw new Error(e.message)
            }
        }
    }

    async updateImage(query: object, update: ImageDocument) {
        try {
            let nestedUpdate = flatifyObject(update)

            let updatedImage = await ImageModel.findOneAndUpdate(query, nestedUpdate, {
                new: true,
                overwriteDiscriminatorKey: true
            });
            if (!updatedImage) {
                throw new Error("Image not exists")
            }
            return updatedImage
        } catch (e: any) {
            throw new Error((e))
        }
    }

    async getImageById(id: string) {
        try {
            const query = {_id: new mongoose.Types.ObjectId(id)}
            return await ImageModel.findOne(query);
        } catch (e: any) {
            throw new Error((e))
        }
    }

    async getImages(limit = 2 , skip = 0) {
        try {
            return await ImageModel.find()
                .sort({
                    createdAt: 'desc'
                })
                .limit(limit)
                .skip(skip);
        } catch (e: any) {
            throw new Error((e))
        }
    }

    async getImagesCombinations(length: number) {
        try {
            const images = await ImageModel.find();
            const combinations = combination<ImageDocument>(images, length)
            return combinations
        } catch (e: any) {
            throw new Error((e))
        }
    }

}

