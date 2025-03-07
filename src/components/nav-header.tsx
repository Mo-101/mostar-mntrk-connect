
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, Settings, LifeBuoy, LineChart, MapPin, Database, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function NavHeader() {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const routes = [
    { 
      name: 'Dashboard', 
      path: '/',
      icon: <LineChart className="h-5 w-5" />
    },
    { 
      name: 'Map', 
      path: '/map',
      icon: <MapPin className="h-5 w-5" />
    },
    { 
      name: 'Data', 
      path: '/data',
      icon: <Database className="h-5 w-5" />
    },
    { 
      name: 'Training', 
      path: '/training',
      icon: <PlusCircle className="h-5 w-5" />
    },
    { 
      name: 'Settings', 
      path: '/settings',
      icon: <Settings className="h-5 w-5" />
    },
  ];

  return (
    <header className="bg-[#0D1326] border-b border-[#2A324B]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="text-xl font-bold text-white mr-8 flex items-center"
          >
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center mr-2">
              <span className="text-white font-bold">M</span>
            </div>
            <span>Mastomys</span>
          </Link>
          
          <nav className="hidden md:flex space-x-1">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={cn(
                  "px-3 py-2 text-sm rounded-md flex items-center transition-colors",
                  location.pathname === route.path
                    ? "bg-[#1C2333] text-white"
                    : "text-gray-400 hover:text-white hover:bg-[#1C2333]/70"
                )}
              >
                {route.icon}
                <span className="ml-2">{route.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex items-center text-gray-400 hover:text-white"
          >
            <LifeBuoy className="h-5 w-5 mr-1" />
            <span>Help</span>
          </Button>
          
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] bg-[#0D1326] border-r border-[#2A324B] p-0">
              <div className="flex justify-between items-center p-4 border-b border-[#2A324B]">
                <div className="text-xl font-bold text-white flex items-center">
                  <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center mr-2">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <span>Mastomys</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col p-2">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    to={route.path}
                    onClick={() => setIsDrawerOpen(false)}
                    className={cn(
                      "px-3 py-2 text-sm rounded-md flex items-center my-1 transition-colors",
                      location.pathname === route.path
                        ? "bg-[#1C2333] text-white"
                        : "text-gray-400 hover:text-white hover:bg-[#1C2333]/70"
                    )}
                  >
                    {route.icon}
                    <span className="ml-2">{route.name}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-4 mt-auto border-t border-[#2A324B]">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-gray-400 hover:text-white"
                >
                  <LifeBuoy className="h-5 w-5 mr-2" />
                  <span>Help & Support</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
