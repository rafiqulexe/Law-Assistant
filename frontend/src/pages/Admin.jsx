import React, { useEffect, useState } from 'react';
import { Upload, Users, Loader2, Database } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { admin } from '@/api/client';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [dataFiles, setDataFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const load = async () => {
    try {
      const data = await admin.users();
      setUsers(data.users);
      setDataFiles(data.data_files);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const form = e.target;
    setIsUploading(true);
    try {
      const data = await admin.upload(file);
      toast.success(data.message);
      setFile(null);
      form.reset();
      load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="pt-28 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin</h1>
        <p className="text-slate-400">Manage the law library and registered users.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-slate-900/80 border-amber-900/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="h-5 w-5 text-amber-500" /> Upload law document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <input
                type="file"
                accept=".pdf,.csv"
                onChange={(e) => setFile(e.target.files[0] || null)}
                className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-slate-900"
              />
              <p className="text-xs text-slate-500">
                PDF or CSV, up to 16 MB. The whole library is re-indexed after upload.
              </p>
              <Button
                type="submit"
                disabled={!file || isUploading}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900"
              >
                {isUploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Upload and index
              </Button>
            </form>
            <div className="mt-6">
              <p className="text-sm text-slate-400 flex items-center gap-2 mb-2">
                <Database className="h-4 w-4" /> Library ({dataFiles.length} files)
              </p>
              <ul className="space-y-1 max-h-60 overflow-y-auto">
                {dataFiles.map((name) => (
                  <li key={name} className="text-sm text-slate-300 truncate">{name}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-amber-900/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-500" /> Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-slate-800">
              {users.map((user) => (
                <li key={user.username} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-white">{user.username}</p>
                    <p className="text-xs text-slate-500">{user.created_at}</p>
                  </div>
                  {user.is_admin ? <Badge className="bg-amber-500/20 text-amber-400">admin</Badge> : null}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
