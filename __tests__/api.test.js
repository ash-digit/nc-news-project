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
    })
    test("404: returns a 404 error for an invalid endpoint", () => {
        return request(app)
            .get("/api/invalid-endpoint")  
            .expect(404)
            .then((response) => {
                expect(response.body).toEqual({
                    msg: "Not Found"
                });
            });
    });

    test("400: /api returns a 400 error for invalid query parameters", () => {
        return request(app)
            .get("/api?invalidParam=true")  
            .expect(400)
            .then((response) => {
                expect(response.body).toEqual({ msg: 'Bad Request' });
            });
    });

   
})