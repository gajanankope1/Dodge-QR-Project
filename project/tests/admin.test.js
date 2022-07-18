const request = require("supertest");
const app = require("../src/app");
var token = "";

test("Create Admin", async () => {
  await request(app)
    .post("/admin/create-admin")
    .send({
      name: "Gajanan",
      mobile_number: "9867785699",
      email: "kopegajanan@gmail.com",
      password: "sang@123",
      address: "Pune, Maharashtra, India , 411109",
    })
    .expect(200);
});

test("login Admin", async () => {
  token = await request(app)
    .post("/admin/login")
    .send({
      email: "gajanan.k@prometteur.in",
      password: "admin@123",
    })
    .expect(200);
});

test("forgot password", async () => {
  await request(app)
    .post("/admin/forgot-password")
    .send({
      email: "gajanan.k@prometteur.in",
    })
    .expect(200);
});

test("profile of Admin", async () => {
  await request(app)
    .get("/admin/admin_profile")
    .set("Authorization", `${token._body.token}`)
    .send()
    .expect(200);
});

test("update profile of Admin", async () => {
  await request(app)
    .patch("/admin/admin_update_profile")
    .set("Authorization", `${token._body.token}`)
    .send({
      name: "My Admin",
    })
    .expect(200);
});

test("get All Packages", async () => {
  await request(app).get("/admin/all_packages").send().expect(200);
});

test("Add Package", async () => {
  await request(app)
    .post("/admin/add_package")
    .send({
      package: "30",
      price: "200",
      message: "true",
      call: "false",
    })
    .expect(200);
});

test("update Package", async () => {
  await request(app)
    .patch("/admin/update_package")
    .send({
      package: "30",
      price: "200",
      message: "false",
      call: "false",
    })
    .expect(200);
});

test("Delete Package", async () => {
  await request(app)
    .delete("/admin/delete_package")
    .send({
      package: "30",
    })
    .expect(200);
});

test("All messages", async () => {
  await request(app).get("/admin/all_messages").send().expect(200);
});

test("Add Message", async () => {
  await request(app)
    .post("/admin/add_message")
    .send({
      message: "your bike is in no parking",
    })
    .expect(200);
});

test("update Message", async () => {
  await request(app)
    .patch("/admin/update_message")
    .send({
      id: "62d538933443f12bc198751f",
      message: "your bik is good",
    })
    .expect(200);
});

test("Delete Message", async () => {
  await request(app)
    .delete("/admin/delete_message")
    .send({
      message: "your bik is good",
    })
    .expect(200);
});

test("All Subcategaries", async () => {
  await request(app).get("/admin/view_subcategaries").send().expect(200);
});

test("Add SubCategary", async () => {
  await request(app)
    .post("/admin/add_subcategary")
    .send({
      title: "car",
      type: "movable",
      messages: [
        {
          _id: "62d4e437ce3a556395b461d5",
        },
        {
          _id: "62d4e446ce3a556395b461d7",
        },
        {
          _id: "62d4e456ce3a556395b461d9",
        },
      ],
    })
    .expect(200);
});

test("update Subcategary", async () => {
  await request(app)
    .patch("/admin/update_subcategary")
    .send({
      id: "62d53b71e93287d3c040aee5",
      title: "laptop",
    })
    .expect(200);
});

test("Delete Subcategary", async () => {
  await request(app)
    .delete("/admin/delete_subcategary")
    .send({
      _id: "62d53b71e93287d3c040aee5",
    })
    .expect(200);
});

test("All Users", async () => {
  await request(app).get("/admin/all_users").send().expect(200);
});

test("Delete User", async () => {
  await request(app)
    .delete("/admin/delete_user")
    .send({
      _id: "62d4e53fce3a556395b461e1",
    })
    .expect(200);
});
