import mongoose from "mongoose";


export interface ImageDocument extends mongoose.Document {
    name: string;
    repository: string;
    version: string;
    metadata: object;
    createdAt: Date;
    updatedAt: Date;
}

const imageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        repository: { type: String, required: true },
        version: { type: String, required: true },
        metadata: { type: Object },
    },
    {
        timestamps: true,
    }
);

export const ImageModel = mongoose.model("Image", imageSchema);
