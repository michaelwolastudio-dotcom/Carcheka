import React from "react";
import { 
  TrendingUp, 
  Users, 
  Car, 
  Wrench, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  ShieldCheck,
  FileText,
  Settings,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { profile } = useAuth();

  const stats = [
    { label: "Total Repairs", value: "142", icon: Wrench, trend: "+12%", trendUp: true },
    { label: "Active Vehicles", value: "86", icon: Car, trend: "+5%", trendUp: true },
    { label: "Pending Tasks", value: "12", icon: AlertTriangle, trend: "-2%", trendUp: false },
    { label: "Workshop Staff", value: "8", icon: Users, trend: "0%", trendUp: true },
  ];

  const adminPortals = [
    { name: "Workshop Verification", icon: ShieldCheck, color: "bg-emerald-50 text-emerald-600", href: "/admin/workshops" },
    { name: "User Management", icon: Users, color: "bg-blue-50 text-blue-600", href: "/admin/users" },
    { name: "System Audit Logs", icon: Activity, color: "bg-slate-50 text-slate-600", href: "/admin/audit" },
    { icon: FileText, name: "National Reports", color: "bg-orange-50 text-orange-600", href: "/admin/reports" },
    { name: "System Settings", icon: Settings, color: "bg-purple-50 text-purple-600", href: "/admin/settings" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-deep-slate">Welcome back, {profile?.name.split(' ')[0]}</h2>
          <p className="text-slate-500 mt-1">
            {profile?.role === 'MECHANIC' 
              ? `Managing repairs for ${profile.workshopName || 'your workshop'}`
              : 'National vehicle repair overview and tracking'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/history">
              <Search size={18} />
              Search Vehicle
            </Link>
          </Button>
          {profile?.role !== 'GUEST' && (
            <Button asChild className="bg-trust-green hover:bg-trust-green/90 gap-2">
              <Link to="/new-repair">
                <Plus size={18} />
                New Repair
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Administrative Portals Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-deep-slate flex items-center gap-2">
          <Settings size={20} className="text-slate-400" />
          Administrative Portals
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {adminPortals.map((portal) => {
            const Icon = portal.icon;
            return (
              <Button
                key={portal.name}
                variant="outline"
                asChild
                className="h-auto py-6 flex flex-col gap-3 border-none shadow-sm hover:shadow-md transition-all bg-white"
              >
                <Link to={portal.href}>
                  <div className={cn("p-3 rounded-xl", portal.color)}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 text-center">{portal.name}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Icon size={20} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? "text-emerald-600" : "text-rose-600"}`}>
                    {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {stat.trend}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-deep-slate">{stat.value}</p>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Repair Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-trust-green/10 flex items-center justify-center text-trust-green">
                      <Car size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-deep-slate">Toyota Corolla (LAG-123-AB)</p>
                      <p className="text-xs text-slate-500">Engine Oil Change • 2 hours ago</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-trust-green border-trust-green">Completed</Badge>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-4 text-trust-green" asChild>
              <Link to="/history">View All Activity</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Workshop Performance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="58" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                <circle cx="64" cy="64" r="58" fill="transparent" stroke="#059669" strokeWidth="12" strokeDasharray="364.4" strokeDashoffset="54.6" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-deep-slate">85%</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Efficiency</span>
              </div>
            </div>
            <div className="mt-6 space-y-2 w-full">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Service Quality</span>
                <span className="font-bold text-deep-slate">4.8/5.0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Turnaround Time</span>
                <span className="font-bold text-deep-slate">1.2 Days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
