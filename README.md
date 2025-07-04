## Pasos para iniciar el proyecto

1. Clona este repositorio:

Ingresa a la ruta donde descargar el proyecto con Power Shell

```bash
git clone https://github.com/fabian1908/Proyecto-Medical.git
```
2. En el terminal crea nuevo contenedor:

```bash
docker run -p 5555:5432 --name e2e-postgres -e POSTGRES_PASSWORD=123 -d postgres
```
3. En el navegador verificar:

```bash
http://localhost:8080/actuator
```

4. Ingresar a la ruta del frontend y en el terminal:

```bash
npm install 
npm run dev 
```
