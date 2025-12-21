'use client';

import { useAuth } from '@/hooks/useAuth';
import { Edit, Lock, Save, Settings } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.username || 'User',
    email: user?.email || 'Not provided',
    phone: '+254 700 000 000',
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Settings saved successfully!');
      setEditMode(false);
    } catch {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.new !== passwordData.confirm) {
      setError('New passwords do not match');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Password changed successfully!');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch {
      setError('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(' ')
      .map(word => word[0]?.toUpperCase() || '')
      .slice(0, 2)
      .join('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">Account Settings</h1>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-orange-500 text-white p-10 text-center">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 text-5xl font-bold shadow-2xl">
              {getInitials(profile.name)}
            </div>
            <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
            <p className="text-xl opacity-90">{profile.email}</p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Personal Information */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Settings className="w-7 h-7 text-emerald-600" />
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="input input-bordered w-full bg-base-200"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div className="mt-6">
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} className="btn btn-primary">
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Information
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={handleSave} disabled={saving} className="btn btn-success">
                      <Save className="w-5 h-5 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={() => setEditMode(false)} className="btn btn-ghost">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Notifications */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer p-4 bg-base-100 rounded-xl hover:bg-base-200 transition">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-base-content/60">Order updates, promotions</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationToggle('email')}
                    className="toggle toggle-primary"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-4 bg-base-100 rounded-xl hover:bg-base-200 transition">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-base-content/60">Delivery alerts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={() => handleNotificationToggle('sms')}
                    className="toggle toggle-primary"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-4 bg-base-100 rounded-xl hover:bg-base-200 transition">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-base-content/60">App alerts (coming soon)</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={() => handleNotificationToggle('push')}
                    className="toggle toggle-primary"
                  />
                </label>
              </div>
            </section>

            {/* Change Password */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Lock className="w-7 h-7 text-orange-600" />
                Change Password
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Current Password</span>
                  </label>
                  <input
                    type="password"
                    name="current"
                    value={passwordData.current}
                    onChange={handlePasswordChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">New Password</span>
                  </label>
                  <input
                    type="password"
                    name="new"
                    value={passwordData.new}
                    onChange={handlePasswordChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Confirm New</span>
                  </label>
                  <input
                    type="password"
                    name="confirm"
                    value={passwordData.confirm}
                    onChange={handlePasswordChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <button onClick={handlePasswordSubmit} className="btn btn-warning mt-6">
                Update Password
              </button>
            </section>

            {/* Messages */}
            {error && (
              <div className="alert alert-error shadow-lg">
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="alert alert-success shadow-lg">
                <span>{success}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}