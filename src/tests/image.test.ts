import { createServer } from '../utils/server';
import supertest from 'supertest';
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from 'mongoose';
import { signJwt } from '../utils/jwt.utils';
import { ImageService } from '../service/image.service';

const app = createServer()
const imageService = new ImageService

const name = "my-image1"
const repository = "my-repo"
const version = "1.1.0"
const metadata = {
    key: "value",
    key2: 1
}

const imageInput = {
    name: name,
    repository: repository,
    version: version,
    metadata: metadata,
}
let anotherImageInput = JSON.parse(JSON.stringify(imageInput))
anotherImageInput.name = 'new-image-name'

const jwt = signJwt('fake-auth')

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
                await supertest(app).get(`/images/${imageId}`).set("Authorization", `Bearer ${jwt}`).expect(404)
            })

        })

        describe("when the image does exists", () => {
            it('should return the image and status 200', async () => {
                const image = await imageService.createImage(imageInput)
                const {body, statusCode} = await supertest(app).get(`/images/${image._id}`).set("Authorization", `Bearer ${jwt}`)

                expect(statusCode).toBe(200);
                expect(body._id).toBe(image._id.toString());
            })

        })
    })

    describe("get images", () => {
        describe("when no images", () => {
            it('should return empty', async () => {
                const {body, statusCode} = await supertest(app).get(`/images`).set("Authorization", `Bearer ${jwt}`)
                expect(statusCode).toBe(200);
                expect(body).toEqual({images:[]});
            })

        })

        describe("when images exists", () => {
            it('should return list of images and status 200', async () => {
                await imageService.createImage(imageInput)
                await imageService.createImage(anotherImageInput)
                const {body, statusCode} = await supertest(app).get(`/images`).set("Authorization", `Bearer ${jwt}`)

                expect(statusCode).toBe(200);
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
                    const {statusCode, body} = await supertest(app).post('/images').set("Authorization", `Bearer ${jwt}`).send(invalidImageInput)
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
                    const {statusCode, body} = await supertest(app).post('/images').set("Authorization", `Bearer ${jwt}`).send(invalidImageInput)
                    expect(statusCode).toBe(400);
                    // @ts-ignore
                    let errorsMessages = body.map(er => er.message)
                    expect(errorsMessages.sort()).toEqual(['Expected object, received number','Expected string, received number'].sort())
                });
            })
        });

        describe('when the image payload is valid', () => {
            it('should create image and return 200', async () => {
                const {statusCode, body} = await supertest(app).post('/images').set("Authorization", `Bearer ${jwt}`).send(imageInput)

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
            describe('when the image already exists', () => {
                it('should return 409', async () => {
                    await imageService.createImage(imageInput);
                    let {statusCode} = await supertest(app).post('/images').set("Authorization", `Bearer ${jwt}`).send(imageInput)
                    expect(statusCode).toBe(409);
                });
            });
        });
    });

    describe('update image',()=>{
        describe('when image not exists',()=>{
            it('should return 404',async ()=>{
                const imageId = new mongoose.Types.ObjectId().toString()
                await supertest(app).get(`/images/${imageId}`).set("Authorization", `Bearer ${jwt}`).expect(404)
            })
        });
        describe('when image exists', ()=>{
            it('should return the updated the image and status 200 ',async ()=>{
                const image = await imageService.createImage(imageInput);
                let payloadToUpdate = JSON.parse(JSON.stringify(imageInput))
                payloadToUpdate.version = "1.2.3"
                let {statusCode,body} = await supertest(app).put(`/images/${image._id}`).set("Authorization", `Bearer ${jwt}`).send(payloadToUpdate)
                expect(statusCode).toBe(200);
                expect(body._id).toBe(image._id.toString());
                expect(body.version).toBe(payloadToUpdate.version);
            });
            describe('when updating metadata', ()=>{
                it('should merge data,',async ()=>{
                    const image = await imageService.createImage(imageInput);
                    let payloadToUpdate = JSON.parse(JSON.stringify(imageInput))
                    payloadToUpdate.metadata = {
                        key2: 23,
                        key3: true
                    }
                    let {body} = await supertest(app).put(`/images/${image._id}`).set("Authorization", `Bearer ${jwt}`).send(payloadToUpdate)
                    let expectedMetaData = {
                        key: "value",
                        key2: 23,
                        key3: true
                    }
                    expect(body.metadata).toEqual(expectedMetaData);
                })
            })
        })
    })

    describe('get image combinations',()=>{
        describe('when there are no images',()=>{
            it('should return 200 with empty array', async()=> {
                let {statusCode,body} = await supertest(app).get(`/images/combinations/0`).set("Authorization", `Bearer ${jwt}`)

                expect(statusCode).toBe(200);
                expect(body).toEqual([]);
            });
        })
        describe('when there are images',()=>{
            describe('when length is greater than images count',()=>{
                it('should return 200 with empty array', async()=> {
                    await imageService.createImage(imageInput);
                    let {statusCode,body} = await supertest(app).get(`/images/combinations/2`).set("Authorization", `Bearer ${jwt}`)
                    expect(statusCode).toBe(200);
                    expect(body).toEqual([]);
                });
            })
            describe('when length is in valid range',()=>{
                it('should return 200 with list of combinations', async()=> {
                    let thirdImageInput = JSON.parse(JSON.stringify(imageInput))
                    thirdImageInput.name = 'y-third-image'
                    await imageService.createImage(imageInput);
                    await imageService.createImage(anotherImageInput);
                    await imageService.createImage(thirdImageInput);
                    let {statusCode,body} = await supertest(app).get(`/images/combinations/2`).set("Authorization", `Bearer ${jwt}`)
                    expect(statusCode).toBe(200);
                    expect(body.length).toBe(3);
                });
            })
        })
    })
})




