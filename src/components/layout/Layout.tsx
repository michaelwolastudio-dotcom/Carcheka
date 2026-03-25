import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  User, 
  Menu, 
  X,
  Car,
  LogOut,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const { profile, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["MECHANIC", "SUPER_ADMIN"] },
    { name: "Log New Repair", href: "/new-repair", icon: PlusCircle, roles: ["MECHANIC", "SUPER_ADMIN"] },
    { name: "Vehicle History", href: "/history", icon: History, roles: ["MECHANIC", "SUPER_ADMIN", "GUEST"] },
    { name: "Profile", href: "/profile", icon: User, roles: ["MECHANIC", "SUPER_ADMIN", "GUEST"] },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.roles || (profile && item.roles.includes(profile.role))
  );

  const NavLinks = ({ className }: { className?: string }) => (
    <nav className={cn("flex flex-col gap-2", className)}>
      {filteredNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              isActive 
                ? "bg-trust-green text-white" 
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Icon size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="bg-trust-green p-1.5 rounded-lg">
            <Car className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-deep-slate">Carcheka</h1>
        </div>
        <NavLinks />
        <div className="mt-auto pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
              {profile?.name.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-deep-slate truncate">{profile?.name}</span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Shield size={10} className="text-trust-green" />
                {profile?.role}
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 gap-2"
            onClick={logout}
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="bg-trust-green p-1 rounded-md">
            <Car className="text-white" size={20} />
          </div>
          <span className="font-bold text-deep-slate">Carcheka</span>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <Car className="text-trust-green" size={24} />
              <span className="text-xl font-bold text-deep-slate">Carcheka</span>
            </div>
            <NavLinks />
            <div className="mt-auto pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                  {profile?.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-deep-slate">{profile?.name}</span>
                  <span className="text-xs text-slate-500">{profile?.role}</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 gap-2"
                onClick={logout}
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Global Footer */}
        <footer className="bg-white border-t border-slate-200 p-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <Car size={16} className="text-trust-green" />
              <span className="font-semibold text-deep-slate">Carcheka</span>
              <span>© 2026</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-trust-green transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-trust-green transition-colors">Terms of Service</Link>
              <Link to="/support" className="hover:text-trust-green transition-colors">Support</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
