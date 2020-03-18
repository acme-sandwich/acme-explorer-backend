const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require('mongoose');
const Finder = mongoose.model('Finders');

const { expect } = chai;
chai.use(chaiHttp);
var finderId = '';
var configurationId = '';
describe("Finder tests", () => {
  before(done => {
    chai
      .request(app)
      .post("/api/v1/configurations")
      .send({"sponsorshipRate":5})
      .end((err, res) => {
        configurationId = res.body._id;
        Finder.remove({"explorer": "9e714482b1d63b27181d4989"}, () => {
          if (err) done(err);
          else done();
        });
      });
  });

  after(done => {
    chai
      .request(app)
      .delete("/api/v1/configurations/" + configurationId)
      .end((err, res) => {
        if (err) done(err);
        else done();
      });
  })

  it("Get finders", done => {
    chai
      .request(app)
      .get("/api/v1/actors/9e714482b1d63b27181d4989/finders")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  it("Post finder", done => {
    chai
      .request(app)
      .post("/api/v1/actors/9e714482b1d63b27181d4989/finders")
      .send({"minPrice":12,"explorer":"9e714482b1d63b27181d4989"})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.minPrice).to.equal(12);
        expect(res.body.maxPrice).to.equal(null);
        expect(res.body.explorer).to.equal("9e714482b1d63b27181d4989");
        finderId = res.body._id;
        if (err) done(err);
        else done();
      });
  });

  it("Post finder with no explorer", done => {
    chai
      .request(app)
      .post("/api/v1/actors/9e714482b1d63b27181d4989/finders")
      .send({"minPrice":12})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('Explorer not included');
        if (err) done(err);
        else done();
      });
  });

  it("Get finder with ID", done => {
    chai
      .request(app)
      .get("/api/v1/actors/9e714482b1d63b27181d4989/finders/" + finderId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(finderId);
        expect(res.body.minPrice).to.equal(12);
        expect(res.body.maxPrice).to.equal(null);
        expect(res.body.explorer).to.equal("9e714482b1d63b27181d4989");
        if (err) done(err);
        else done();
      });
  });

  it("Get non-existing finder with ID", done => {
    chai
      .request(app)
      .get("/api/v1/actors/9e714482b1d63b27181d4989/finders/9e714482b1d63b27181d4989")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });

  it("Update finder with ID", done => {
    chai
      .request(app)
      .put("/api/v1/actors/9e714482b1d63b27181d4989/finders/" + finderId)
      .send({"maxPrice":20,"explorer":"9e714482b1d63b27181d4989"})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(finderId);
        expect(res.body.minPrice).to.equal(12);
        expect(res.body.maxPrice).to.equal(20);
        expect(res.body.explorer).to.equal("9e714482b1d63b27181d4989");
        if (err) done(err);
        else done();
      });
  });

  it("Update finder with no explorer", done => {
    chai
      .request(app)
      .put("/api/v1/actors/9e714482b1d63b27181d4989/finders/" + finderId)
      .send({"maxPrice":20})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('Explorer not included');
        if (err) done(err);
        else done();
      });
  });

  it("Update non-existing finder with ID", done => {
    chai
      .request(app)
      .put("/api/v1/actors/9e714482b1d63b27181d4989/finders/9e714482b1d63b27181d4989")
      .send({"maxPrice":20,"explorer":"9e714482b1d63b27181d4989"})
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });
});