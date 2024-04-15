const app = require("../app")
const request = require("supertest")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index.js")

beforeEach(()=> {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

describe("/api/healthcheck", () => {
    test("GET 200: responds with a 200 status code", () => {
        return request(app).get("/api/healthcheck").expect(200)
    })
})

describe("/api/topics", () => {
    test("GET 200: responds with an array of topic objects, with each object having the properites of slug & description", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
           let {topics} = body
           expect(topics.length).toBe(3)
           topics.forEach((topic) => {
            expect(typeof topic.description).toBe("string")
            expect(typeof topic.slug).toBe("string")
           })
        })
    })
})