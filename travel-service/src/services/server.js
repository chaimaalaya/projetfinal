const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const travelService = require('../handlers');

const PROTO_PATH = '../travel.proto';
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const travelPackage = grpcObject.travel;

async function start() {
  await mongoose.connect('mongodb://127.0.0.1:27017/travel-service');

  const server = new grpc.Server();

  server.addService(travelPackage.TravelService.service, travelService);
  server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
    console.log(' gRPC Travel Service started on port 50052');
    server.start();
  });
}

start();