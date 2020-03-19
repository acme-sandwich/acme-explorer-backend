const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);
var actorId = '';
describe("Actor tests", () => {
  it("Get actors", done => {
    chai
      .request(app)
      .get("/api/v1/actors")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  it("Post actor", done => {
    chai
      .request(app)
      .post("/api/v1/actors")
      .send({"role":["EXPLORER"],"name":"NewExplorerName1","surname":"NewExplorerSurname1","email":"explorer@fakemail.com","password":"$2b$05$fMPnmaTx6doE/ISNc/I1leKTQcwAegVmzMP6WtKZ2xKeFP89kOxvO","phone":"+34123456789","address":"myAddress"})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.name).to.equal('NewExplorerName1');
        expect(res.body.role.length).to.equal(1);
        expect(res.body.role[0]).to.equal('EXPLORER');
        actorId = res.body._id;
        if (err) done(err);
        else done();
      });
  });

  it("Get actor with ID", done => {
    chai
      .request(app)
      .get("/api/v1/actors/" + actorId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(actorId);
        expect(res.body.name).to.equal('NewExplorerName1');
        expect(res.body.role.length).to.equal(1);
        expect(res.body.role[0]).to.equal('EXPLORER');
        if (err) done(err);
        else done();
      });
  });

  it("Get non-existing actor with ID", done => {
    chai
      .request(app)
      .get("/api/v1/actors/9e714482b1d63b27181d4989")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });

  it("Update actor with ID", done => {
    chai
      .request(app)
      .put("/api/v1/actors/" + actorId)
      .send({"role":["EXPLORER"],"name":"UpdatedExplorerName1","surname":"UpdatedExplorerSurname1","email":"explorer@fakemail.com","password":"$2b$05$fMPnmaTx6doE/ISNc/I1leKTQcwAegVmzMP6WtKZ2xKeFP89kOxvO","phone":"+34123456789","address":"myAddress"})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(actorId);
        expect(res.body.name).to.equal('UpdatedExplorerName1');
        expect(res.body.role.length).to.equal(1);
        expect(res.body.role[0]).to.equal('EXPLORER');
        if (err) done(err);
        else done();
      });
  });

  it("Update non-existing actor with ID", done => {
    chai
      .request(app)
      .put("/api/v1/actors/9e714482b1d63b27181d4989")
      .send({"role":["EXPLORER"],"name":"UpdatedExplorerName1","surname":"UpdatedExplorerSurname1","email":"explorer@fakemail.com","password":"$2b$05$fMPnmaTx6doE/ISNc/I1leKTQcwAegVmzMP6WtKZ2xKeFP89kOxvO","phone":"+34123456789","address":"myAddress"})
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });

  it("Ban actor with ID", done => {
    chai
      .request(app)
      .put("/api/v1/actors/ban/" + actorId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Actor has been banned successfully');
        if (err) done(err);
        else done();
      });
  });

  it("Ban non-existing actor with ID", done => {
    chai
      .request(app)
      .put("/api/v1/actors/ban/9e714482b1d63b27181d4989")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });

  it("Unban actor with ID", done => {
    chai
      .request(app)
      .put("/api/v1/actors/unban/" + actorId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Actor has been unbanned successfully');
        if (err) done(err);
        else done();
      });
  });
  
  it("Unban non-existing actor with ID", done => {
    chai
      .request(app)
      .put("/api/v1/actors/unban/9e714482b1d63b27181d4989")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });

  it("Delete actor with ID", done => {
    chai
      .request(app)
      .delete("/api/v1/actors/" + actorId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Actor successfully deleted');
        if (err) done(err);
        else done();
      });
  });

  it("Delete non-existing actor with ID", done => {
    chai
      .request(app)
      .delete("/api/v1/actors/9e714482b1d63b27181d4989")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });
});