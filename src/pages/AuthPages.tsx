import React from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Shield, CheckCircle, Globe, Wrench, Loader2, Search } from "lucide-react";
import { motion } from "motion/react";
import { Navigate, Link } from "react-router-dom";

export default function AuthPages() {
  const { user, login, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-trust-green" size={48} />
        <p className="text-slate-500 font-medium animate-pulse">Verifying Identity...</p>
      </div>
    );
  }

  if (user) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Side: Branding & Info */}
      <div className="lg:w-1/2 bg-deep-slate p-8 lg:p-16 flex flex-col justify-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-trust-green blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-trust-green blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-trust-green p-2 rounded-xl">
              <Car size={32} className="text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Carcheka</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
            The National Ledger for <span className="text-trust-green">Vehicle Integrity.</span>
          </h1>
          
          <p className="text-lg text-slate-300 mb-12 max-w-lg leading-relaxed">
            A secure, transparent, and immutable system for tracking vehicle repairs across Nigeria. 
            Ensuring safety, accountability, and value for every vehicle on our roads.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Shield, title: "Anti-Tamper", desc: "Immutable repair logs" },
              { icon: CheckCircle, title: "Verified", desc: "Registered workshops only" },
              { icon: Globe, title: "National", desc: "Unified vehicle history" },
              { icon: Wrench, title: "Quality", desc: "Standardized service tracking" },
            ].map((feature, i) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="flex items-start gap-3"
              >
                <div className="mt-1 bg-white/10 p-1.5 rounded-lg">
                  <feature.icon size={18} className="text-trust-green" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{feature.title}</h4>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

          <div className="mt-auto pt-12 text-slate-500 text-sm flex items-center gap-4">
            <span>© 2026 Federal Ministry of Transportation</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <Link to="/privacy" className="hover:text-trust-green transition-colors">Privacy Policy</Link>
          </div>
        </div>
  
        {/* Right Side: Login Form */}
        <div className="lg:w-1/2 p-8 flex items-center justify-center bg-slate-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <Card className="border-none shadow-2xl shadow-slate-200/50">
              <CardHeader className="space-y-1 text-center pb-8">
                <CardTitle className="text-2xl font-bold text-deep-slate">Sign In</CardTitle>
                <CardDescription>
                  Access the national vehicle repair portal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Button 
                    className="w-full h-12 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm gap-3 font-semibold"
                    onClick={login}
                    disabled={loading}
                  >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
                    Continue with Google
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-slate-200 text-slate-600 gap-2 font-semibold"
                    asChild
                  >
                    <Link to="/search">
                      <Search size={18} />
                      Public Vehicle Search
                    </Link>
                  </Button>
                </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400">Official Access Only</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 leading-relaxed text-center">
                  By signing in, you agree to the Carcheka Terms of Service and acknowledge the responsibilities of maintaining data integrity under the National Transportation Act.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Need assistance? <a href="#" className="text-trust-green font-semibold hover:underline">Contact Support</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
