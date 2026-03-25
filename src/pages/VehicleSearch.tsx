import React, { useState } from "react";
import { Search, QrCode, ShieldCheck, AlertCircle, Loader2, Sparkles, CheckCircle2, XCircle, Info, Car } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { vinSchema } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  vin: vinSchema,
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface AISuggestion {
  status: "Good" | "Fair" | "Poor";
  summary: string;
  keyPoints: string[];
  recommendation: string;
}

const MOCK_VEHICLES = [
  {
    vin: "1HGCM82633A004352",
    make: "Honda",
    model: "Accord",
    year: 2021,
    repairs: [
      { date: "2024-03-15", type: "Engine Oil Change", workshop: "Lagos Auto Center", odometer: "45,000 km" },
      { date: "2023-11-20", type: "Brake Pad Replacement", workshop: "Abuja Quick Fix", odometer: "38,000 km" },
      { date: "2023-05-10", type: "Tire Rotation", workshop: "Ibadan Motors", odometer: "30,000 km" },
    ]
  },
  {
    vin: "4T1BF1FKXLU958273",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    repairs: [
      { date: "2024-01-10", type: "First Service", workshop: "Toyota Nigeria Ltd", odometer: "5,000 km" },
    ]
  },
  {
    vin: "WDDGF4HB4FA123456",
    make: "Mercedes-Benz",
    model: "C300",
    year: 2015,
    repairs: [
      { date: "2024-02-01", type: "Transmission Repair", workshop: "German Auto Care", odometer: "150,000 km" },
      { date: "2023-12-15", type: "Suspension Overhaul", workshop: "Lagos Auto Center", odometer: "145,000 km" },
      { date: "2023-10-10", type: "Engine Mounts Replacement", workshop: "German Auto Care", odometer: "140,000 km" },
      { date: "2023-08-05", type: "AC Compressor Replacement", workshop: "Quick Fix Abuja", odometer: "135,000 km" },
    ]
  }
];

export default function VehicleSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<typeof MOCK_VEHICLES[0] | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
  });

  const getAISuggestion = async (vehicle: typeof MOCK_VEHICLES[0]) => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this vehicle's repair history and provide a structured health assessment.
        Vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model}
        History: ${JSON.stringify(vehicle.repairs)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING, enum: ["Good", "Fair", "Poor"] },
              summary: { type: Type.STRING },
              keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendation: { type: Type.STRING },
            },
            required: ["status", "summary", "keyPoints", "recommendation"],
          },
        },
      });
      
      if (response.text) {
        setAiSuggestion(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const onSearch = async (data: SearchFormValues) => {
    setIsSearching(true);
    setResult(null);
    setAiSuggestion(null);
    setNotFound(false);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const vehicle = MOCK_VEHICLES.find(v => v.vin === data.vin);
    
    if (vehicle) {
      setResult(vehicle);
      getAISuggestion(vehicle);
    } else {
      setNotFound(true);
    }
    
    setIsSearching(false);
  };

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-trust-green/10 text-trust-green text-sm font-semibold">
          <ShieldCheck size={16} />
          <span>Verified National Database</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-deep-slate tracking-tight">
          Trace Any Vehicle <br />
          <span className="text-trust-green">Repair History</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Enter the 17-digit VIN to access comprehensive maintenance records, 
          verified by registered workshops across Nigeria.
        </p>
      </section>

      {/* Search Bar */}
      <Card className="max-w-3xl mx-auto shadow-xl border-slate-200">
        <CardContent className="p-2 sm:p-4">
          <form onSubmit={handleSubmit(onSearch)} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Search size={20} />
              </div>
              <Input 
                className="pl-10 h-14 text-lg border-none focus-visible:ring-0" 
                placeholder="Enter 17-digit VIN..."
                {...register("vin")}
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-trust-green">
                  <QrCode size={24} />
                </Button>
              </div>
            </div>
            <Button 
              size="lg" 
              className="h-14 px-8 bg-trust-green hover:bg-trust-green/90 text-lg font-bold min-w-[140px]"
              disabled={isSearching}
            >
              {isSearching ? <Loader2 className="animate-spin" /> : "Search"}
            </Button>
          </form>
          {errors.vin && (
            <div className="flex items-center gap-2 mt-2 px-4 text-red-500 text-sm">
              <AlertCircle size={14} />
              <span>{errors.vin.message}</span>
            </div>
          )}
          {notFound && (
            <div className="flex items-center gap-2 mt-2 px-4 text-amber-600 text-sm">
              <AlertCircle size={14} />
              <span>No records found for this VIN in our national database.</span>
            </div>
          )}
          
          {/* Test VINs Quick Access */}
          <div className="mt-6 px-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Test VINs</p>
            <div className="flex flex-wrap gap-2">
              {MOCK_VEHICLES.map((v) => (
                <Button
                  key={v.vin}
                  variant="outline"
                  size="sm"
                  className="text-[10px] h-7 bg-slate-50 hover:bg-trust-green/10 hover:text-trust-green hover:border-trust-green/30"
                  onClick={() => {
                    setValue("vin", v.vin);
                    handleSubmit(onSearch)();
                  }}
                >
                  {v.make} {v.model}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Info */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Car className="text-trust-green" size={20} />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Make / Model</p>
                    <p className="font-semibold text-deep-slate">{result.make} {result.model}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Year</p>
                    <p className="font-semibold text-deep-slate">{result.year}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 uppercase font-bold">VIN</p>
                    <p className="font-mono text-sm font-semibold text-deep-slate">{result.vin}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-2">Recent Repairs</p>
                  <div className="space-y-2">
                    {result.repairs.map((repair, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-slate-600">{repair.type}</span>
                        <span className="text-slate-400">{repair.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestion Module */}
            <Card className="border-none shadow-md bg-white relative overflow-hidden border border-slate-100">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Sparkles size={64} className="text-trust-green" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-trust-green">
                  <Sparkles size={20} />
                  AI Health Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                {isAiLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="animate-spin text-trust-green" size={32} />
                    <p className="text-sm text-slate-500 font-medium">Analyzing repair history...</p>
                  </div>
                ) : aiSuggestion ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                        aiSuggestion.status === "Good" ? "bg-emerald-100 text-emerald-700" :
                        aiSuggestion.status === "Poor" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {aiSuggestion.status} Condition
                      </div>
                      <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {aiSuggestion.summary}
                    </p>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Observations</p>
                      <ul className="space-y-2">
                        {aiSuggestion.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-trust-green shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recommendation</p>
                      <p className="text-sm text-deep-slate font-semibold">
                        {aiSuggestion.recommendation}
                      </p>
                    </div>

                    <p className="text-[10px] text-slate-400 text-center italic">
                      *AI assessment is based on available verified repair logs. Always perform a physical inspection.
                    </p>
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-2">
                    <AlertCircle className="mx-auto text-slate-300" size={32} />
                    <p className="text-sm text-slate-500 italic">Unable to generate assessment. Please check logs manually.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center">
            <Button asChild variant="link" className="text-trust-green font-bold">
              <a href="/history">View Full Detailed Timeline</a>
            </Button>
          </div>
        </div>
      )}

      {/* Stats/Features */}
      {!result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-8">
          {[
            { label: "Registered Workshops", value: "2,500+" },
            { label: "Vehicles Traced", value: "1.2M+" },
            { label: "Verified Repairs", value: "5.8M+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <p className="text-3xl font-bold text-deep-slate">{stat.value}</p>
              <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
