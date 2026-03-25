import React from "react";
import RepairTimeline from "@/components/repair/RepairTimeline";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockRepairs = [
  {
    id: "1",
    date: "Mar 15, 2026",
    workshopName: "Lagos Auto Center",
    serviceType: "Engine Overhaul",
    description: "Complete engine disassembly, cleaning, and replacement of worn-out pistons and gaskets. Performance tested on dyno.",
    odometer: "125,430",
    status: "completed" as const,
  },
  {
    id: "2",
    date: "Jan 20, 2026",
    workshopName: "Abuja Quick Fix",
    serviceType: "Brake System Service",
    description: "Replacement of front and rear brake pads. Brake fluid flush and system bleeding. Rotor resurfacing.",
    odometer: "118,200",
    status: "completed" as const,
  },
  {
    id: "3",
    date: "Nov 05, 2025",
    workshopName: "Ibadan Motors",
    serviceType: "Suspension Repair",
    description: "Front shock absorber replacement and wheel alignment. Bushing inspection and lubrication.",
    odometer: "105,600",
    status: "completed" as const,
  },
];

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-deep-slate">Vehicle History</h2>
        <p className="text-slate-500">Comprehensive repair records for VIN: 1HGCM82633A004352</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <Input className="pl-10" placeholder="Search repairs..." />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter size={18} />
          Filter
        </Button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <RepairTimeline repairs={mockRepairs} />
      </div>
    </div>
  );
}
