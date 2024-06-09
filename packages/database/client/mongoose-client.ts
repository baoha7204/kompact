import mongoose, { ConnectOptions, Mongoose } from "mongoose";

export type MongoDBConfig = {
  uri: string;
  connectOptions?: ConnectOptions;
};

export class MongooseClient {
  private mongoose: Mongoose = mongoose;
  constructor(
    private readonly uri: string,
    private readonly options?: ConnectOptions
  ) {}
  async connect() {
    await this.mongoose.connect(this.uri, this.options);
  }
}
