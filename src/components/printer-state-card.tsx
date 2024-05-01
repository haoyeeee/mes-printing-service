import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import {
  PrinterState,
  PrinterTemperature,
  usePrinterState,
} from '@/lib/api.ts';
import { cn } from '@/lib/utils.ts';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { TimedImage } from 'react-timed-image';

interface TempThreshold {
  yellow: number;
  red: number;
}

const tempThreshold: { bed: TempThreshold; nozzle: TempThreshold } = {
  bed: {
    yellow: 30,
    red: 60,
  },
  nozzle: {
    yellow: 60,
    red: 230,
  },
};

function endTime(seconds: number): string {
  const t = dayjs().add(seconds, 'second');
  return t.format('D MMM, HH:ss');
}

function MetricName({ className, children }: React.ComponentProps<'span'>) {
  return <span className={cn('text-[18px]', className)}>{children}</span>;
}

function Metric({ className, children }: React.ComponentProps<'div'>) {
  return <div className={cn('', className)}>{children}</div>;
}

function CurrentState({
  className,
  state,
}: React.ComponentProps<'h3'> & {
  state: PrinterState;
}) {
  return (
    <h3
      className={cn(
        'text-green-600',
        state.isPrinting && 'text-blue-500',
        state.isError && 'text-red-600',
        className,
      )}
    >
      {state.state} {state.isPrinting && ` ${state.job.progress.toFixed(2)}%`}
    </h3>
  );
}

function Temperature({
  className,
  threshold,
  temp,
}: React.ComponentProps<'span'> & { temp: number; threshold: TempThreshold }) {
  return (
    <span
      className={cn(
        'text-green-600',
        temp >= threshold.yellow && 'text-yellow-500',
        temp >= threshold.red && 'text-red-600',
        className,
      )}
    >
      {temp}℃
    </span>
  );
}

function PartTemperature({
  temp,
  threshold,
  isPrinting,
}: {
  temp: PrinterTemperature;
  threshold: TempThreshold;
  isPrinting: boolean;
}) {
  return (
    <p>
      <Temperature temp={temp.actual} threshold={threshold} />{' '}
      {isPrinting && (
        <>
          <span>→ </span>{' '}
          <Temperature temp={temp.target} threshold={threshold} />
        </>
      )}
    </p>
  );
}

function PrinterCamera({
  printerName,
  showCamera,
}: {
  printerName: string;
  showCamera: boolean;
}) {
  const { state, isLoading, error } = usePrinterState(printerName);

  if (isLoading || error || !state) {
    return (
      <div>
        <Skeleton className="min-h-[180px] w-full rounded-xl" />
      </div>
    );
  }

  if (!state.isPrinting || !state.thumbnail_url || showCamera) {
    return (
      <TimedImage
        src={state.camera_url}
        alt={`camera of ${state.name}`}
        interval={1000}
      />
    );
  } else {
    return (
      <img src={state.thumbnail_url} alt={`job thumbnail of ${state.name}`} />
    );
  }
}

export default function PrinterStateCard({
  printerName,
}: {
  printerName: string;
}) {
  const { state, isLoading, error } = usePrinterState(printerName);
  const [showCamera, setShowCamera] = useState<boolean>(true);

  if (isLoading || error || !state) {
    return (
      <div>
        <Skeleton className="min-h-[300px] w-full rounded-xl" />
      </div>
    );
  }
  return (
    <Card
      className="p-6 dark:bg-slate-900"
      onClick={() => setShowCamera((state) => !state)}
    >
      <CardHeader className="flex-row content-center items-center justify-between p-0 text-xl font-bold capitalize md:text-2xl">
        <h3>
          {printerName} ({state.model})
        </h3>
        <CurrentState state={state} />
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 p-0 pt-6 md:grid-cols-2">
        <div
          className="grid grid-cols-1 gap-2 text-left"
          aria-label="metrics container"
        >
          <Metric>
            <MetricName>Nozzle Temp</MetricName>
            <PartTemperature
              temp={state.temp_nozzle}
              threshold={tempThreshold.nozzle}
              isPrinting={state.isPrinting}
            />
          </Metric>

          <Metric>
            <MetricName>Bed Temp</MetricName>
            <PartTemperature
              temp={state.temp_bed}
              threshold={tempThreshold.bed}
              isPrinting={state.isPrinting}
            />
          </Metric>

          {state.isPrinting && (
            <Metric>
              <MetricName>Job File</MetricName>
              <p className="text-wrap break-words text-[12px]">
                {state.job.file_path}
              </p>
            </Metric>
          )}

          {state.isPrinting && (
            <Metric>
              <MetricName>Estimated End</MetricName>
              <p>{endTime(state.job.time_left)}</p>
            </Metric>
          )}
        </div>

        <PrinterCamera printerName={printerName} showCamera={showCamera} />
      </CardContent>
    </Card>
  );
}
