const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');


const protoPath = path.join(__dirname, 'user.proto');
const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.user; 


const client = new userPackage.UserService(
  '127.0.0.1:50051', 
  grpc.credentials.createInsecure()
);

module.exports = client;