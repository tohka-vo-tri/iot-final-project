import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Smart Door API',
    description: 'API documentation for the smart door system',
  },
  host: 'localhost:8000', // Thay đổi nếu deploy lên server
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  '@/src/routes/auth.routes.ts', 
  '@/src/routes/history.routes.ts', 
];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated!');
});
