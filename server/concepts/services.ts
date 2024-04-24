import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface ServiceDoc extends BaseDoc {
  service: string;
  purpose: string;
  data_recipient: ObjectId;
  required_data: Array<string>;
  optional_data: Array<string>;
  logoURL: string;
}

export default class ServiceConcept {
  public readonly services = new DocCollection<ServiceDoc>("services");

  async addService(service: string, purpose: string, data_recipient: ObjectId, required_data: Array<string>, optional_data: Array<string>, logoURL: string) {
    const _id = await this.services.createOne({ service, purpose, data_recipient, required_data, optional_data, logoURL });
    return { msg: "Service successfully created!", post: await this.services.readOne({ _id }) };
  }

  async getServices(query: Filter<ServiceDoc>) {
    const services = await this.services.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return services;
  }
}
