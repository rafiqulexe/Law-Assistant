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
import { useI18n } from '@/lib/i18n';
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
  const { t, tError, language, formatNumber } = useI18n();
  const [contractText, setContractText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isReading, setIsReading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file);
    setIsReading(true);
    try {
      const data = await legal.extractText(file);
      setContractText(data.text);
      if (data.ocr) toast.info(t('ca.ocrDone'));
    } catch (error) {
      toast.error(tError(error.message));
      setUploadedFile(null);
    } finally {
      setIsReading(false);
      // Let the same file be picked again after an error.
      e.target.value = '';
    }
  };

  const analyzeContract = async () => {
    if (!contractText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await legal.analyzeContract(contractText, language);
      setAnalysis(result);
    } catch (error) {
      toast.error(tError(error.message));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    const lines = [
      t('ca.reportScore', { score: formatNumber(analysis.riskScore) }),
      '',
      t('ca.reportSummary'),
      analysis.summary,
      '',
      t('ca.reportTerms'),
      ...(analysis.keyTerms || []).map((t) => `- ${t.term}: ${t.explanation}`),
      '',
      t('ca.reportRisks'),
      ...(analysis.risks || []).map((r) => `- [${r.severity}] ${r.risk}`),
      '',
      t('tool.recommendations'),
      ...(analysis.recommendations || []).map((r) => `- ${r}`),
      '',
      t('ca.reportDisclaimer'),
    ];
    downloadTextAsPdf(lines.join('\n'), 'contract-analysis.pdf', t('ca.reportTitle'));
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 mb-6">
              <FileSearch className="h-4 w-4 text-brand-400" />
              <span className="text-brand-400 text-sm font-medium">{t('ca.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">{t('ca.title1')}</span>
              <span className="gradient-text">{t('ca.title2')}</span>
            </h1>
            <p className="text-xl text-slate-400">
              {t('ca.intro')}
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
              <Card className="bg-slate-900/80 border-brand-900/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-brand-500" />
                    {t('ca.input')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-brand-900/30 rounded-xl p-8 text-center hover:border-brand-500/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".txt,.pdf,.png,.jpg,.jpeg,.webp,.tif,.tiff"
                      disabled={isReading}
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {isReading ? (
                        <Loader2 className="h-12 w-12 text-brand-500/70 mx-auto mb-4 animate-spin" />
                      ) : (
                        <Upload className="h-12 w-12 text-brand-500/50 mx-auto mb-4" />
                      )}
                      <p className="text-slate-400 mb-2">
                        {isReading ? t('ca.reading') : uploadedFile ? uploadedFile.name : t('ca.upload')}
                      </p>
                      <p className="text-slate-500 text-sm">{t('ca.supports')}</p>
                    </label>
                  </div>

                  <div className="text-center text-slate-500">{t('ca.orPaste')}</div>

                  <Textarea
                    value={contractText}
                    onChange={(e) => setContractText(e.target.value)}
                    placeholder={t('ca.placeholder')}
                    className="min-h-[300px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />

                  <Button
                    onClick={analyzeContract}
                    disabled={!contractText.trim() || isAnalyzing}
                    className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-slate-900 font-semibold py-6"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        {t('ca.analyzing')}
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        {t('ca.analyze')}
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
                  <Card className="bg-slate-900/80 border-brand-900/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-brand-500" />
                          {t('ca.riskAssessment')}
                        </span>
                        <Badge 
                          className={`${
                            analysis.riskScore <= 3 ? 'bg-green-500/20 text-green-400' :
                            analysis.riskScore <= 6 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {t('ca.riskScore', { score: formatNumber(analysis.riskScore) })}
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
                  <Card className="bg-slate-900/80 border-brand-900/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        {t('ca.keyTerms')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.keyTerms?.map((item, index) => (
                        <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                          <p className="text-brand-400 font-medium mb-1">{item.term}</p>
                          <p className="text-slate-400 text-sm">{item.explanation}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Risks */}
                  <Card className="bg-slate-900/80 border-brand-900/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-brand-500" />
                        {t('ca.potentialRisks')}
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
                              {t('sev.label', { level: t(`sev.${item.severity}`) })}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card className="bg-slate-900/80 border-brand-900/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-500" />
                        {t('tool.recommendations')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.recommendations?.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-300">
                            <CheckCircle className="h-4 w-4 text-brand-500 mt-1 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Button 
                    variant="outline" 
                    className="w-full border-brand-900/30 text-slate-300 hover:text-brand-400"
                    onClick={downloadReport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('ca.download')}
                  </Button>
                </>
              ) : (
                <Card className="bg-slate-900/80 border-brand-900/30 h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center">
                    <FileSearch className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">{t('ca.emptyTitle')}</p>
                    <p className="text-slate-500 text-sm mt-2">
                      {t('ca.emptyText')}
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