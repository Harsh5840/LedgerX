
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit3, Trash2, Eye, Wallet, Building, PiggyBank, BarChart3, Shield, Zap, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type AccountType = 'SAVINGS' | 'WALLET' | 'BUSINESS';

interface LedgerEntry {
  id: string;
  accountId: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}
interface Account {
  id: string;
  name: string;
  type: AccountType;
  createdAt: string;
  userId: string;
  entries?: LedgerEntry[]; // 👈 Add this to support .entries
}

interface CreateAccountData {
  name: string;
  type: AccountType;
}

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const { toast } = useToast();

  // Create form state
  const [newAccount, setNewAccount] = useState<CreateAccountData>({
    name: '',
    type: 'WALLET'
  });

  // Edit form state
  const [editName, setEditName] = useState('');

  // Get JWT token from localStorage or cookies
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  };

  // Configure axios with auth token
  const getAxiosConfig = () => {
    const token = getAuthToken();
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  // Fetch user's accounts
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/accounts/me', getAxiosConfig());
      // console.log(response.data);
      setAccounts(Array.isArray(response.data) ? response.data : response.data.accounts);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'Failed to fetch accounts';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: 'Failed to load accounts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new account
  const handleCreateAccount = async () => {
    if (!newAccount.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an account name.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setCreateLoading(true);
      const response = await axios.post('http://localhost:5000/api/accounts', newAccount, getAxiosConfig());

      setAccounts(prev => [
        ...(Array.isArray(prev) ? prev : []),
        response.data.account
      ]);
      console.log('Updated accounts:', accounts); // <-- Add this line
      setNewAccount({ name: '', type: 'WALLET' });
      setCreateModalOpen(false);
      
      toast({
        title: 'Success',
        description: 'Account created successfully!',
      });
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'Failed to create account';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setCreateLoading(false);
    }
  };

  // Update account name
  const handleUpdateAccount = async () => {
    if (!editingAccount || !editName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid account name.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUpdateLoading(true);
      await axios.put(`http://localhost:5000/api/accounts/${editingAccount.id}`, { name: editName }, getAxiosConfig());

      setAccounts(prev => 
        prev.map(account => 
          account.id === editingAccount.id 
            ? { ...account, name: editName }
            : account
        )
      );
      
      setEditingAccount(null);
      setEditName('');
      
      toast({
        title: 'Success',
        description: 'Account updated successfully!',
      });
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'Failed to update account';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async (accountId: string) => {
    try {
      setDeleteLoading(accountId);
      await axios.delete(`http://localhost:5000/api/accounts/${accountId}`, getAxiosConfig());

      setAccounts(prev => prev.filter(account => account.id !== accountId));
      
      toast({
        title: 'Success',
        description: 'Account deleted successfully!',
      });
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'Failed to delete account';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  // Get account type icon and styling
  const getAccountTypeConfig = (type: AccountType) => {
    switch (type) {
      case 'SAVINGS':
        return {
          icon: <PiggyBank className="h-5 w-5" />,
          color: 'bg-emerald-500',
          lightColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          darkColor: 'dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800'
        };
      case 'BUSINESS':
        return {
          icon: <Building className="h-5 w-5" />,
          color: 'bg-blue-500',
          lightColor: 'bg-blue-50 text-blue-700 border-blue-200',
          darkColor: 'dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
        };
      case 'WALLET':
      default:
        return {
          icon: <Wallet className="h-5 w-5" />,
          color: 'bg-purple-500',
          lightColor: 'bg-purple-50 text-purple-700 border-purple-200',
          darkColor: 'dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Load accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-2xl opacity-40" />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-2xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-900 dark:bg-white rounded-xl">
                  <Wallet className="h-6 w-6 text-white dark:text-slate-900" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Financial Accounts
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Manage your financial accounts and track your investments
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 px-3 py-1">
                  <Shield className="w-3 h-3 mr-1" />
                  Bank-grade Security
                </Badge>
                <Badge className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 px-3 py-1">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Real-time Sync
                </Badge>
              </div>
            </div>
            
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Create Account
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-slate-900 dark:text-white">Create New Account</DialogTitle>
                  <DialogDescription className="text-slate-600 dark:text-slate-400">
                    Add a new financial account to track your transactions and investments.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">Account Name</Label>
                    <Input
                      id="name"
                      value={newAccount.name}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter account name"
                      className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-slate-700 dark:text-slate-300 font-medium">Account Type</Label>
                    <Select
                      value={newAccount.type}
                      onValueChange={(value: AccountType) => setNewAccount(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <SelectItem value="WALLET" className="hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-purple-500" />
                            Wallet
                          </div>
                        </SelectItem>
                        <SelectItem value="SAVINGS" className="hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div className="flex items-center gap-2">
                            <PiggyBank className="h-4 w-4 text-emerald-500" />
                            Savings
                          </div>
                        </SelectItem>
                        <SelectItem value="BUSINESS" className="hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-blue-500" />
                            Business
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCreateModalOpen(false)}
                    disabled={createLoading}
                    className="border-slate-200 dark:border-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateAccount} 
                    disabled={createLoading}
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
                  >
                    {createLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Section */}
          {accounts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Accounts</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">{accounts.length}</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      <Wallet className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Status</p>
                      <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">Online</p>
                    </div>
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
                      <Zap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Growth</p>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">+12.5%</p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
                <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400 mx-auto" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Loading your accounts...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto space-y-6">
              <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
                <Button onClick={fetchAccounts} variant="outline" className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto space-y-8">
              <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Wallet className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No accounts yet</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Create your first financial account to start tracking your transactions and building your financial portfolio.
                </p>
                <Button 
                  onClick={() => setCreateModalOpen(true)}
                  size="lg"
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Account
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(accounts) && accounts.map((account: Account) => {
              const config = getAccountTypeConfig(account.type);
              return (
                <Card key={account.id} className="group bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/50 dark:to-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 ${config.color} rounded-xl text-white shadow-lg`}>
                          {config.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                            {account.name}
                          </CardTitle>
                          <Badge className={`${config.lightColor} ${config.darkColor} border px-2 py-1 text-xs font-medium`}>
                            {account.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingAccount(account);
                            setEditName(account.name);
                          }}
                          className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-slate-900 dark:text-white">Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                                This action cannot be undone. This will permanently delete
                                the account "{account.name}" and all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-slate-200 dark:border-slate-700">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteAccount(account.id)}
                                disabled={deleteLoading === account.id}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                {deleteLoading === account.id && (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                      Created {formatDate(account.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Account ID</p>
                        <p className="text-sm font-mono text-slate-700 dark:text-slate-300 truncate">{account.id}</p>
                      </div>
                      <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 group/btn">
                        <Eye className="h-4 w-4 mr-2" />
                        View Account
                        <ArrowUpRight className="h-4 w-4 ml-auto group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-200" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Edit Account Modal */}
        <Dialog open={!!editingAccount} onOpenChange={() => setEditingAccount(null)}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-white">Edit Account</DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Update the name of your account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-slate-700 dark:text-slate-300 font-medium">Account Name</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter account name"
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingAccount(null)}
                disabled={updateLoading}
                className="border-slate-200 dark:border-slate-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateAccount} 
                disabled={updateLoading}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
              >
                {updateLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AccountsPage;