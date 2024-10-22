const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});
afterAll(() => db.end());

describe(`nc-news`, () => {
  describe("GET /topics", () => {
    test("200: method 'get' /api/topics returns an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const topics = response._body;
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
    test("404:  server cannot find the requested resources", () => {
      return request(app)
        .get("/api/bad-things")
        .expect(404)
        .then((response) => {
          expect(response.status).toBe(404);
          expect(response.notFound).toBe(true);
        });
    });
  });
  describe("GET /api", () => {
    test("200: /api returns an JSON object containing all endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          const apiEndpoints = response.body;

          expect(typeof apiEndpoints).toBe("object");
          expect(apiEndpoints).toHaveProperty("GET /api");
          expect(apiEndpoints).toHaveProperty("GET /api/topics");
          expect(apiEndpoints).toHaveProperty("GET /api/articles");
          expect(apiEndpoints["GET /api"]).toEqual(
            expect.objectContaining({
              description:
                "serves up a json representation of all the available endpoints of the api",
            })
          );
        });
    });
    test("404: returns a 404 error for an invalid endpoint", () => {
      return request(app).get("/api/invalid-endpoint").expect(404);
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("200: /api/articles/:article_id returns an article object relative to article_id provided", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((response) => {
          const article = response.body;
          expect(typeof article).toBe("object");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article.article_id).toBe(2);
        });
    });
    test("400: /api/articles/:article_id(five) returns 400 Bad Request => five != number", () => {
      return request(app)
        .get("/api/articles/five")
        .expect(400)
        .then(({ body } = response) => {
          expect(body.msg).toBe("Bad Request");
          expect(body.status).toBe(400);
        });
    });
    test("404: /api/articles/:article_id(a Nnon existent ID number in DB articles table) returns 404 Not Found (article_id = out of range)", () => {
      return request(app)
        .get("/api/articles/90000")
        .expect(404)
        .then(({ body } = response) => {
          expect(body.msg).toBe("Not Found");
          expect(body.status).toBe(404);
        });
    });
  });
  describe("GET /api/articles", () => {
    test("200: /api/articles returns an array of articles with properties listed in the test ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body } = response) => {
          body.forEach((article) => {
            expect(typeof article).toBe("object");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
            expect(article).not.toHaveProperty("body");
          });
        });
    });
    test("200: /api/articles returns an array of articles with properties listed in the this test ordered by: created_at which is the default behaviour", () => {
      return request(app)
        .get("/api/articles?sortedBy=created_at&orderedBy=DESC")
        .expect(200)
        .then(({ body } = response) => {
          body.forEach((article) => {
            expect(typeof article).toBe("object");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
            expect(article).not.toHaveProperty("body");
          });
        });
    });
    test("200: /api/articles returns an array of articles with properties listed in the this test ordered by: author which is not the default behaviour", () => {
      return request(app)
        .get("/api/articles?sortedBy=author&orderedBy=DESC")
        .expect(200)
        .then(({ body } = response) => {
          body.forEach((article) => {
            expect(typeof article).toBe("object");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
            expect(article).not.toHaveProperty("body");
          });
          for (let i = 0; i < body.length - 1; i++) {
            expect(body[i].author >= body[i + 1].author).toBe(true);
          }
        });
    });
    test("200: /api/articles returns an array of articles with properties listed in the test ordered by: title and sorted inr: ASC ", () => {
      return request(app)
        .get("/api/articles?sortedBy=title&orderedBy=ASC")
        .expect(200)
        .then(({ body } = response) => {
          body.forEach((article) => {
            expect(typeof article).toBe("object");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
            expect(article).not.toHaveProperty("body");
          });
          expect(body[0].title).toBe("A");
          expect(body[body.length - 1].title).toBe("Z");
        });
    });
    test("400: /api/articles sends codeStatus: 400 => wrong queris", () => {
      return request(app)
        .get("/api/articles/?sortedBy=date&orderedBy=ESC")
        .expect(400)
        .then(({ body } = response) => {
          expect(typeof body).toBe("object");
          expect(body.status).toBe(400);
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
  describe("GET /api/articles/articles_id/comments", () => {
    test("200: /api/articles/<--an existing id in articles table-->/comments sends 200 status and an array of comments relative to the article ID", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body } = response) => {
          expect(Array.isArray(body)).toBe(true);
          expect(body.length).toBe(2);
          body.forEach((comment) => {
            expect(typeof comment).toBe("object");
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("article_id");
            expect(comment.article_id).toBe(3);
          });
        });
    });
    test("200: /api/articles/<--an existing id in articles table-->/comments sends 200 status and an ((EMPTY)) array because there is no comments for article with id 37", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body } = response) => expect(Array.isArray(body)).toBe(true));
    });
    test("404: /api/articles/<--a none exsistent id in the article table-->/comments returns 404 status code: Not Found", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body } = request) => {
          expect(typeof body).toBe("object");
          expect(body.status).toBe(404);
          expect(body.msg).toBe("Not Found");
        });
    });
    test("400: /api/articles/<--an invalid parameter (not a number)-->/comments returns 400 status code: Bad Request", () => {
      return request(app)
        .get("/api/articles/two/comments")
        .expect(400)
        .then(({ body } = request) => {
          expect(typeof body).toBe("object");
          expect(body.status).toBe(400);
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("201: updates the votes in the article tabel and returns the updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(201)
        .then(({ body } = respons) => {
          expect(typeof body).toBe("object");
          expect(body.article_id).toBe(1);
          expect(body.votes).toBe(101);
        });
    });
    test("404: /api/articles/<--a non exsistent id in the article table--> returns 404 status code: Not Found", () => {
      return request(app)
        .patch("/api/articles/999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body } = respons) => {
          expect(typeof body).toBe("object");
          expect(body.status).toBe(404);
          expect(body.msg).toBe("Not Found");
        });
    });

    test("400: /api/articles/<--an invalid parameter (not a number)--> returns 400 status code: Bad Request", () => {
      return request(app)
        .patch("/api/articles/one")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body } = respons) => {
          expect(typeof body).toBe("object");
          expect(body.status).toBe(400);
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("400: /api/articles/valid ID returns 400 status code: 400: Not Acceptable because the req.body has a Non Numerical value", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "one" })
        .expect(400)
        .then(({ body } = respons) => {
          expect(typeof body).toBe("object");
          expect(body.status).toBe(400);
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    test("204: /api/articles/a valid ID(number) returns 204", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test("404: /api/articles/<--a non exsistent id in the comment table--> returns 404 status code: Not Found", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then(({ body } = respons) => {
          expect(typeof body).toBe("object");
          expect(body.status).toBe(404);
          expect(body.msg).toBe("Not Found");
        });
    });
    test("400: /api/articles/<--an invalid parameter (not a number)--> returns 400 status code: Bad Request: ", () => {
      return request(app)
        .delete("/api/comments/one")
        .expect(400)
        .then(({ body } = respons) => {
          expect(typeof body).toBe("object");
          expect(body.status).toBe(400);
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("201: /api/articles/:article_id/comments: returns the created commnt", () => {
      const comment = { author: "butter_bridge", body: "You Shall !Not Pass" };
      return request(app)
        .post("/api/articles/3/comments")
        .send(comment)
        .expect(201)
        .then(({ body } = respons) => {
          expect(typeof body).toBe("object");
          expect(body.body).toBe("You Shall !Not Pass");
          expect(body.article_id).toBe(3);
          expect(body).toHaveProperty("votes");
          expect(body).toHaveProperty("author");
          expect(body).toHaveProperty("created_at");
        });
    });
    test("404: /api/articles/:article_id/comments: <--a non exsistent id in the article table--> returns 404 status code: Not Found ", () => {
      const comment = { author: "butter_bridge", body: "You Shall !Not Pass" };
      return request(app)
        .post("/api/articles/3333/comments")
        .send(comment)
        .expect(404);
    });
    test("404: /api/articles/:article_id/comments: <--a non exsistent username in the users tabele--> returns 404 status code: Not Found ", () => {
      const comment = { author: "Dicaprio", body: "You Shall !Not Pass" };
      return request(app)
        .post("/api/articles/3/comments")
        .send(comment)
        .expect(404);
    });
    test("400: /api/articles/:article_id/comments: <--an invalid parameter (not a number)--> returns 400 status code: Bad Request ", () => {
      const comment = { author: "Dicaprio", body: "You Shall !Not Pass" };
      return request(app)
        .post("/api/articles/three/comments")
        .send(comment)
        .expect(400);
    });
  });
  describe("GET /api/users", () => {
    test("200: an array of objects with [{name:'...', username:'...', avatar_url:'...'}]", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body } = users) => {
          expect(Array.isArray(body)).toBe(true);
          body.forEach((user) => {
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
    test("404:  server cannot find the requested resources", () => {
      return request(app)
        .get("/api/bad-things")
        .expect(404)
        .then((response) => {
          expect(response.status).toBe(404);
          expect(response.notFound).toBe(true);
        });
    });
  });
});
