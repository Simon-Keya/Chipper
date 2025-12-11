'use client';

import { uploadImage } from '@/lib/api';
import { Crop, Edit, Eye, EyeOff, Lock, Save, Upload, X } from 'lucide-react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+254 700 123 456',
    avatarUrl: '/default-avatar.jpg',
  });
  const [editMode, setEditMode] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setShowCropper(true);
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error: Event) => reject(error));
      image.src = url;
    });

  const handleCrop = async () => {
    try {
      if (avatarFile) {
        // Simple crop using canvas with current crop and zoom values
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const image = await createImage(URL.createObjectURL(avatarFile)) as HTMLImageElement;
        
        // Calculate crop dimensions for square avatar (96x96)
        const cropSize = 96;
        const scale = zoom;
        const scaledSize = Math.min(image.width, image.height) * scale;
        canvas.width = cropSize;
        canvas.height = cropSize;

        // Center the crop
        const offsetX = (image.width * scale - scaledSize) / 2 + crop.x;
        const offsetY = (image.height * scale - scaledSize) / 2 + crop.y;

        ctx.drawImage(
          image,
          offsetX / scale,
          offsetY / scale,
          scaledSize / scale,
          scaledSize / scale,
          0,
          0,
          cropSize,
          cropSize
        );

        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], 'cropped-avatar.jpg', { type: 'image/jpeg' });
            setAvatarFile(croppedFile);
            const previewUrl = URL.createObjectURL(croppedFile);
            setAvatarPreview(previewUrl);
          }
        }, 'image/jpeg', 0.7);
      }
    } catch (e) {
      console.error('Error cropping image:', e);
    }
    setShowCropper(false);
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      let updatedAvatarUrl = profile.avatarUrl;
      if (avatarFile) {
        updatedAvatarUrl = await uploadImage(avatarFile, token);
      }

      const updatedProfile = { ...profile, avatarUrl: updatedAvatarUrl };

      // Simulate API call
      // await updateProfile(updatedProfile, token);
      setProfile(updatedProfile);
      setAvatarFile(null);
      setSuccess('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }
      // await changePassword(passwordData, token);
      setSuccess('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError('Failed to change password');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // await deleteAccount(token);
        localStorage.removeItem('token');
        router.push('/auth/login');
      }
    } catch (err) {
      setError('Failed to delete account');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Avatar Upload */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile Avatar</span>
              </label>
              <div className="relative">
                <NextImage
                  src={avatarPreview}
                  alt="Profile avatar"
                  width={96}
                  height={96}
                  className="rounded-full object-cover border-2 border-base-300 mx-auto mb-2"
                  unoptimized
                  priority={false}
                />
                {editMode && (
                  <label className="btn btn-sm btn-outline btn-circle absolute -bottom-2 -right-2">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                disabled={!editMode}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                disabled={!editMode}
                className="input input-bordered"
              />
            </div>
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                disabled={!editMode}
                className="input input-bordered"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {!editMode ? (
              <button onClick={() => setEditMode(true)} className="btn btn-primary">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <>
                <button onClick={handleSaveProfile} disabled={saving} className="btn btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => { setEditMode(false); setError(''); }} className="btn btn-ghost">
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Simple Crop Preview (using canvas for crop) */}
      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Crop Image</h3>
              <button onClick={() => setShowCropper(false)} className="btn btn-sm btn-ghost">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative w-full h-64 mb-4 border rounded overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarPreview}
                alt="Crop preview"
                className="w-full h-full object-contain"
                style={{
                  transform: `translate(${crop.x}px, ${crop.y}px) scale(${zoom})`,
                }}
              />
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-48 h-48 border-2 border-primary rounded-full"></div>
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <label className="flex items-center gap-2 text-sm text-base-content/60">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="range range-primary"
                />
                Zoom
              </label>
              <label className="flex items-center gap-2 text-sm text-base-content/60">
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={crop.x}
                  onChange={(e) => setCrop({ ...crop, x: Number(e.target.value) })}
                  className="range range-primary"
                />
                X
              </label>
              <label className="flex items-center gap-2 text-sm text-base-content/60">
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={crop.y}
                  onChange={(e) => setCrop({ ...crop, y: Number(e.target.value) })}
                  className="range range-primary"
                />
                Y
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowCropper(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleCrop} className="btn btn-primary">
                <Crop className="w-4 h-4 mr-2" />
                Crop & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Preferences */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Email notifications</span>
                <input
                  type="checkbox"
                  name="email"
                  checked={notifications.email}
                  onChange={handleNotificationChange}
                  className="checkbox checkbox-primary"
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">SMS notifications</span>
                <input
                  type="checkbox"
                  name="sms"
                  checked={notifications.sms}
                  onChange={handleNotificationChange}
                  className="checkbox checkbox-primary"
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Push notifications</span>
                <input
                  type="checkbox"
                  name="push"
                  checked={notifications.push}
                  onChange={handleNotificationChange}
                  className="checkbox checkbox-primary"
                />
              </label>
            </div>
          </div>
          <div className="mt-4">
            <button onClick={() => { /* Save notifications */ }} className="btn btn-primary btn-sm">
              Save Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Change Password</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Current Password</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="input input-bordered pr-10 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="input input-bordered pr-10 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="input input-bordered pr-10 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <button onClick={handleChangePassword} disabled={saving} className="btn btn-primary">
              <Lock className="w-4 h-4 mr-2" />
              {saving ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="card bg-base-100 shadow-sm border border-error">
        <div className="card-body">
          <h2 className="card-title text-error">Delete Account</h2>
          <p className="text-base-content/70">Permanently delete your account and all associated data. This action cannot be undone.</p>
          <div className="divider"></div>
          <button onClick={handleDeleteAccount} disabled={saving} className="btn btn-error">
            {saving ? 'Deleting...' : 'Delete My Account'}
          </button>
        </div>
      </div>
    </div>
  );
}