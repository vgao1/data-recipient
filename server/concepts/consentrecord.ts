import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface ConsentDoc extends BaseDoc {
  time: string;
  data_subject: ObjectId;
  description: string;
  service_id: ObjectId;
  data_provider: string;
  data_recipient: string;
  consents: Array<Record<string, string>>;
}

export interface RequestDoc extends BaseDoc {
  data_subject: ObjectId;
  data_provider: string;
  data_recipient: string;
  description: string;
  service_id: ObjectId;
  data: Array<Record<string, string>>;
}

export default class ConsentRecordConcept {
  public readonly consentRecords = new DocCollection<ConsentDoc>("consent-record");
  public readonly dataRequests = new DocCollection<RequestDoc>("data-request");

  async addRecord(time: string, data_subject: ObjectId, description: string, service_id: ObjectId, data_provider: string, data_recipient: string, consents: Array<Record<string, string>>) {
    const existingRecord = await this.getRecords({ data_subject, service_id, data_provider, data_recipient });
    let msg = "";
    let record_id = new ObjectId();
    if (existingRecord.length == 0) {
      record_id = await this.consentRecords.createOne({ time, data_subject, description, service_id, data_provider, data_recipient, consents });
      msg = "Consent Record successfully created!";
    } else {
      const firstRecord = existingRecord[0];
      record_id = firstRecord._id;
      await this.consentRecords.updateOne({ _id: record_id }, { consents });
      msg = "Consent Record successfully updated!";
    }
    await this.dataRequests.createOne({ data_subject, data_provider, data_recipient, description, service_id, data: consents });
    return { msg, record: await this.consentRecords.readOne({ record_id }) };
  }

  async getRecords(query: Filter<ConsentDoc>) {
    const records = await this.consentRecords.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return records;
  }

  async revokeConsent(data_subject: ObjectId, service_id: ObjectId) {
    await this.consentRecords.deleteOne({ data_subject, service_id });
    return { msg: "Consent revoked!" };
  }
}
