import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { bn as bangla } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { api } from '@/api/client';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileSearch, 
  FileText, 
  ShieldCheck, 
  MessageSquare, 
  Users,
  ArrowRight,
  Clock,
  CheckCircle,
  Zap,
  BarChart3
} from 'lucide-react';

const quickActions = [
  { icon: FileSearch, key: 'dash.analyzeContract', path: 'ContractAnalyzer' },
  { icon: FileText, key: 'dash.generateDocument', path: 'DocumentGenerator' },
  { icon: ShieldCheck, key: 'dash.checkCompliance', path: 'RiskChecker' },
  { icon: MessageSquare, key: 'tool.chat', path: 'LegalChat' },
  { icon: Users, key: 'dash.findLawyer', path: 'FindLawyer' },
];

const statCards = [
  { key: 'contract', label: 'dash.statContracts', icon: FileSearch },
  { key: 'document', label: 'dash.statDocuments', icon: FileText },
  { key: 'risk', label: 'dash.statRisk', icon: ShieldCheck },
  { key: 'chat', label: 'dash.statChats', icon: MessageSquare },
];

const activityIcon = {
  contract: { icon: FileSearch, box: 'bg-blue-500/20', color: 'text-blue-400' },
  document: { icon: FileText, box: 'bg-green-500/20', color: 'text-green-400' },
  risk: { icon: ShieldCheck, box: 'bg-yellow-500/20', color: 'text-yellow-400' },
  chat: { icon: MessageSquare, box: 'bg-purple-500/20', color: 'text-purple-400' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const { t, language, formatNumber } = useI18n();
  const [summary, setSummary] = useState({ counts: {}, recent: [] });

  useEffect(() => {
    api.get('/api/dashboard').then(setSummary).catch(() => {});
  }, []);

  const counts = summary.counts || {};
  const totalActions = Object.values(counts).reduce((sum, value) => sum + value, 0);

  return (
    <div className="pt-20 pb-24">
      {/* Header */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('dash.title')}</h1>
            <p className="text-slate-400">{t('dash.welcome', { name: user ? `, ${user.username}` : '' })}</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/80 border-amber-900/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{formatNumber(counts[stat.key] || 0)}</p>
                  <p className="text-slate-400 text-sm">{t(stat.label)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="bg-slate-900/80 border-amber-900/30 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  {t('dash.quickActions')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link key={index} to={createPageUrl(action.path)}>
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold h-auto py-4"
                    >
                      <action.icon className="h-5 w-5 mr-3" />
                      {t(action.key)}
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-900/80 border-amber-900/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  {t('dash.recent')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summary.recent.length === 0 && (
                    <p className="text-slate-500">{t('dash.noActivity')}</p>
                  )}
                  {summary.recent.map((activity, index) => {
                    const style = activityIcon[activity.kind] || activityIcon.chat;
                    return (
                      <div key={index} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${style.box}`}>
                          <style.icon className={`h-5 w-5 ${style.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{activity.title}</p>
                          <p className="text-slate-500 text-sm">
                            {formatDistanceToNow(new Date(activity.created_at.replace(' ', 'T') + 'Z'), { addSuffix: true, locale: language === 'bn' ? bangla : undefined })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {activity.risk && (
                            <Badge className={
                              activity.risk === 'low' ? 'bg-green-500/20 text-green-400' :
                              activity.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }>
                              {t(`risk.${activity.risk}`)}
                            </Badge>
                          )}
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Usage Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-slate-900/80 border-amber-900/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-500" />
                {t('dash.usage')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {statCards.map((stat) => {
                  const value = counts[stat.key] || 0;
                  return (
                    <div key={stat.key}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">{t(stat.label)}</span>
                        <span className="text-white font-semibold">{formatNumber(value)}</span>
                      </div>
                      <Progress value={totalActions ? (value / totalActions) * 100 : 0} className="h-2 bg-slate-700" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}