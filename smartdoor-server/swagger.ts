import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Smart Door API',
    description: 'API for smart door system',
    version: '1.0.0',
  },
  host: 'localhost:8080', 
  schemes: ['http'],     
};

const outputFile = './swagger-output.json'; 
const endpointsFiles = ['./src/index.ts'];  

swaggerAutogen(outputFile, endpointsFiles, doc);