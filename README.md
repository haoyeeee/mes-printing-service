# Printing Service

## Env Config

- `VITE_PRINTER_SERVER_URL`: backend server url
- `VITE_AUTH0_*`: `Auth0Provider` configuration, check [this](https://auth0.com/docs/quickstart/spa/react/01-login) for
  details

## Run Locally

```shell
npm run dev
```

## Run in Container

```shell
sudo docker build -t mes-printing-service .
sudo docker run -d --name mes-printing-service \
 -p 5173:5173 \
 -e VITE_PRINTER_SERVER_URL=http://172.32.1.188:8000 \
 -e VITE_AUTH0_DOMAIN=<auth0-domain> \
 -e VITE_AUTH0_CLIENT_ID=<auth0-client-id> \
 -e VITE_AUTH0_AUDIENCE=https://<auth0-domain>/api/v2/ \
 -e VITE_PRINTER_CAMERA_SNAPSHOT_INTERVAL=3000 \
  mes-printing-service
```

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- [tailwindcss](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Router](https://tanstack.com/router/latest)
- [SWR](https://swr.vercel.app/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Husky](https://typicode.github.io/husky/) + [Prettier](https://prettier.io/)
