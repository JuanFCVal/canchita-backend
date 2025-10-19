import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Canchita Backend API')
    .setDescription(
      'API para la aplicación móvil de fútbol casual entre amigos',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addTag('auth', 'Endpoints de autenticación')
    .addTag('health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const swaggerSetup = (req: any, res: any, next: any) => {
    const credentials = {
      username: process.env.SWAGGER_USERNAME || 'admin',
      password: process.env.SWAGGER_PASSWORD || 'admin123',
    };

    const auth = req.headers.authorization;

    if (!auth) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Swagger Docs"');
      res.status(401).send('Authentication required');
      return;
    }

    const credentials_encoded = Buffer.from(
      `${credentials.username}:${credentials.password}`,
    ).toString('base64');
    const expected = `Basic ${credentials_encoded}`;

    if (auth !== expected) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Swagger Docs"');
      res.status(401).send('Invalid credentials');
      return;
    }

    next();
  };

  app.use('/docs', swaggerSetup);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Canchita API Documentation',
    customfavIcon: 'https://swagger.io/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
