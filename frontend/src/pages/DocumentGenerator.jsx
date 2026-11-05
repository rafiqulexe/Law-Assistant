import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { legal } from '@/api/client';
import { toast } from 'sonner';
import { downloadTextAsPdf } from '@/lib/pdf';
import { 
  FileText, 
  FileSignature, 
  Home, 
  Shield, 
  Lock,
  Loader2,
  Download,
  Check,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const documentTypes = [
  {
    id: 'nda',
    name: 'NDA',
    fullName: 'Non-Disclosure Agreement',
    icon: Lock,
    description: 'Protect confidential information shared between parties',
    fields: ['partyA', 'partyB', 'purpose', 'duration']
  },
  {
    id: 'freelance',
    name: 'Freelance Contract',
    fullName: 'Freelance Service Agreement',
    icon: FileSignature,
    description: 'Define terms for freelance work and deliverables',
    fields: ['clientName', 'freelancerName', 'services', 'payment', 'deadline']
  },
  {
    id: 'rental',
    name: 'Rental Agreement',
    fullName: 'Residential Lease Agreement',
    icon: Home,
    description: 'Establish terms for property rental between landlord and tenant',
    fields: ['landlordName', 'tenantName', 'propertyAddress', 'rent', 'duration']
  },
  {
    id: 'tos',
    name: 'Terms of Service',
    fullName: 'Terms of Service Agreement',
    icon: FileText,
    description: 'Legal terms for using your website or application',
    fields: ['companyName', 'websiteUrl', 'serviceDescription']
  },
  {
    id: 'privacy',
    name: 'Privacy Policy',
    fullName: 'Privacy Policy Document',
    icon: Shield,
    description: 'Explain how you collect and use user data',
    fields: ['companyName', 'websiteUrl', 'dataCollected', 'contactEmail']
  },
];

const fieldLabels = {
  partyA: 'First Party Name',
  partyB: 'Second Party Name',
  purpose: 'Purpose of Agreement',
  duration: 'Duration (months)',
  clientName: 'Client Name',
  freelancerName: 'Freelancer Name',
  services: 'Services to be Provided',
  payment: 'Payment Amount',
  deadline: 'Project Deadline',
  landlordName: 'Landlord Name',
  tenantName: 'Tenant Name',
  propertyAddress: 'Property Address',
  rent: 'Monthly Rent',
  companyName: 'Company Name',
  websiteUrl: 'Website URL',
  serviceDescription: 'Service Description',
  dataCollected: 'Types of Data Collected',
  contactEmail: 'Contact Email'
};

export default function DocumentGenerator() {
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelectType = (type) => {
    setSelectedType(type);
    setFormData({});
    setGeneratedDocument('');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateDocument = async () => {
    setIsGenerating(true);
    try {
      const fields = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [fieldLabels[key] || key, value])
      );
      const result = await legal.generateDocument(selectedType.fullName, fields);
      setGeneratedDocument(result.document);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
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
              <FileText className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">AI Document Generator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Create Legal Documents </span>
              <span className="gradient-text">in Minutes</span>
            </h1>
            <p className="text-xl text-slate-400">
              Generate professional NDAs, contracts, and legal documents with AI-powered templates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Document Selection */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!selectedType ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="bg-slate-900/80 border-amber-900/30 hover:border-amber-500/50 transition-all duration-300 cursor-pointer group h-full"
                    onClick={() => handleSelectType(type)}
                  >
                    <CardContent className="p-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <type.icon className="h-7 w-7 text-amber-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                        {type.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4">{type.description}</p>
                      <div className="flex items-center text-amber-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Create Document <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-slate-900/80 border-amber-900/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <selectedType.icon className="h-5 w-5 text-amber-500" />
                        {selectedType.fullName}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedType(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        Change Type
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedType.fields.map((field) => (
                      <div key={field} className="space-y-2">
                        <Label className="text-slate-300">{fieldLabels[field]}</Label>
                        {field === 'services' || field === 'serviceDescription' || field === 'dataCollected' ? (
                          <Textarea
                            value={formData[field] || ''}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            placeholder={`Enter ${fieldLabels[field].toLowerCase()}...`}
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                          />
                        ) : (
                          <Input
                            value={formData[field] || ''}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            placeholder={`Enter ${fieldLabels[field].toLowerCase()}...`}
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                          />
                        )}
                      </div>
                    ))}

                    <Button
                      onClick={generateDocument}
                      disabled={isGenerating || selectedType.fields.some(f => !formData[f])}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold py-6 mt-6"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Generating Document...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Generate Document
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Generated Document */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-slate-900/80 border-amber-900/30 h-full">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="h-5 w-5 text-amber-500" />
                      Generated Document
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedDocument ? (
                      <div className="space-y-4">
                        <div className="bg-white text-slate-900 rounded-lg p-6 max-h-[500px] overflow-y-auto">
                          <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                            {generatedDocument}
                          </pre>
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            className="flex-1 border-amber-900/30 text-slate-300 hover:text-amber-400"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedDocument);
                              toast.success('Copied to clipboard');
                            }}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Copy to Clipboard
                          </Button>
                          <Button 
                            className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900"
                            onClick={() => downloadTextAsPdf(
                              generatedDocument,
                              `${selectedType.id}-document.pdf`,
                              selectedType.fullName
                            )}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[400px] text-center">
                        <FileText className="h-16 w-16 text-slate-600 mb-4" />
                        <p className="text-slate-400 text-lg">Fill in the form to generate your document</p>
                        <p className="text-slate-500 text-sm mt-2">
                          Our AI will create a professional, ready-to-use legal document
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}