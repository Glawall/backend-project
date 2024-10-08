const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");
const endpoints = require("../endpoints.json");

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
  test("POST 201: responds with the newly created topic, along with", () => {
    const newTopic = {
      slug: "topic name",
      description: "topic description",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        const { topic } = body;
        expect(topic.slug).toBe("topic name");
        expect(topic.description).toBe("topic description");
      });
  });
  test("POST 400: responds with an error when passed an object without corect keys", () => {
    const newTopic = {
      slug: "lurker",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });

  describe("/api/topics/:slug", () => {
    test("GET 200: responds with a singular topic object, with the properites of slug & description", () => {
      return request(app)
        .get("/api/topics/cats")
        .expect(200)
        .then(({ body }) => {
          let { topic } = body;
          expect(topic.slug).toBe("cats");
        });
    });
    test("GET 404: sends an error message when given a valid but non-existent slug", () => {
      return request(app)
        .get("/api/topics/monkey")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("invalid query");
        });
    });
    test.only("GET 400: sends an error message when given an invalid id", () => {
      return request(app)
        .get("/api/topics/7")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("invalid query");
        });
    });
    test("DELETE 204: deletes topic based on slug provided, responds with a status and no content", () => {
      return request(app).delete("/api/topics/cats").expect(204);
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

  describe("api/articles/article_id", () => {
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
    test("GET 200, responds with a singular article object with comment count-included", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toEqual(
            expect.objectContaining({
              article_id: 1,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              title: "Living in the shadow of a great man",
              topic: "mitch",
              votes: 100,
              comment_count: expect.any(Number),
            })
          );
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
    test("PATCH 200: updates an articles vote count with a provided body and returns the updated article", () => {
      const patchBody = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(patchBody)
        .expect(200)
        .then(({ body }) => {
          expect(body.article_id).toBe(1);
          expect(typeof body.title).toBe("string");
          expect(typeof body.author).toBe("string");
          expect(typeof body.body).toBe("string");
          expect(typeof body.created_at).toBe("string");
          expect(body.votes).toBe(101);
          expect(typeof body.topic).toBe("string");
          expect(typeof body.article_img_url).toBe("string");
        });
    });
    test("PATCH 404 responds with an error when passed a valid but non-existent id", () => {
      const patchBody = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/999")
        .send(patchBody)
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("article not found");
        });
    });
    test("PATCH 400: sends an error message when given an invalid id", () => {
      const patchBody = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/not_an_id/")
        .send(patchBody)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Bad request");
        });
    });
    test("PATCH 404: sends an error message when given an invalid patch object", () => {
      const patchBody = { votes: 1 };
      return request(app)
        .patch("/api/articles/1/")
        .send(patchBody)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Bad request");
        });
    });
    test("PATCH 404: sends an error message when given an invalid patch object", () => {
      const patchBody = { inc_votes: "not a number" };
      return request(app)
        .patch("/api/articles/1/")
        .send(patchBody)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Bad request");
        });
    });
    test("DELETE 204: deletes article based on article id provided, responds with a status and no content", () => {
      return request(app).delete("/api/articles/1").expect(204);
    });
    test("DELETE 404: returns error message when valid but non-existent comment id is provided", () => {
      return request(app)
        .delete("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("article not found");
        });
    });
    test("DELETE 400: returns error message when invalid comment-id type is provided", () => {
      return request(app)
        .delete("/api/articles/article_id")
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
          articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.title).toBe("string");
            expect(typeof article.author).toBe("string");
            expect(typeof article.comment_count).toBe("number");
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
    test("GET 200: responds with an array of articles on a specific topic provided in a query", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(1);
          articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.title).toBe("string");
            expect(typeof article.author).toBe("string");
            expect(typeof article.comment_count).toBe("number");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.article_img_url).toBe("string");
          });
        });
    });
    test("GET 404: responds with an error if topic does not exist", () => {
      return request(app)
        .get("/api/articles?topic=not_a_topic")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("topic not found");
        });
    });
    test("GET 200: responds with an empty array if topic exists but there are no articles with that topic", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toEqual([]);
        });
    });
    test("GET 200: responds with an array of articles with each article having the appropriate key value pairs in chosen sort by column", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("votes", { descending: true });
        });
    });
    test("GET 400: respond with an error when passed an invalid sort_by", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid_sort_by")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("invalid query value");
        });
    });
    test("GET 200: responds with an array of articles with each article having the appropriate key value pairs in chosen order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("created_at", { asc: true });
        });
    });
    test("GET 400: responds with an error when passed an invalid order", () => {
      return request(app)
        .get("/api/articles?order=not_an_order")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("invalid query value");
        });
    });
    test("GET 200: responds with an array of articles sset to a certain limit", () => {
      return request(app)
        .get("/api/articles?limit=12")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
        });
    });
    test("GET 200: responds with an array of articles with each article having the appropriate key value pairs paginated to default 10 but query choice with total_count property", () => {
      return request(app)
        .get("/api/articles?limit=12")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
          articles.forEach((article) => {
            expect(article.total_count).toBe(13);
          });
        });
    });
    test("GET 200: responds with an array of articles with each article having the appropriate key value pairs paginated to default 10 and paged", () => {
      return request(app)
        .get("/api/articles?p=2")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(3);
          articles.forEach((article) => {
            expect(article.total_count).toBe(13);
          });
        });
    });
    test("GET 200: responds with an array of articles with each article having the appropriate key value pairs paginated to default users choice and paged at users choice", () => {
      return request(app)
        .get("/api/articles?p=2&limit=5")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(5);
          articles.forEach((article) => {
            expect(article.total_count).toBe(13);
          });
        });
    });
    test("GET 200: responds with an empty array, when page is valid id_type but not enough data for it to exist", () => {
      return request(app)
        .get("/api/articles?p=7")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toEqual([]);
        });
    });
    test("GET 400: responds with an error, when page is invalid id_type", () => {
      return request(app)
        .get("/api/articles?p=not_a_number")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toEqual("Bad request");
        });
    });
    test("GET 400: responds with an error, when limit is invalid id_type", () => {
      return request(app)
        .get("/api/articles?limit=not_a_number")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toEqual("Bad request");
        });
    });
    test("POST 201: responds with the newly created article, along with comment_count", () => {
      const newArticle = {
        author: "lurker",
        title: "new article",
        body: "new article body",
        topic: "cats",
        article_img_url: "image url",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          const { article } = body;
          expect(typeof article.article_id).toBe("number");
          expect(article.title).toBe("new article");
          expect(article.author).toBe("lurker");
          expect(article.comment_count).toBe(0);
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(article.topic).toBe("cats");
          expect(article.article_img_url).toBe("image url");
        });
    });
    test("POST 404: responds with an error when passed an object with an invalid key value for author", () => {
      const newArticle = {
        author: "asinbrick",
        title: "new article",
        body: "new article body",
        topic: "cats",
        article_img_url: "image url",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("username not found");
        });
    });
    test("POST 404: responds with an error when passed an object with an invalid key value for topic", () => {
      const newArticle = {
        author: "lurker",
        title: "new article",
        body: "new article body",
        topic: "new topic",
        article_img_url: "image url",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("topic not found");
        });
    });
    test("POST 400: responds with an error when passed an object without corect keys", () => {
      const newArticle = {
        author: "lurker",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Bad request");
        });
    });
  });

  describe("/api/articles/:article_id/comments", () => {
    test("GET 200: responds with an array of comments based on article_id provided", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(10);
          body.forEach((comment) => {
            expect(comment.article_id).toBe(1);
            expect(typeof comment.body).toBe("string");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.author_avatar_url).toBe("string");
            expect(typeof comment.comment_id).toBe("number");
          });
        });
    });
    test("GET 200: responds with an empty array when article_id provided has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
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
    test("GET 200: responds with an array of articles sset to a certain limit", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=4")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(body.length).toBe(4);
        });
    });
    test("GET 200: responds with an array of comments with each article having the appropriate key value pairs paginated to default 10 and paged", () => {
      return request(app)
        .get("/api/articles/1/comments?p=2")
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(1);
        });
    });
    test("GET 200: responds with an array of comments with each article having the appropriate key value pairs paginated to default 10 and paged", () => {
      return request(app)
        .get("/api/articles/1/comments?p=3")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual([]);
        });
    });
    test("GET 400: responds with an error, when page is invalid id_type", () => {
      return request(app)
        .get("/api/articles/1/comments?p=not_a_number")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toEqual("Bad request");
        });
    });
    test("GET 400: responds with an error, when limit is invalid id_type", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=not_a_number")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toEqual("Bad request");
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
    test("POST 404, responds with an error when passed an invalid username", () => {
      const newComment = {
        username: "asinbrick",
        body: "What a silly thing to say!",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("username not found");
        });
    });
  });

  describe("/api/comments/:comment_id", () => {
    test("DELETE 204: deletes comment based on comment id provided, responds with a status and no content", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test("DELETE 404: returns error message when valid but non-existent comment id is provided", () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("comment not found");
        });
    });
    test("DELETE 400: returns error message when invalid comment-id type is provided", () => {
      return request(app)
        .delete("/api/comments/comment_topic")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Bad request");
        });
    });
    test("PATCH 200: returns an updated comment with votes updated when provided an object with a key of inc_votes and a positive integer and comment_id", () => {
      const patchBody = { inc_votes: 1 };
      return request(app)
        .patch("/api/comments/1")
        .send(patchBody)
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment.comment_id).toBe(1);
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(comment.votes).toBe(17);
          expect(typeof comment.created_at).toBe("string");
        });
    });
    test("PATCH 200: returns an updated comment with votes updated when provided an object with a key of inc_votes and a negative integer and comment_id", () => {
      const patchBody = { inc_votes: -1 };
      return request(app)
        .patch("/api/comments/1")
        .send(patchBody)
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment.comment_id).toBe(1);
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(comment.votes).toBe(15);
          expect(typeof comment.created_at).toBe("string");
        });
    });
    test("PATCH 404 responds with an error when passed a valid but non-existent id", () => {
      const patchBody = { inc_votes: 1 };
      return request(app)
        .patch("/api/comments/999")
        .send(patchBody)
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("comment not found");
        });
    });
    test("PATCH 400: sends an error message when given an invalid id", () => {
      const patchBody = { inc_votes: 1 };
      return request(app)
        .patch("/api/comments/not_an_id/")
        .send(patchBody)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Bad request");
        });
    });
    test("PATCH 404: sends an error message when given an invalid patch object", () => {
      const patchBody = { votes: 1 };
      return request(app)
        .patch("/api/comments/1/")
        .send(patchBody)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Bad request");
        });
    });
    test("PATCH 404: sends an error message when given an invalid patch object", () => {
      const patchBody = { inc_votes: "not a number" };
      return request(app)
        .patch("/api/comments/1/")
        .send(patchBody)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Bad request");
        });
    });
  });

  describe("/api/users", () => {
    test("GET 200: responds with an array of user objects with a usernam, name and avatar property", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
          });
        });
    });
  });

  describe("/api/users/:username", () => {
    test("GET 200: responds with a user object when provided a username", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then(({ body }) => {
          const { user } = body;

          expect(user.username).toEqual("rogersop");
          expect(typeof user.name).toEqual("string");
          expect(typeof user.avatar_url).toEqual("string");
        });
    });
    test("GET 404: responds with an error message when valid but non-existent username provided", () => {
      return request(app)
        .get("/api/users/asinbrick")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("user does not exist");
        });
    });
    test("GET 400: responds with an error message when nonvalid username provided", () => {
      return request(app)
        .get("/api/users/22")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("invalid query");
        });
    });
  });
});
