import { Router, getExpressRouter } from "./framework/router";
import { User, WebSession, Service, ConsentRecord, Traceability, DataSharing } from "./app";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import { ObjectId } from "mongodb";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/services")
  async getServices() {
    const services = await Service.getServices({});
    return services;
  }

  @Router.post("/consentrecords")
  async addRecord(session: WebSessionDoc, time: string, description: string, service_id_str: string, data_provider_str: string, data_recipient_str: string, consents: Array<Record<string, string>>) {
    const data_subject = WebSession.getUser(session);
    const service_id = ObjectId.createFromHexString(service_id_str);
    const created = await ConsentRecord.addRecord(time, data_subject, description, service_id, data_provider_str, data_recipient_str, consents);
    return { msg: created.msg, record: created.record };
  }

  @Router.get("/consentrecords")
  async getRecord(session: WebSessionDoc) {
    const userId = WebSession.getUser(session);
    const servicesWithConsent = await ConsentRecord.getRecords({ data_subject: userId });
    return servicesWithConsent.map((service) => service.service_id);
  }

  @Router.delete("/consentrecords/:service_id_str")
  async deleteConsentRecord(session: WebSessionDoc, service_id_str: string) {
    const user = WebSession.getUser(session);
    const service_id = ObjectId.createFromHexString(service_id_str);
    return await ConsentRecord.revokeConsent(user, service_id);
  }

  @Router.get("/traceabilitycredentials")
  async getTraceabilityCredentials(session: WebSessionDoc) {
    const userId = WebSession.getUser(session);
    const record = await Traceability.getCredentials(userId);
    return record;
  }

  @Router.post("/traceabilitycredentials")
  async addTraceabilityCredentials(session: WebSessionDoc, db_srv: string, db_username: string, db_password: string) {
    const userId = WebSession.getUser(session);
    const added = await Traceability.addCredentials(userId, db_srv, db_username, db_password);
    return { msg: added.msg, record: added.record };
  }

  @Router.get("/dataProvider/:username")
  async isDataProvider(username: string) {
    return DataSharing.isDataProvider(username);
  }

  @Router.post("/dataProvider")
  async processDataRequest(username: string) {
    return DataSharing.processRequest(username);
  }

  @Router.post("/dataRecipientAdmin")
  async processDataResponse() {
    return DataSharing.processResponse();
  }

  @Router.post("/addService")
  async addService(service: string, purpose: string, data_provider: string, required_data: Array<string>, optional_data: Array<string>, logoURL: string) {
    return Service.addService(service, purpose, data_provider, "Data Recipient", required_data, optional_data, logoURL);
  }
}

export default getExpressRouter(new Routes());
