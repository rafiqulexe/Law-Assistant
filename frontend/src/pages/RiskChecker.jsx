import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { legal } from '@/api/client';
import { toast } from 'sonner';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Loader2,
  Shield,
  FileWarning,
  ListChecks,
  Lightbulb
} from 'lucide-react';

export default function RiskChecker() {
  const [documentText, setDocumentText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCompliance = async () => {
    if (!documentText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await legal.checkRisk(documentText);
      setAnalysis(result);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Risk & Compliance Checker</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Ensure Your Documents Are </span>
              <span className="gradient-text">Compliant</span>
            </h1>
            <p className="text-xl text-slate-400">
              Automated compliance verification and risk assessment for your business documents.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="bg-slate-900/80 border-amber-900/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileWarning className="h-5 w-5 text-amber-500" />
                    Document Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                    placeholder="Paste your document, contract, or policy text here for compliance analysis..."
                    className="min-h-[400px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />

                  <Button
                    onClick={analyzeCompliance}
                    disabled={!documentText.trim() || isAnalyzing}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold py-6"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Analyzing Compliance...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-5 w-5 mr-2" />
                        Check Compliance
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {analysis ? (
                <>
                  {/* Compliance Score */}
                  <Card className="bg-slate-900/80 border-amber-900/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-amber-500" />
                          Compliance Score
                        </span>
                        <span className={`text-3xl font-bold ${
                          analysis.complianceScore >= 80 ? 'text-green-400' :
                          analysis.complianceScore >= 60 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {analysis.complianceScore}%
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress 
                        value={analysis.complianceScore} 
                        className="h-4 bg-slate-700"
                      />
                      <p className="text-slate-400 mt-4 text-sm">
                        {analysis.complianceScore >= 80 
                          ? 'Your document meets most compliance requirements.'
                          : analysis.complianceScore >= 60
                          ? 'Some compliance issues need attention.'
                          : 'Significant compliance issues detected.'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Compliance Checks */}
                  <Card className="bg-slate-900/80 border-amber-900/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <ListChecks className="h-5 w-5 text-amber-500" />
                        Compliance Checks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.checks?.map((check, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                          {getStatusIcon(check.status)}
                          <div className="flex-1">
                            <p className="text-white font-medium">{check.name}</p>
                            <p className="text-slate-400 text-sm">{check.details}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Risks */}
                  {analysis.risks?.length > 0 && (
                    <Card className="bg-slate-900/80 border-amber-900/30">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          Identified Risks
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {analysis.risks?.map((risk, index) => (
                          <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-white font-medium">{risk.title}</p>
                              <Badge className={getSeverityColor(risk.severity)}>
                                {risk.severity}
                              </Badge>
                            </div>
                            <p className="text-slate-400 text-sm">{risk.description}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Recommendations */}
                  <Card className="bg-slate-900/80 border-amber-900/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.recommendations?.map((rec, index) => (
                          <li key={index} className="flex items-start gap-3 text-slate-300">
                            <CheckCircle className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="bg-slate-900/80 border-amber-900/30 h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center">
                    <ShieldCheck className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">Paste a document to check compliance</p>
                    <p className="text-slate-500 text-sm mt-2">
                      We'll check it against Bangladesh law, missing clauses and potential risks
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}