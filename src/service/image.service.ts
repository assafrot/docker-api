import {DocumentDefinition} from 'mongoose'
import { ImageDocument, ImageModel } from '../models/image.model';

export async function CreateImage(input: DocumentDefinition<Omit<ImageDocument, "createdAt" | "updatedAt">>){
    try{
        return await ImageModel.create(input);
    }catch (e: any){
        throw new Error((e))
    }
}

export async function GetImage(query: object){
    try{
        return await ImageModel.findOne(query);
    }catch (e: any){
        throw new Error((e))
    }
}

export async function GetImages(){
    try{
        return await ImageModel.find();
    }catch (e: any){
        throw new Error((e))
    }
}
