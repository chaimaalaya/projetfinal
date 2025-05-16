const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');


const protoPath = path.join(__dirname, 'recommendation.proto');
const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const RecommendationPackage = grpcObject.recommendation; 

const client = new RecommendationPackage.RecommendationService(
  '127.0.0.1:50053', 
  grpc.credentials.createInsecure()
);


module.exports = client;