const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);
var applicationId = '';
describe("Application tests", () => {
  it("Get applications", done => {
    chai
      .request(app)
      .get("/api/v1/my-applications")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  it("Post application", done => {
    chai
      .request(app)
      .post("/api/v1/my-applications")
      .send({"status":"PENDING","trip":"9e7146c6e95596293c1a2d73","explorer": "9e7146c6e95596293c1a2d73"})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('PENDING');
        applicationId = res.body._id;
        if (err) done(err);
        else done();
      });
  });

  it("Get application with ID", done => {
    chai
      .request(app)
      .get("/api/v1/applications/" + applicationId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(applicationId);
        expect(res.body.status).to.equal('PENDING');
        if (err) done(err);
        else done();
      });
  });

  /*it("Get non-existing application with ID", done => {
    chai
      .request(app)
      .get("/api/v1/applications/9e714482b1d63b27181d4989")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });*/

  it("Update application with ID", done => {
    chai
      .request(app)
      .put("/api/v1/applications/" + applicationId)
      .send({"status":"ACCEPTED","trip":"9e7146c6e95596293c1a2d73","explorer": "9e7146c6e95596293c1a2d73"})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(applicationId);
        expect(res.body.status).to.equal('ACCEPTED');
        if (err) done(err);
        else done();
      });
  });

  /*it("Update non-existing application with ID", done => {
    chai
      .request(app)
      .put("/api/v1/applications/9e714482b1d63b27181d4989")
      .send({"status":"ACCEPTED","trip":"9e7146c6e95596293c1a2d73","explorer": "9e7146c6e95596293c1a2d73"})
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });*/

  it("Get trip applications", done => {
    chai
      .request(app)
      .get("/api/v1/trips/9e714482b1d63b27181d4989/applications")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  it("Cancel application with ID", done => {
    chai
      .request(app)
      .put("/api/v1/applications/" + applicationId)
      .send({"status":"PENDING","trip":"9e7146c6e95596293c1a2d73","explorer": "9e7146c6e95596293c1a2d73"})
      .end((err, res) => {
        chai
          .request(app)
          .put("/api/v1/applications/cancel/" + applicationId)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.message).to.equal('Application has been cancelled successfully');
            if (err) done(err);
            else done();
          });
      });
  });

  it("Cancel non-existing application with ID", done => {
    chai
      .request(app)
      .put("/api/v1/applications/" + applicationId)
      .send({"status":"PENDING","trip":"9e7146c6e95596293c1a2d73","explorer": "9e7146c6e95596293c1a2d73"})
      .end((err, res) => {
        chai
          .request(app)
          .put("/api/v1/applications/cancel/9e7146c6e95596293c1a2d73")
          .end((err, res) => {
            expect(res).to.have.status(404);
            if (err) done(err);
            else done();
          });
      });
  });

  it("Reject application with ID", done => {
    chai
      .request(app)
      .put("/api/v1/applications/" + applicationId)
      .send({"status":"PENDING","trip":"9e7146c6e95596293c1a2d73","explorer": "9e7146c6e95596293c1a2d73"})
      .end((err, res) => {
        chai
          .request(app)
          .put("/api/v1/applications/reject/" + applicationId)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.message).to.equal('Application has been rejected successfully');
            if (err) done(err);
            else done();
          });
      });
  });

  it("Reject non-existing application with ID", done => {
    chai
      .request(app)
      .put("/api/v1/applications/" + applicationId)
      .send({"status":"PENDING","trip":"9e7146c6e95596293c1a2d73","explorer": "9e7146c6e95596293c1a2d73"})
      .end((err, res) => {
        chai
          .request(app)
          .put("/api/v1/applications/reject/9e7146c6e95596293c1a2d73")
          .end((err, res) => {
            expect(res).to.have.status(404);
            if (err) done(err);
            else done();
          });
      });
  });

  it("Due application with ID", done => {
    chai
      .request(app)
      .put("/api/v1/applications/" + applicationId)
      .send({"status":"PENDING","trip":"9e7146c6e95596293c1a2d73","explorer": "9e7146c6e95596293c1a2d73"})
      .end((err, res) => {
        chai
          .request(app)
          .put("/api/v1/applications/due/" + applicationId)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.message).to.equal('Application has been due successfully');
            if (err) done(err);
            else done();
          });
      });
  });

  it("Due non-existing application with ID", done => {
    chai
      .request(app)
      .put("/api/v1/applications/" + applicationId)
      .send({"status":"PENDING","trip":"9e7146c6e95596293c1a2d73","explorer": "9e7146c6e95596293c1a2d73"})
      .end((err, res) => {
        chai
          .request(app)
          .put("/api/v1/applications/due/9e7146c6e95596293c1a2d73")
          .end((err, res) => {
            expect(res).to.have.status(404);
            if (err) done(err);
            else done();
          });
      });
  });

  it("Delete application with ID", done => {
    chai
      .request(app)
      .delete("/api/v1/applications/" + applicationId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Application successfully deleted');
        if (err) done(err);
        else done();
      });
  });

  /*it("Delete non-existing application with ID", done => {
    chai
      .request(app)
      .delete("/api/v1/applications/9e714482b1d63b27181d4989")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });*/
});