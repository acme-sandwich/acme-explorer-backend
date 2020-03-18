const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);
var configurationId = '';
describe("Actor tests", () => {
  it("Get configurations", done => {
    chai
      .request(app)
      .get("/api/v1/configurations")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  it("Post configuration", done => {
    chai
      .request(app)
      .post("/api/v1/configurations")
      .send({"sponsorshipRate":5})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.resultsNumberFinder).to.equal(10);
        expect(res.body.resultsTimeFinder).to.equal(1);
        expect(res.body.sponsorshipRate).to.equal(5);
        configurationId = res.body._id;
        if (err) done(err);
        else done();
      });
  });

  it("Get current configuration", done => {
    chai
      .request(app)
      .get("/api/v1/configurations/current")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(configurationId);
        expect(res.body.resultsNumberFinder).to.equal(10);
        expect(res.body.resultsTimeFinder).to.equal(1);
        expect(res.body.sponsorshipRate).to.equal(5);
        if (err) done(err);
        else done();
      });
  });

  it("Update configuration with ID", done => {
    chai
      .request(app)
      .put("/api/v1/configurations/" + configurationId)
      .send({"resultsNumberFinder":15,"resultsTimeFinder":10,"sponsorshipRate":10})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(configurationId);
        expect(res.body.resultsNumberFinder).to.equal(15);
        expect(res.body.resultsTimeFinder).to.equal(10);
        expect(res.body.sponsorshipRate).to.equal(10);
        if (err) done(err);
        else done();
      });
  });

  /*it("Update non-existing configuration with ID", done => {
    chai
      .request(app)
      .put("/api/v1/configurations/9e714482b1d63b27181d4989")
      .send({"resultsNumberFinder":15,"resultsTimeFinder":10,"sponsorshipRate":10})
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });*/

  it("Delete configuration with ID", done => {
    chai
      .request(app)
      .delete("/api/v1/configurations/" + configurationId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Configuration successfully deleted');
        if (err) done(err);
        else done();
      });
  });

  /*it("Delete non-existing configuration with ID", done => {
    chai
      .request(app)
      .delete("/api/v1/configurations/9e714482b1d63b27181d4989")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });*/
});