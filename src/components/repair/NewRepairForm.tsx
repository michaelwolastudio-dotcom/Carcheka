import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Car, 
  Settings, 
  Image as ImageIcon, 
  ChevronRight, 
  ChevronLeft,
  Upload,
  X
} from "lucide-react";
import { repairSchema, type RepairFormValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Vehicle Info", icon: Car },
  { id: 2, title: "Service Details", icon: Settings },
  { id: 3, title: "Media Upload", icon: ImageIcon },
];

export default function NewRepairForm() {
  const [currentStep, setCurrentStep] = React.useState(1);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RepairFormValues>({
    resolver: zodResolver(repairSchema),
    defaultValues: {
      vehicleInfo: { make: "", model: "", plateNumber: "" },
      serviceDetails: { category: "", description: "", odometer: "" },
      media: [],
    },
  });

  const onSubmit = (data: RepairFormValues) => {
    console.log("Form submitted:", data);
    alert("Repair logged successfully!");
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-deep-slate">Log New Repair</h2>
        <p className="text-slate-500">Enter vehicle and service details to record a new repair event.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                  isActive ? "bg-white border-trust-green text-trust-green" : 
                  isCompleted ? "bg-trust-green border-trust-green text-white" : 
                  "bg-white border-slate-200 text-slate-400"
                )}
              >
                <Icon size={20} />
              </div>
              <span className={cn(
                "text-xs font-semibold hidden sm:block",
                isActive ? "text-trust-green" : "text-slate-400"
              )}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="pt-6">
            {/* Step 1: Vehicle Info */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input id="make" placeholder="e.g. Toyota" {...register("vehicleInfo.make")} />
                    {errors.vehicleInfo?.make && <p className="text-xs text-red-500">{errors.vehicleInfo.make.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" placeholder="e.g. Corolla" {...register("vehicleInfo.model")} />
                    {errors.vehicleInfo?.model && <p className="text-xs text-red-500">{errors.vehicleInfo.model.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plate">Plate Number</Label>
                  <Input id="plate" placeholder="e.g. LAG-123-AB" {...register("vehicleInfo.plateNumber")} />
                  {errors.vehicleInfo?.plateNumber && <p className="text-xs text-red-500">{errors.vehicleInfo.plateNumber.message}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Service Details */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label>Service Category</Label>
                  <Select onValueChange={(val: string) => setValue("serviceDetails.category", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engine">Engine Repair</SelectItem>
                      <SelectItem value="electrical">Electrical System</SelectItem>
                      <SelectItem value="suspension">Suspension & Steering</SelectItem>
                      <SelectItem value="brakes">Braking System</SelectItem>
                      <SelectItem value="body">Body Work</SelectItem>
                      <SelectItem value="routine">Routine Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.serviceDetails?.category && <p className="text-xs text-red-500">{errors.serviceDetails.category.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="odometer">Odometer Reading (km)</Label>
                  <Input id="odometer" type="number" placeholder="0" {...register("serviceDetails.odometer")} />
                  {errors.serviceDetails?.odometer && <p className="text-xs text-red-500">{errors.serviceDetails.odometer.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Service Description</Label>
                  <textarea 
                    id="description"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe the work performed..."
                    {...register("serviceDetails.description")}
                  />
                  {errors.serviceDetails?.description && <p className="text-xs text-red-500">{errors.serviceDetails.description.message}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Media Upload */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-4 bg-slate-50">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <Upload className="text-trust-green" size={24} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-deep-slate">Upload Before/After Images</p>
                    <p className="text-sm text-slate-500">Drag and drop or click to select files</p>
                  </div>
                  <Button type="button" variant="outline" className="mt-2">Select Files</Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center relative group">
                      <ImageIcon className="text-slate-300" size={24} />
                      <button className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-6">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft size={18} />
            Back
          </Button>
          
          {currentStep < steps.length ? (
            <Button 
              type="button" 
              onClick={nextStep}
              className="bg-trust-green hover:bg-trust-green/90 gap-2"
            >
              Next
              <ChevronRight size={18} />
            </Button>
          ) : (
            <Button 
              type="submit"
              className="bg-trust-green hover:bg-trust-green/90"
            >
              Submit Repair Log
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
