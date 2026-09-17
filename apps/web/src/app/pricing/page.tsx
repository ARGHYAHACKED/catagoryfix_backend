'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
} from 'lucide-react';

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      description: 'Ideal for small e-commerce stores & single suppliers.',
      monthlyPrice: 9,
      annualPrice: 7,
      rows: '10,000 product rows / mo',
      features: [
        'AI Header Mapping Engine',
        'Standard CSV & XLSX Exports',
        'Shopify Format Exporter',
        'Basic Email Support',
        'Single User Workspace',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Pro',
      description: 'For growing e-commerce brands, agencies & dropshippers.',
      monthlyPrice: 19,
      annualPrice: 15,
      rows: '100,000 product rows / mo',
      features: [
        'Everything in Starter',
        'Automated Variant Option Splitter',
        'Custom Profit Margin & Price Rounding',
        'WooCommerce & BigCommerce Exporters',
        'Priority 24/7 Support',
        'Up to 5 Team Members',
      ],
      cta: 'Start 14-Day Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For high-volume retail networks & enterprise feeds.',
      monthlyPrice: 49,
      annualPrice: 39,
      rows: 'Unlimited product rows',
      features: [
        'Everything in Pro',
        'Dedicated AI Model Fine-Tuning',
        'Custom API & Webhook Feed Sync',
        'SLA 99.9% Uptime Guarantee',
        'Dedicated Account Manager',
        'Unlimited Team Members',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <MarketingShell>
      {/* Header */}
      <section className="bg-slate-900 text-white py-20 border-b border-slate-800 text-center">
        <div className="max-w-5xl mx-auto px-4 space-y-4">
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-950 border border-indigo-800/60 px-3 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            Simple Plans That Scale With Your Store
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            No hidden fees. Change or cancel your subscription at any time with our 14-day money-back guarantee.
          </p>

          {/* Monthly / Annual Toggle Switch */}
          <div className="pt-6 flex items-center justify-center gap-3">
            <span className={`text-sm font-semibold ${!annual ? 'text-white' : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="w-14 h-8 bg-indigo-600 rounded-full p-1 transition-colors relative"
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-transform ${
                  annual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-1.5 ${annual ? 'text-white' : 'text-slate-400'}`}>
              Annual Billing
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                Save 20%
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, idx) => {
              const price = annual ? plan.annualPrice : plan.monthlyPrice;
              return (
                <div
                  key={idx}
                  className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                    plan.popular
                      ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-indigo-500 relative scale-105'
                      : 'bg-white text-slate-900 border border-slate-200/80 shadow-md'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                      Most Popular Plan
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className={`text-xs mb-6 ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                      {plan.description}
                    </p>

                    <div className="mb-6 flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black tracking-tight font-mono">
                        ${price}
                      </span>
                      <span className={`text-sm ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                        / month
                      </span>
                    </div>

                    <div
                      className={`text-xs font-semibold py-2 px-3 rounded-xl mb-6 ${
                        plan.popular ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {plan.rows}
                    </div>

                    <ul className="space-y-3 text-sm mb-8">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2.5">
                          <Check
                            className={`w-4 h-4 shrink-0 ${
                              plan.popular ? 'text-indigo-400' : 'text-indigo-600'
                            }`}
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/signup"
                    className={`w-full text-center font-bold py-3.5 rounded-xl transition-all shadow-md ${
                      plan.popular
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
