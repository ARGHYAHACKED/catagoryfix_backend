'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { api } from '@/lib/api';
import {
  Settings,
  LogOut,
  User,
  Bell,
  Shield,
  Building2,
  Globe,
  Trash2,
  ChevronRight,
} from 'lucide-react';

const SETTING_SECTIONS = [
  {
    title: 'Account',
    icon: User,
    iconBg: 'bg-indigo-100 text-indigo-600',
    items: [
      { label: 'Profile Information', desc: 'Update your name and email address.' },
      { label: 'Change Password', desc: 'Set a new password for your account.' },
    ],
  },
  {
    title: 'Workspace',
    icon: Building2,
    iconBg: 'bg-violet-100 text-violet-600',
    items: [
      { label: 'Workspace Name', desc: 'Rename your organization workspace.' },
      { label: 'Team Members', desc: 'Invite and manage team members.' },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    iconBg: 'bg-amber-100 text-amber-600',
    items: [
      { label: 'Email Notifications', desc: 'Get notified when imports and exports complete.' },
      { label: 'Error Alerts', desc: 'Receive alerts for critical validation errors.' },
    ],
  },
  {
    title: 'Security',
    icon: Shield,
    iconBg: 'bg-emerald-100 text-emerald-600',
    items: [
      { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security.', badge: 'Recommended' },
      { label: 'Active Sessions', desc: 'View and manage active login sessions.' },
    ],
  },
  {
    title: 'Integrations',
    icon: Globe,
    iconBg: 'bg-cyan-100 text-cyan-600',
    items: [
      { label: 'Shopify Connection', desc: 'Connect your Shopify store for direct exports.' },
      { label: 'API Keys', desc: 'Manage API keys for developer access.' },
    ],
  },
];

export default function SettingsPage() {
  async function logout() {
    await api('/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  return (
    <DashboardShell>
      {/* Header */}
      <div className="page-header flex flex-col gap-1.5 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-700 text-white shadow-md">
            <Settings className="h-[18px] w-[18px]" />
          </div>
          Settings
        </h1>
        <p className="text-sm text-slate-500 ml-12">
          Manage your account, workspace, and integration preferences.
        </p>
      </div>

      {/* Settings sections */}
      <div className="max-w-2xl space-y-4">
        {SETTING_SECTIONS.map((section, si) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className={`card overflow-hidden animate-fade-in-up`}
              style={{ animationDelay: `${si * 80}ms` }}
            >
              <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-slate-50/40">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${section.iconBg}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="font-bold text-slate-900 text-sm">{section.title}</span>
              </div>

              <div className="divide-y divide-slate-50">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors text-left group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                          {item.label}
                        </span>
                        {'badge' in item && item.badge && (
                          <span className="badge badge-brand text-[10px]">{item.badge}</span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 mt-0.5 block">{item.desc}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Danger Zone */}
        <div className="card overflow-hidden animate-fade-in-up border-rose-100" style={{ animationDelay: `${SETTING_SECTIONS.length * 80}ms` }}>
          <div className="flex items-center gap-3 p-4 border-b border-rose-100 bg-rose-50/40">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
              <Trash2 className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-rose-900 text-sm">Danger Zone</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Sign Out</div>
                <div className="text-xs text-slate-400">Log out of your CatalogFix account.</div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-700 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log Out
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Delete Workspace</div>
                <div className="text-xs text-slate-400">Permanently delete all data in this workspace.</div>
              </div>
              <button
                disabled
                className="flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-500 opacity-50 cursor-not-allowed"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
