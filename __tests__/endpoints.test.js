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
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid query");
      });
  });
  test("GET 400: sends an error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not_an_id")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test.only("PATCH 200: updates an articles vote count with a provided body and returns the updated article" , () => {
    const patchBody = {inc_votes: 1}
    return request(app)
    .patch("/api/articles/1")
    .send(patchBody)
    .expect(200)
    .then(({body}) => {
      console.log(body)

        expect(body.article_id).toBe(1);
        expect(typeof body.title).toBe("string");
        expect(typeof body.author).toBe("string");
        expect(typeof body.body).toBe("string");
        expect(typeof body.created_at).toBe("string");
        expect(body.votes).toBe(1);
        expect(typeof body.topic).toBe("string");
        expect(typeof body.article_img_url).toBe("string")
      })
  })
  test.only("PATCH 404 responds with an error when passed a valid but non-existent id", () => {
    const patchBody = {inc_votes: 1}
    return request(app)
    .patch("/api/articles/999")
    .send(patchBody)
    .expect(404)
    .then(({body}) => {
      const {message} = body
      expect(message).toBe("article not found")
    })
  })
  test.only("PATCH 400: sends an error message when given an invalid id", () => {
    const patchBody = {inc_votes: 1}
    return request(app)
      .patch("/api/articles/not_an_id/")
      .send(patchBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test.only("PATCH 404: sends an error message when given an invalid patch object", () => {
    const patchBody = {votes: 1}
    return request(app)
      .patch("/api/articles/1/")
      .send(patchBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: responds with an array of articles with each article having the appropriate key value pairs", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.article_img_url).toBe("string");
        });
      });
  });
  test("GET 200: responds with an array of articles with each article having the appropriate key value pairs in descending order from date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: responds with an array of comments based on article_id provided", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(11);
        body.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.comment_id).toBe("number");
        });
      });
    });
    test("GET 200: responds with an empty array when article_id provided has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({body}) => {
          expect(body).toEqual([]);
        });
    });
  test("GET 200: responds with an array of comments based on article_id provided", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });
  
  test("GET 404: sends an error message when given a valid but non-exists id", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("article not found");
      });
  });
  test("GET 400: sends an error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not_an_id/comments")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test("POST 201: posts a comment on a particular article and returns the posted comment", () => {
    const newComment = {
      username: "lurker",
      body: "What a silly thing to say!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            author: "lurker",
            body: "What a silly thing to say!",
            article_id: 1,
          })
        );
      });
  });
  test("POST 400, responds with an error when passed an object without all appropriate Object keys", () => {
    const newComment = { username: "lurker" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toEqual("Bad request");
      });
  });
  test("POST 400, responds with an error when passed an invalid article_id type", () => {
    const newComment = {
      username: "lurker",
      body: "What a silly thing to say!",
    };
    return request(app)
      .post("/api/articles/not_an_id/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test("POST 404, responds with an error when passed a valid but non-existent id", () => {
    const newComment = {
      username: "lurker",
      body: "What a silly thing to say!",
    };
    return request(app)
      .post("/api/articles/99/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("article not found");
      });
  });
})