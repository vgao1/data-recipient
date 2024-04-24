import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface TraceabilityCredentialsDoc extends BaseDoc {
  data_subject: ObjectId;
  db_srv: string;
  db_username: string;
  db_password: string;
}

export default class TraceabilityConcept {
  public readonly traceabilityCredentials = new DocCollection<TraceabilityCredentialsDoc>("traceability-credentials");

  async addCredentials(data_subject: ObjectId, db_srv: string, db_username: string, db_password: string) {
    const _id = await this.traceabilityCredentials.createOne({ data_subject, db_srv, db_username, db_password });
    return { msg: "Traceability Credentials successfully added!", record: await this.traceabilityCredentials.readOne({ _id }) };
  }

  async getCredentials(data_subject: ObjectId) {
    const record = await this.traceabilityCredentials.readOne({ data_subject });
    return record;
  }
}
