<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# Ejecutar en desarrollo
  1. Clonar el repositorio
  2. Ejecutar
  ```
  npm install  
  ```
  3. Tener Nest CLI Instalado
  ```
  npm i -g @nestjs/cli
  ```
  4. Levantar Base de datos
  ```
  docker-compose up-d
  ```
  5. Clonar el archivo __.env.template__ y renombrarlo __.env__
  6. Lleanar las variables de entorno en el archivo __.env__
  7. Ejecutar la aplicacion
   ``` 
   npm run start:dev
   ```
  8. Reconstruir base de datos
  ``` 
  https://localhost:3000/api/v2/seed
  ```
## Stack Usado
* MongoDB
* NestJS
