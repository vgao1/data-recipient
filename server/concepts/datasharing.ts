import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface TraceabilityDoc extends BaseDoc {
  data_subject: ObjectId;
  data_provider: string;
  data_recipient: string;
  description: string;
  service_id: ObjectId;
  data: Array<Record<string, string>>;
}

export interface ProviderDataDoc extends BaseDoc {
  data_provider: string;
  data: Record<string, string>;
  data_subject: ObjectId;
}

export interface ResponseDoc extends BaseDoc {
  data_provider: string;
  data_recipient: string;
  data: Record<string, string>;
  data_subject: ObjectId;
}

export interface RequestDoc extends BaseDoc {
  data_subject: ObjectId;
  data_provider: string;
  data_recipient: string;
  description: string;
  service_id: ObjectId;
  data: Array<Record<string, string>>;
}

export default class DataSharingConcept {
  public readonly recipientTraceabilityRecord = new DocCollection<TraceabilityDoc>("recipient-traceability");
  public readonly providerTraceabilityRecord = new DocCollection<TraceabilityDoc>("provider-traceability");
  public readonly providerData = new DocCollection<ProviderDataDoc>("data-provider");
  public readonly recipientData = new DocCollection<ResponseDoc>("data-recipient");
  public readonly dataRequests = new DocCollection<RequestDoc>("data-request");
  public readonly dataResponses = new DocCollection<ResponseDoc>("data-response");

  async processRequest(data_provider: string) {
    const requests = await this.dataRequests.readMany({});
    for (const request of requests) {
      if (request.data_provider === data_provider) {
        const fields = [];
        for (const field of request.data) {
          fields.push(field.category);
        }
        const data_recipient = request.data_recipient;
        const data_subject = request.data_subject;
        const providerData = await this.providerData.readOne({ data_subject, data_provider });
        if (providerData) {
          const data: Record<string, string> = {};
          for (const field of fields) {
            if (providerData.data[field]) {
              data[field] = providerData.data[field];
            }
          }
          await this.dataResponses.createOne({ data_provider, data_recipient, data, data_subject });
          await this.providerTraceabilityRecord.createOne({ data_provider, data_recipient, data: request.data, data_subject });
          await this.dataRequests.deleteOne({ _id: request._id });
        }
      }
    }
  }

  async processResponse() {
    const responses = await this.dataResponses.readMany({});
    for (const response of responses) {
      const data_provider = response.data_provider;
      const data_recipient = response.data_recipient;
      const data_subject = response.data_subject;
      const response_id = response._id;
      const existingRecipientData = await this.recipientData.readOne({ data_subject, data_provider });
      if (existingRecipientData) {
        await this.recipientData.deleteOne({ _id: existingRecipientData._id });
      }
      await this.recipientData.createOne(response);
      const recordArray: Record<string, string>[] = [];
      Object.keys(response.data).forEach((key) => {
        const record: Record<string, string> = {
          category: key,
        };
        // Push the Record object into the array
        recordArray.push(record);
      });
      await this.recipientTraceabilityRecord.createOne({
        data_provider,
        data_recipient,
        data_subject,
        data: recordArray,
      });
      await this.dataResponses.deleteOne({ _id: response_id });
    }
  }

  async isDataProvider(username: string) {
    if (await this.providerData.readOne({ data_provider: username })) {
      return true;
    } else {
      return false;
    }
  }
}
