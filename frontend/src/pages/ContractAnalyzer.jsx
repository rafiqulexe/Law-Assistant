import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { legal } from '@/api/client';
import { toast } from 'sonner';
import { downloadTextAsPdf } from '@/lib/pdf';
import { 
  FileSearch, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Loader2,
  FileText,
  Shield,
  Zap,
  Download
} from 'lucide-react';

export default function ContractAnalyzer() {
  const [contractText, setContractText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file);
    try {
      const data = await legal.extractText(file);
      setContractText(data.text);
    } catch (error) {
      toast.error(error.message);
      setUploadedFile(null);
    }
  };

  const analyzeContract = async () => {
    if (!contractText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await legal.analyzeContract(contractText);
      setAnalysis(result);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    const lines = [
      `Risk score: ${analysis.riskScore}/10`,
      '',
      'Summary',
      analysis.summary,
      '',
      'Key terms',
      ...(analysis.keyTerms || []).map((t) => `- ${t.term}: ${t.explanation}`),
      '',
      'Risks',
      ...(analysis.risks || []).map((r) => `- [${r.severity}] ${r.risk}`),
      '',
      'Recommendations',
      ...(analysis.recommendations || []).map((r) => `- ${r}`),
      '',
      'This report is legal information, not legal advice.',
    ];
    downloadTextAsPdf(lines.join('\n'), 'contract-analysis.pdf', 'Contract Analysis Report');
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
              <FileSearch className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">AI Contract Analyzer</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Analyze Any Contract </span>
              <span className="gradient-text">Instantly</span>
            </h1>
            <p className="text-xl text-slate-400">
              Upload or paste your contract to get AI-powered analysis with risk identification and plain-language explanations.
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
                    <FileText className="h-5 w-5 text-amber-500" />
                    Contract Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-amber-900/30 rounded-xl p-8 text-center hover:border-amber-500/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".txt,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-amber-500/50 mx-auto mb-4" />
                      <p className="text-slate-400 mb-2">
                        {uploadedFile ? uploadedFile.name : 'Drag and drop or click to upload'}
                      </p>
                      <p className="text-slate-500 text-sm">Supports TXT, DOC, DOCX, PDF</p>
                    </label>
                  </div>

                  <div className="text-center text-slate-500">or paste your contract below</div>

                  <Textarea
                    value={contractText}
                    onChange={(e) => setContractText(e.target.value)}
                    placeholder="Paste your contract text here..."
                    className="min-h-[300px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />

                  <Button
                    onClick={analyzeContract}
                    disabled={!contractText.trim() || isAnalyzing}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold py-6"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Analyzing Contract...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Analyze Contract
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
                  {/* Risk Score */}
                  <Card className="bg-slate-900/80 border-amber-900/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-amber-500" />
                          Risk Assessment
                        </span>
                        <Badge 
                          className={`${
                            analysis.riskScore <= 3 ? 'bg-green-500/20 text-green-400' :
                            analysis.riskScore <= 6 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}
                        >
                          Risk Score: {analysis.riskScore}/10
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress 
                        value={analysis.riskScore * 10} 
                        className="h-3 bg-slate-700"
                      />
                      <p className="text-slate-400 mt-4">{analysis.summary}</p>
                    </CardContent>
                  </Card>

                  {/* Key Terms */}
                  <Card className="bg-slate-900/80 border-amber-900/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Key Terms
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.keyTerms?.map((item, index) => (
                        <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                          <p className="text-amber-400 font-medium mb-1">{item.term}</p>
                          <p className="text-slate-400 text-sm">{item.explanation}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Risks */}
                  <Card className="bg-slate-900/80 border-amber-900/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Potential Risks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.risks?.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            item.severity === 'high' ? 'bg-red-500' :
                            item.severity === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`} />
                          <div>
                            <p className="text-white">{item.risk}</p>
                            <Badge 
                              variant="outline" 
                              className={`mt-1 ${
                                item.severity === 'high' ? 'border-red-500/50 text-red-400' :
                                item.severity === 'medium' ? 'border-yellow-500/50 text-yellow-400' :
                                'border-green-500/50 text-green-400'
                              }`}
                            >
                              {item.severity} severity
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card className="bg-slate-900/80 border-amber-900/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-500" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.recommendations?.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-300">
                            <CheckCircle className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Button 
                    variant="outline" 
                    className="w-full border-amber-900/30 text-slate-300 hover:text-amber-400"
                    onClick={downloadReport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Full Report
                  </Button>
                </>
              ) : (
                <Card className="bg-slate-900/80 border-amber-900/30 h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center">
                    <FileSearch className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">Upload or paste a contract to see analysis</p>
                    <p className="text-slate-500 text-sm mt-2">
                      Our AI will identify risks, explain terms, and provide recommendations
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