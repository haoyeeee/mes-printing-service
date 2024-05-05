import axios, { AxiosInstance } from 'axios';
import useSWR from 'swr';

export enum PrinterApi {
  Mock = 'Mock',
  OctoPrint = 'OctoPrint',
  Prusa = 'Prusa',
}

export interface Printer {
  id: number;
  url: string;
  api_key: string;
  opcua_name: string;
  api: PrinterApi;
  is_active: boolean;
}

export interface PrinterTemperature {
  actual: number;
  target: number;
}

export interface PrinterJob {
  id: number;
  file_path: string;
  progress: number;
  time_used: number;
  time_left: number;
  time_approx: number | null;
  previewed_model_url: string | null;
}

export interface PrinterState {
  name: string;
  model: string;
  camera_url: string;
  state: string;
  temp_bed: PrinterTemperature;
  temp_nozzle: PrinterTemperature;
  job: PrinterJob;

  isReady: boolean;
  isPrinting: boolean;
  isError: boolean;
  thumbnail_url: string | null;
}

export type PrinterId = Pick<Printer, 'id'>;
export type CreatePrinter = Pick<
  Printer,
  'url' | 'api_key' | 'opcua_name' | 'api'
>;

const _axios: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PRINTER_SERVER_URL,
});

async function getFetcher<T>(url: string) {
  const resp = await _axios.get<T>(url);
  return resp.data;
}

export async function createPrinter(
  accessToken: string,
  printer: CreatePrinter,
) {
  const resp = await _axios.post<PrinterId>('/api/v1/printers', printer, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return resp.data;
}

export function usePrinterState(printerName: string) {
  const { data, error, isLoading } = useSWR(
    `/api/v1/printers/opcua/${printerName}/status`,
    getFetcher<PrinterState>,
    { refreshInterval: 5000 },
  );

  if (data) {
    data.isPrinting = data.state === 'printing';
    data.isReady = data.state === 'ready';
    data.isError = data.state === 'error';
    data.thumbnail_url = data?.job?.previewed_model_url;

    if (data.camera_url) {
      data.camera_url = `${import.meta.env.VITE_PRINTER_SERVER_URL}/api/v1/printers/opcua/${data.name}/camera/snapshot`;
    }
  }

  return {
    state: data,
    isLoading,
    error,
  };
}

export function usePrinters() {
  const { data, error, isLoading } = useSWR(
    '/api/v1/printers',
    getFetcher<Printer[]>,
  );

  return {
    printers: data,
    isLoading,
    error,
  };
}




// For testing. Should be replaced. 
export interface Filament {
  id: string;
  supplier: string;
  material: string;
  colour: string;
  netMaterial: number;
  barcode: string;
  allocatedTo: string;
  openedBy: string;
  openedOn: string;
  weight: number;
  product?: number;
  waste?: number;
  total?: number;
}

export const filamentData = [
  { id: '001', supplier: 'Fashion 3D', material: 'PLA+', colour: 'Blue', netMaterial: 1000, barcode: '6102081', allocatedTo: 'MA (Warman Sri)', openedBy: 'Sri', openedOn: '07/04/2024 12:50:55', weight: 1112 },
  { id: '002', supplier: 'Fashion 3D', material: 'PLA+', colour: 'Purple', netMaterial: 1000, barcode: '18102091', allocatedTo: 'MA (Warman Marcus)', openedBy: 'Marcus', openedOn: '06/04/2024 13:01:14', weight: 1129 },
  { id: '003', supplier: 'Fashion 3D', material: 'PLA+', colour: 'Purple', netMaterial: 1000, barcode: '18102091', allocatedTo: 'MA (Warman Marcus)', openedBy: 'Marcus', openedOn: '06/04/2024 13:08:44', weight: 1117 },
  { id: '004', supplier: 'Fashion 3D', material: 'PLA+', colour: 'Purple', netMaterial: 1000, barcode: '18102091', allocatedTo: 'MA (Warman Marcus)', openedBy: 'Marcus', openedOn: '06/04/2024 14:37:40', weight: 1128 },
  { id: '005', supplier: 'Fashion 3D', material: 'PLA+', colour: 'Orange', netMaterial: 1000, barcode: '6102041', allocatedTo: 'Yevan/Billy', openedBy: 'Yevan/Billy', openedOn: '17/04/2024 11:36:48', weight: 1113 },
  { id: '006', supplier: 'Fashion 3D', material: 'PLA+', colour: 'White', netMaterial: 1000, barcode: '1510202A', allocatedTo: 'Manu', openedBy: 'Manu', openedOn: '11/04/2024 19:50:40', weight: 1125, product: 54, waste: 5.5, total: 59.5 }
];