const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")

beforeEach(()=>{
    return seed(data)
})

afterAll(()=> db.end())

describe(`nc-news`,()=>{
    describe("get-topics", ()=>{
        test("200: method 'get' /api/topics returns an array of topic objects", ()=>{
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then((response)=>{
                const topics = response._body;
                expect(topics.length).toBe(3)
                topics.forEach((topic)=>{
                    expect(topic).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    )
                })
            })
            
        })
    })

    describe("get-topics", ()=>{
        test("404:  server cannot find the requested resource", ()=>{
            return request(app)
            .get("/api/bad-things")
            .expect(404)
            .then((response)=>{
                expect(response.status).toBe(404)
                expect(response.notFound).toBe(true)
            })
        })
    })

   
})