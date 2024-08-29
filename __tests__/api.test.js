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
    describe("get-api", ()=>{
        test("200: /api returns an JSON object containing all endpoints", ()=>{
            return request(app)
            .get("/api")
            .expect(200)
            .then((response)=>{
                const apiEndpoints = response.body;

                expect(typeof apiEndpoints).toBe('object');
                expect(apiEndpoints).toHaveProperty("GET /api");
                expect(apiEndpoints).toHaveProperty("GET /api/topics");
                expect(apiEndpoints).toHaveProperty("GET /api/articles");
                expect(apiEndpoints["GET /api"]).toEqual(
                    expect.objectContaining({
                        description: "serves up a json representation of all the available endpoints of the api"
                    })
                );

            })
        })
        test("404: returns a 404 error for an invalid endpoint", () => {
            return request(app)
                .get("/api/invalid-endpoint")  
                .expect(404)  
        });
    })
    describe("GET /api/articles/:article_id", ()=>{
        test("200: /api/articles/:article_id returns an article object relative to article_id provided", ()=>{
            return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then((response) => {
                const article = response.body[0]
                expect(typeof article).toBe("object")
                expect(article).toHaveProperty("author")
                expect(article).toHaveProperty("title")
                expect(article).toHaveProperty("article_id")
                expect(article).toHaveProperty("body")
                expect(article).toHaveProperty("topic")
                expect(article).toHaveProperty("created_at")
                expect(article).toHaveProperty("votes")
                expect(article).toHaveProperty("article_img_url")
            })
        })
        test("404: /api/articles/:article_id(90000) returns 404 Not Found (article_id = out of range)", ()=>{
            return request(app)
            .get("/api/articles/90000")
            .expect(404)
            .then((response)=>{
               expect(response.body.msg).toBe("404 Not Found")
               expect(response.body.status).toBe(404)
            })
        })
    }) 
})