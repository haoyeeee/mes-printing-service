import MaLogo from '@/components/ma-logo.tsx';
import { ModeToggle } from '@/components/mode-toggle.tsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.tsx';
import { useUserStore } from '@/lib/states.ts';
import { useAuth0 } from '@auth0/auth0-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card';
import { Link } from '@tanstack/react-router';
import { CircleUser, Menu } from 'lucide-react';
import { useEffect } from 'react';

export default function Navbar() {
  return (
    <header className="sticky top-0 flex h-14 items-center border-b px-4 md:px-10">
      <nav className="hidden gap-4 text-lg md:flex">
        <Link to="/">
          <MaLogo className="mr-4 h-6 w-6" />
        </Link>
        <Link
          to="/"
          className="text-gray-400 transition-colors hover:text-foreground [&.active]:text-foreground"
        >
          Dashboard
        </Link>
        <Link
         to="/job"
         className="text-gray-400 transition-colors hover:text-foreground [&.active]:text-foreground"
        >
         Jobs
        </Link>
        {/* <Link
         to="/filament"
         className="text-gray-400 transition-colors hover:text-foreground [&.active]:text-foreground"
        >
         Filaments
        </Link> */}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <MaLogo className="mr-4 h-6 w-6" />
              <span className="sr-only">Printing Service</span>
            </Link>
            <Link to="/" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link to="/job" className="hover:text-foreground">
              Jobs
            </Link>
            <Link to="/filament" className="hover:text-foreground">
              Filaments
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-10">
        <Profile />
        <ModeToggle />
      </div>
    </header>
  );
}

function Profile() {
  const {
    user,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0();
  const updateUser = useUserStore((state) => state.update);
  const reset = useUserStore((state) => state.reset);

  useEffect(() => {
    const fetchToken = () =>
      getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

    if (user?.sub) {
      fetchToken().then((token) => {
        updateUser(user.sub, token);
      });
    }
  }, [user?.sub, updateUser, getAccessTokenSilently]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-5 w-5 rounded-full"
        >
          {user ? (
            <HoverCard>
              <HoverCardTrigger>
                <Avatar>
                  <AvatarImage src={user.picture} />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent className="relative top-2 rounded-lg border bg-background">
                <p className="p-4">{user.email}</p>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <CircleUser className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(!isAuthenticated || !user) && (
          <DropdownMenuItem
            onClick={() => {
              loginWithRedirect();
            }}
          >
            Login
          </DropdownMenuItem>
        )}
        {/*<DropdownMenuItem>Settings</DropdownMenuItem>*/}
        {/*<DropdownMenuItem>Support</DropdownMenuItem>*/}
        {user && (
          <>
            {/*<DropdownMenuSeparator />*/}
            <DropdownMenuItem
              onClick={() => {
                logout({
                  logoutParams: { returnTo: window.location.origin },
                }).then(() => reset());
              }}
            >
              Logout
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
