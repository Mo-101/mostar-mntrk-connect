
import { useState } from "react";
import { Bell, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}
        
        <div className="flex items-center">
          <h1 className="text-xl font-bold tracking-tighter">
            <span className="text-primary">MOSTAR</span> MNTRK
          </h1>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <div className="relative w-full max-w-[300px] md:w-[300px] hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-md bg-background pl-8 md:w-[300px]"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-industrial-alert" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span className="font-medium">Alert:</span> Compressor C2 pressure at critical level
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="font-medium">Maintenance:</span> Scheduled for Pump Unit 3
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="font-medium">System:</span> 2 updates available
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-sm font-medium">MN</span>
          </div>
        </div>
      </div>
      
      {showMobileMenu && isMobile && (
        <div className="border-t p-4 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-md bg-background pl-8"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
