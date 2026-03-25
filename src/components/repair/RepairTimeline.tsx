import React from "react";
import { 
  Calendar, 
  MapPin, 
  Wrench, 
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RepairEvent {
  id: string;
  date: string;
  workshopName: string;
  serviceType: string;
  description: string;
  odometer: string;
  status: "completed" | "in-progress";
}

interface RepairTimelineProps {
  repairs: RepairEvent[];
}

export default function RepairTimeline({ repairs }: RepairTimelineProps) {
  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      {repairs.map((repair, index) => (
        <div key={repair.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-trust-green text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <Wrench size={18} />
          </div>
          
          {/* Content */}
          <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar size={14} />
                  <span>{repair.date}</span>
                </div>
                <Badge variant={repair.status === "completed" ? "default" : "secondary"} className={repair.status === "completed" ? "bg-trust-green" : ""}>
                  {repair.status === "completed" ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Completed
                    </span>
                  ) : "In Progress"}
                </Badge>
              </div>
              
              <h3 className="font-bold text-deep-slate mb-1">{repair.serviceType}</h3>
              <div className="flex items-center gap-1 text-sm font-medium text-trust-green mb-3">
                <MapPin size={14} />
                <span>{repair.workshopName}</span>
              </div>
              
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                {repair.description}
              </p>
              
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs font-mono text-slate-500">Odometer: {repair.odometer} km</span>
                <button className="text-xs font-semibold text-trust-green flex items-center gap-1 hover:underline">
                  View Details
                  <ChevronRight size={12} />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
