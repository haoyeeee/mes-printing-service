import Navbar from '@/components/navbar.tsx';
import { createRootRoute, Outlet } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex min-h-screen w-full flex-col">
        <Navbar />
        <div className="mx-3 md:mx-6">
          <Outlet />
        </div>
      </div>

      {/*<TanStackRouterDevtools />*/}
    </>
  ),
});
