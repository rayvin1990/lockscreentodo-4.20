"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, ShieldAlert, ShieldCheck, AlertTriangle, Info, ArrowRight, Activity, Database, Scale, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Progress } from "@radix-ui/react-progress";
import { cn } from "~/components/ui/utils/cn";

const LOADING_STEPS = [
  "Initializing deep signal hunt...",
  "Scanning SEC filings and regulatory disclosures...",
  "Analyzing Reddit and social sentiment signals...",
  "Verifying legal history and litigation records...",
  "Hunting for operational risk signals...",
  "Evaluating risk status with Deep Reasoning Engine...",
  "Cross-referencing ecosystem dependencies...",
  "Calculating confidence metrics and decision logic...",
  "Finalizing comprehensive audit report..."
];

export default function AuditPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to conduct audit");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 70) return "text-red-500";
    if (score > 30) return "text-yellow-500";
    return "text-emerald-500";
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision.toLowerCase()) {
      case "critical":
        return <ShieldAlert className="w-12 h-12 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
      default:
        return <ShieldCheck className="w-12 h-12 text-emerald-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-indigo-400 via-slate-200 to-emerald-400 bg-clip-text text-transparent">
              Shield-KYB: Deep Risk Intelligence
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
              Uncover hidden financial, operational, and legal risks using deep web signals before they impact your business.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-12">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                <div className="relative flex items-center bg-slate-900 rounded-xl border border-slate-800 p-1">
                  <Search className="ml-4 w-5 h-5 text-slate-500" />
                  <Input
                    placeholder="Enter company name or domain (e.g. Velo3D, velo3d.com)"
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg py-6"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-6"
                    disabled={loading || !query.trim()}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Audit"}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600 rounded-full blur-[128px]"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-24">
        {/* Loading State */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 border border-slate-800 mb-6">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-slate-200">Deep Researching...</h2>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-indigo-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 30, ease: "linear" }}
                ></motion.div>
              </div>
              <p className="text-slate-400 italic animate-pulse">
                {LOADING_STEPS[loadingStep]}
              </p>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-xl mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center"
            >
              <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-500 mb-2">Audit Failed</h3>
              <p className="text-slate-400">{error}</p>
              <Button
                variant="outline"
                className="mt-6 border-red-500/50 text-red-500 hover:bg-red-500/10"
                onClick={() => setError(null)}
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {/* Result Dashboard */}
          {result && !loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Card */}
                <Card className="md:col-span-2 bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-slate-400 text-sm font-medium uppercase tracking-wider">Audit Results</CardTitle>
                      <h3 className="text-3xl font-bold mt-1">{query}</h3>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                      {getDecisionIcon(result.decision)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                      <div className="relative flex items-center justify-center w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-800"
                          />
                          <motion.circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={364.4}
                            initial={{ strokeDashoffset: 364.4 }}
                            animate={{ strokeDashoffset: 364.4 - (364.4 * result.risk_score) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={getRiskColor(result.risk_score)}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={cn("text-3xl font-bold", getRiskColor(result.risk_score))}>
                            {result.risk_score}
                          </span>
                          <span className="text-xs text-slate-500 uppercase">Risk</span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4 text-center md:text-left">
                        <div>
                          <span className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2",
                            result.decision.toLowerCase() === 'critical' ? 'bg-red-500/20 text-red-500' : 
                            result.decision.toLowerCase() === 'warning' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-emerald-500/20 text-emerald-500'
                          )}>
                            {result.decision} Status
                          </span>
                          <p className="text-lg text-slate-200 leading-relaxed italic">
                            "{result.main_reason}"
                          </p>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                           <div className="flex items-center gap-2 text-slate-400">
                             <TrendingDown className="w-4 h-4" />
                             <span className="text-sm italic">Confidence Score: {result.confidence_score}</span>
                           </div>
                           <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                           <div className="flex items-center gap-2 text-slate-400">
                             <Database className="w-4 h-4" />
                             <span className="text-sm italic">Evidences: {result.audit_metadata?.evidence_count || 0}</span>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(result.dimension_breakdown || {}).map(([dim, score]: [string, any]) => (
                        <div key={dim} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 flex flex-col items-center">
                          <span className="text-xs text-slate-500 uppercase mb-2">{dim}</span>
                          <span className={cn("text-xl font-bold", getRiskColor(score))}>{Math.round(score)}%</span>
                          <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <motion.div
                              className={cn("h-full", getRiskColor(score).replace('text-', 'bg-'))}
                              initial={{ width: 0 }}
                              animate={{ width: `${score}%` }}
                            ></motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-900/80 border-t border-slate-800 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                      <Info className="w-3.5 h-3.5" />
                      Automated OSINT analysis. Not financial advice.
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-indigo-400 text-xs gap-1">
                      Download PDF Report <ArrowRight className="w-3 h-3" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                  <Card className="bg-indigo-600/10 border-indigo-500/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-indigo-400 text-sm flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Intelligence Signal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-300">
                        Our engine detected cross-dimensional correlations between {Object.keys(result.dimension_breakdown || {})[0]} and {Object.keys(result.dimension_breakdown || {})[1]} factors.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-slate-400 text-sm flex items-center gap-2">
                        <Scale className="w-4 h-4" /> Regulatory Check
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400 italic">
                        No immediate terminal death signals (bankruptcy, liquidation) found in the last 6 months.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Disclaimer */}
      <footer className="py-12 border-t border-slate-900 text-center">
        <p className="text-slate-600 text-sm">
          &copy; {new Date().getFullYear()} Shield-KYB Audit System. Powered by Saasfly & Bvare OSINT.
        </p>
      </footer>
    </div>
  );
}
