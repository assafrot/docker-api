import { createServer } from '../utils/server';
import supertest from 'supertest';
import { MongoMemoryServer } from "mongodb-memory-server";
import { CreateImage } from '../service/image.service';
import mongoose from 'mongoose';

const app = createServer()

const name = "my-image1"
const repository = "my-repo"
const version = "1.1.0"
const metadata = {key: "value"}

const imageInput = {
    name: name,
    repository: repository,
    version: version,
    metadata: metadata,
}

describe('image', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });
    beforeEach(async()=>{
        const collections = mongoose.connection.collections;
        for (const key in collections){
            const collection = collections[key]
            // @ts-ignore
            await collection.deleteMany();
        }
    });

    describe("get image", () => {
        describe("when the image not exists", () => {
            it('should return 404', async () => {
                const imageId = new mongoose.Types.ObjectId().toString()
                await supertest(app).get(`/images/${imageId}`).expect(404)
            })

        })

        describe("when the image does exists", () => {
            it('should return the image and status 200', async () => {
                const image = await CreateImage(imageInput)
                const {body, statusCode} = await supertest(app).get(`/images/${image._id}`)

                expect(statusCode).toBe(200);
                expect(body._id).toBe(image._id.toString());
            })

        })
    })

    describe("get images", () => {
        describe("when no images", () => {
            it('should return empty', async () => {
                const {body, statusCode} = await supertest(app).get(`/images`)
                expect(statusCode).toBe(200);
                expect(body).toEqual({images:[]});
            })

        })

        describe("when images exists", () => {
            it('should return list of images and status 200', async () => {
                await CreateImage(imageInput)
                let anotherImageInput = JSON.parse(JSON.stringify(imageInput))
                anotherImageInput.name = 'new-image-name'
                await CreateImage(anotherImageInput)
                const {body, statusCode} = await supertest(app).get(`/images`)

                expect(statusCode).toBe(200);
                console.log(body)
                expect(body.images.length).toEqual(2);
            })

        })
    })

    describe('create image', () => {
        describe('when the image payload is invalid', () => {
            describe('when missing params',  ()=>{
                it('should return missing param errors and status 400', async () => {
                    const invalidImageInput = {
                        name: "my-new-image",
                    }
                    const {statusCode, body} = await supertest(app).post('/images').send(invalidImageInput)
                    console.log(body)
                    expect(statusCode).toBe(400);
                    // @ts-ignore
                    let errorsMessages = body.map(er => er.message)
                    expect(errorsMessages.sort()).toEqual(['Repository is required','Version is required'].sort())
                });
            })
            describe('when invalid params',  ()=>{
                it('should return missing param errors and status 400', async () => {
                    const invalidImageInput = {
                        name: "my-new-image",
                        repository: 'repo',
                        version: 1,
                        metadata: 2
                    }
                    const {statusCode, body} = await supertest(app).post('/images').send(invalidImageInput)
                    console.log(body)
                    expect(statusCode).toBe(400);
                    // @ts-ignore
                    let errorsMessages = body.map(er => er.message)
                    expect(errorsMessages.sort()).toEqual(['Expected object, received number','Expected string, received number'].sort())
                });
            })
        });

        describe('when the image payload is valid', () => {
            it('should create image and return 200', async () => {
                const {statusCode, body} = await supertest(app).post('/images').send(imageInput)

                expect(statusCode).toBe(200);
                expect(body).toEqual({
                    __v: 0,
                    _id: expect.any(String),
                    name: name,
                    repository: repository,
                    version: version,
                    metadata: metadata,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                });
            });
        });

        describe('when the image already exists', () => {
            it('should return 409', async () => {
                await CreateImage(imageInput);
                let {statusCode} = await supertest(app).post('/images').send(imageInput)
                expect(statusCode).toBe(409);
            });
        });
    });
})




