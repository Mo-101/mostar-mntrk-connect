import { Home, BookOpen, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-12 items-center">
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:text-primary transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link
            to="/training"
            className="flex items-center space-x-2 hover:text-primary transition-colors"
          >
            <BookOpen className="h-5 w-5" />
            <span>Training</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center space-x-2 hover:text-primary transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;