const request = require("supertest");
const app = require("../src/app");
var token = "";

test("register user", async () => {
  await request(app)
    .post("/users/register")
    .send({
      name: "Gajanan",
      whatsapp_primary_number: "9867785634",
      whatsapp_secondary_number: "9867785344",
      emergency_number: "9867785699",
      email: "kopegajanan@gmail.com",
      password: "sang@123",
      address: "Pune, Maharashtra, India , 411109",
    })
    .expect(200);
});

test("login user", async () => {
  token = await request(app)
    .post("/users/login")
    .send({
      email: "gajanan.k@prometteur.in",
      password: "sand@1234",
    })
    .expect(200);
});

test("forgot password", async () => {
  await request(app)
    .post("/users/forgot-password")
    .send({
      email: "gajanan.k@prometteur.in",
    })
    .expect(200);
});

test("profile of user", async () => {
  await request(app)
    .get("/users/user_profile")
    .set("Authorization", `${token._body.token}`)
    .send()
    .expect(200);
});

test("update profile of user", async () => {
  await request(app)
    .patch("/users/update_user_profile")
    .set("Authorization", `${token._body.token}`)
    .send({
      name: "My Admin",
    })
    .expect(200);
});

test("get All Packages", async () => {
  await request(app)
    .get("/users/all_packages")
    .set("Authorization", `${token._body.token}`)
    .send()
    .expect(200);
});

test("Purchase Packages", async () => {
  await request(app)
    .post("/users/purchase_package")
    .set("Authorization", `${token._body.token}`)
    .send({
      package_id: "62d4e3c5ce3a556395b461ce",
    })
    .expect(200);
});

test("Select Subcategary", async () => {
  await request(app)
    .patch("/users/select_subcategary")
    .set("Authorization", `${token._body.token}`)
    .send({
      package_id: "62d4e3c5ce3a556395b461ce",
      subcategary_id: "62d53b71e93287d3c040aee5",
    })
    .expect(200);
});

test("User Purchase History", async () => {
  await request(app)
    .get("/users/purchase_history")
    .set("Authorization", `${token._body.token}`)
    .send()
    .expect(200);
});
