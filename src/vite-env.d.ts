/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_PRINTER_SERVER_URL: string;
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_AUDIENCE: string;
  readonly VITE_PRINTER_CAMERA_SNAPSHOT_INTERVAL: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
