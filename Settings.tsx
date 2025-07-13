import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import {
  LogOut,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Trash2,
  Lock,
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Apply stored theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const currentTheme = storedTheme || 'light';
    setTheme(currentTheme);
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.updateUser({
        email,data: { full_name: name },
        });
      if (error) throw error;
      setMessage('Profile updated successfully.');
    } catch (err: any) {
      setMessage('Error updating profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      setMessage('Password updated successfully.');
      setNewPassword('');
    } catch (err: any) {
      setMessage('Error updating password: ' + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

    try {
      const { error } = await supabase.rpc('delete_user', {
        uid: user?.id,
      });
      if (error) throw error;
      alert('Account deleted. Logging out.');
      await supabase.auth.signOut();
      window.location.reload();
    } catch (err: any) {
      setMessage('Error deleting account: ' + err.message);
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    setMessage(`Switched to ${newTheme} mode.`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <Card className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
      <Input className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5 text-blue-600" />
          <span>Account Settings</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Profile Info */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Email </label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Display Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>

          <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Password */}
        <div className="space-y-2 pt-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Change Password</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
          />
          <Button onClick={handlePasswordChange} className="mt-2">
            <Lock className="w-4 h-4 mr-2" />
            Update Password
          </Button>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center space-x-2">
            {theme === 'light' ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-200" />
            )}
            <span className="text-sm text-gray-700 dark:text-gray-200">Theme: {theme}</span>
          </div>
          <Button variant="outline" onClick={handleThemeToggle}>
            Toggle Theme
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-red-600 mb-2">Danger Zone</h4>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>

        {/* Feedback Message */}
        {message && (
          <p className="text-sm text-blue-600 dark:text-blue-400">{message}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Settings;