import request from "supertest"
import { app } from "../src/startup/app"
import appRootPath from "app-root-path"
import dotenv from "dotenv"
import path from "path"
import * as dbHandler from "../src/utils/db-handler"

dotenv.config({ path: path.join(`${appRootPath}`, ".env.test") })

const credentials = {
    "email": "shafaprince2020@gmail.com",
    "password": "aaaa1111"
}

let connectionURI

beforeAll( async function() {
  connectionURI = await dbHandler.getConnectionURI()
  await dbHandler.connect()
})

beforeEach(async () => {

})

afterEach(async function() {
  await dbHandler.clearDatabase()
})

afterAll(async () => {
  await dbHandler.closeDatabase()
})

describe("Auth", () => {

  it("should signup successfully", async function() {
    let agent = request(app).post("/v3/users/signup")
    let response = await agent.send(credentials)
    expect(response.status).toBe(200)
  })

  it("should login successfully", async function() {
    // signup
    let agent = request(app).post("/v3/users/signup")
    let response = await agent.send(credentials)

    // login
    let agent2 = request(app).post("/v3/users/login")
    let response2 = await agent2.send(credentials)
    console.log(response2.body.info)
    expect(response2.status).toBe(200)
  })

})


jest.setTimeout(30000)
