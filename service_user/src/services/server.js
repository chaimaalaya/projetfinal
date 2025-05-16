const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const userService = require('../handlers');

const PROTO_PATH = '../user.proto';

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.user;

async function start() {
  await mongoose.connect('mongodb://127.0.0.1:27017/user-service');

  const server = new grpc.Server();

  server.addService(userPackage.UserService.service, userService);
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log(' gRPC User Service started on port 50051');
    server.start();
  });
}

start();