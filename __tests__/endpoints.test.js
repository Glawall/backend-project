const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");
const endpoints = require("../endpoints.json");
// const { string } = require("pg-format");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/healthcheck", () => {
  test("GET 200: responds with a 200 status code", () => {
    return request(app).get("/api/healthcheck").expect(200);
  });
});

describe("/api/topics", () => {
  test("GET 200: responds with an array of topic objects, with each object having the properites of slug & description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        let { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("/api", () => {
  test("responds with an object describing all the available endpoints in the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("api/articles/aritcle_id", () => {
  test("GET 200, responds with a sngular article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(1);
        expect(typeof article.title).toBe("string");
        expect(typeof article.author).toBe("string");
        expect(typeof article.body).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.article_img_url).toBe("string");
      });
  });
  test("GET 404: sends an error message when given a valid but non-exists id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body} ) => {
        const { message } = body;
        expect(message).toBe("invalid query");
      });
  });
  test("GET 400: sends an error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not_an_id")
      .expect(400)
      .then(({body} ) => {
        const {message} = body
        expect(message).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: responds with an array of articles with each article having the appropriate key value pairs", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body}) => {
     const {articles} = body
      expect(articles.length).toBe(13)     
      articles.forEach((article) => {
      expect(typeof article.article_id).toBe("number");
      expect(typeof article.title).toBe("string");
      expect(typeof article.author).toBe("string");
      expect(typeof article.comment_count).toBe("string");
      expect(typeof article.created_at).toBe("string");
      expect(typeof article.votes).toBe("number");
      expect(typeof article.topic).toBe("string");
      expect(typeof article.article_img_url).toBe("string");
     })
    })
  })
  test("GET 200: responds with an array of articles with each article having the appropriate key value pairs in descending order from date", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body}) => {
     const {articles} = body
     expect(articles).toBeSortedBy("created_at", {descending: true})
    })
  })
})
