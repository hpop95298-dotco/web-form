import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EVENT_CONFIG, checkIsRegistrationOpen, getDaysRemaining } from '../../config/eventConfig';
import {
  Code,
  Laptop,
  Rocket,
  Layers,
  Briefcase,
  Globe,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Lock,
  Sparkles,
  Terminal,
  Database,
  Cpu,
  UserCheck,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

import { useLanguage } from '../../stores/languageStore';
import { TRANSLATIONS } from '../../config/translations';

export default function LandingPage() {
  const { lang, toggleLanguage } = useLanguage();
  const t = TRANSLATIONS[lang];
  const isRegistrationOpen = checkIsRegistrationOpen();
  const daysRemaining = getDaysRemaining();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);


  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const getBenefitIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code className="w-5 h-5 text-purple-600" />;
      case 'laptop':
        return <Laptop className="w-5 h-5 text-purple-600" />;
      case 'rocket':
        return <Rocket className="w-5 h-5 text-purple-600" />;
      case 'layers':
        return <Layers className="w-5 h-5 text-purple-600" />;
      case 'briefcase':
        return <Briefcase className="w-5 h-5 text-purple-600" />;
      case 'globe':
        return <Globe className="w-5 h-5 text-purple-600" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-purple-100 selection:text-purple-900">
      {/* ── 1. HEADER ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 sm:h-28 flex items-center justify-between">
          {/* Logo Group */}
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src={EVENT_CONFIG.logos.iuLogo}
              alt="Innovation University"
              className="h-14 sm:h-18 lg:h-20 w-auto object-contain transition-transform hover:scale-105"
            />
            <div className="h-10 sm:h-12 w-px bg-slate-300" />
            <img
              src={EVENT_CONFIG.logos.ieeeLogo}
              alt="IEEE Student Branch"
              className="h-14 sm:h-18 lg:h-20 w-auto object-contain transition-transform hover:scale-105"
            />
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleLanguage}
              className="bg-slate-100 hover:bg-slate-200 text-purple-900 border border-slate-300 font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
              title="Switch Language / تغيير اللغة"
            >
              <Globe className="w-3.5 h-3.5 text-purple-600" />
              <span>{t.langToggle}</span>
            </button>

            <Link
              to="/admin/login"
              className="text-xs sm:text-sm text-slate-600 hover:text-purple-700 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">{t.adminPortal}</span>
              <span className="sm:hidden">Admin</span>
            </Link>

            {isRegistrationOpen ? (
              <Link
                to="/register"
                className="bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
              >
                {t.applyNow}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="bg-slate-200 text-slate-600 text-xs sm:text-sm font-medium px-4 py-2 rounded-xl">
                {t.regClosed}
              </span>
            )}
          </div>

        </div>
      </header>

      {/* ── 2. HERO SECTION REDESIGN ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/70 via-blue-50/20 to-slate-50 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Status Badge & Countdown Pill */}
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 px-3.5 py-1.5 rounded-full border bg-white shadow-xs text-xs font-semibold">
                {isRegistrationOpen ? (
                  <>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-emerald-700 font-bold tracking-wide">REGISTRATION OPEN</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-600">
                      Closes{' '}
                      {new Date(EVENT_CONFIG.registrationEndDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    {daysRemaining > 0 && (
                      <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-md ml-1">
                        {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                    <span className="text-amber-700 font-bold tracking-wide">REGISTRATION CLOSED</span>
                  </>
                )}
              </div>

              {/* Headlines */}
              <div className="space-y-2">
                <h3 className="text-xs sm:text-sm font-bold tracking-wider text-blue-700 uppercase">
                  {EVENT_CONFIG.orgName}
                </h3>
                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {EVENT_CONFIG.eventName}
                </h1>
                <p className="text-lg sm:text-2xl font-bold text-purple-800 pt-1">
                  {EVENT_CONFIG.tagline}
                </p>
              </div>

              {/* Concise Description (2-3 lines) */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A practical learning initiative designed for Innovation University students to master core web development concepts, backend databases, and .NET architecture from scratch.
              </p>

              {/* Information Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  FREE Participation
                </span>
                <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-800 border border-purple-200 text-xs font-semibold px-3 py-1.5 rounded-lg">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  5 Learning Stages
                </span>
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300 text-xs font-semibold px-3 py-1.5 rounded-lg">
                  <Laptop className="w-3.5 h-3.5 text-amber-600" />
                  Laptop Required
                </span>
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold px-3 py-1.5 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Innovation University Students
                </span>
              </div>

              {/* Hero CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                {isRegistrationOpen ? (
                  <Link
                    to="/register"
                    className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800 text-white font-bold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 text-sm"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full sm:w-auto bg-slate-300 text-slate-600 font-bold px-7 py-3.5 rounded-xl cursor-not-allowed text-sm"
                  >
                    Registration Closed
                  </button>
                )}

                <a
                  href="#roadmap"
                  className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-700 font-semibold px-7 py-3.5 rounded-xl border border-slate-300 shadow-xs transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  Explore Journey
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </a>
              </div>
            </div>

            {/* Right Column: Code Window / Technical Visual */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden font-mono text-xs text-slate-300 max-w-md mx-auto">
                {/* Code Editor Header */}
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-purple-400" />
                    <span>WebDevJourney.cs</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                    IEEE SB 2026
                  </span>
                </div>

                {/* Code Snippet */}
                <div className="p-5 space-y-3 leading-relaxed text-[11px] sm:text-xs">
                  <div>
                    <span className="text-purple-400">namespace</span>{' '}
                    <span className="text-emerald-300">IEEE.InnovationUniversity</span>
                  </div>
                  <div>
                    <span className="text-purple-400">public class</span>{' '}
                    <span className="text-amber-300">WebDevelopmentJourney</span>
                  </div>
                  <div className="pl-4 border-l border-slate-800 space-y-2">
                    <div>
                      <span className="text-slate-500">// Learning Roadmap Pipeline</span>
                    </div>
                    <div>
                      <span className="text-blue-400">public string[]</span> Stages = &#123;
                    </div>
                    <div className="pl-4 text-emerald-400 space-y-0.5">
                      <div>"01_FrontEnd_HTML_CSS_JS",</div>
                      <div>"02_BackEnd_Server_APIs",</div>
                      <div>"03_Database_SQL_Management",</div>
                      <div>"04_DotNet_CSharp_WebApps",</div>
                      <div>"05_Freelancing_Career_Prep"</div>
                    </div>
                    <div>&#125;;</div>

                    <div className="pt-2 text-slate-400">
                      <span className="text-purple-400">public bool</span> IsLaptopMandatory ={' '}
                      <span className="text-emerald-400">true</span>;
                    </div>
                    <div className="text-slate-400">
                      <span className="text-purple-400">public decimal</span> Cost ={' '}
                      <span className="text-amber-400">0.00m</span>; <span className="text-slate-500">// 100% Free</span>
                    </div>
                  </div>

                  {/* Terminal Execution Output Footer */}
                  <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-sans">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Status: Active Registration
                    </span>
                    <span className="text-purple-400 font-mono">IEEE SB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. EVENT SNAPSHOT (Light Cool Gray #F8FAFC) ──────────────── */}
      <section className="py-10 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                FREE
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">100% Free</h4>
                <p className="text-xs text-slate-500">Free participation for enrolled IU students.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                5
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">5 Stages</h4>
                <p className="text-xs text-slate-500">From Front-End basics to .NET & Career.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                P
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">Practical</h4>
                <p className="text-xs text-slate-500">Focus on hands-on practical learning.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                L
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">Laptop Required</h4>
                <p className="text-xs text-slate-500">Mandatory for hands-on session tasks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. WHY JOIN THE JOURNEY? (White Background) ──────────────── */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
              Value proposition
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Join the Journey?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A structured initiative designed to equip you with real-world technical competency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EVENT_CONFIG.benefits.map((item) => (
              <div
                key={item.title}
                className="bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100/80 border border-purple-200 flex items-center justify-center">
                  {getBenefitIcon(item.icon)}
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. WHO SHOULD JOIN? (Subtle Tinted Background) ───────────── */}
      <section className="py-16 sm:py-24 bg-purple-50/40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              Target Audience
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Who Should Join?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              No advanced prior coding experience is required. Open to all interested students.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EVENT_CONFIG.whoShouldJoin.map((person) => (
              <div
                key={person.title}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md inline-block">
                    {person.tag}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{person.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{person.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. YOUR LEARNING JOURNEY (Connected Timeline Roadmap) ─────── */}
      <section id="roadmap" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
              Curriculum Path
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Your Learning Journey
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A structured path from web fundamentals to professional development.
            </p>
          </div>

          {/* Connected Central Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Central Vertical Line (Desktop) */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-purple-600 via-blue-600 to-purple-600 transform -translate-x-1/2" />

            <div className="space-y-8 sm:space-y-12 relative">
              {EVENT_CONFIG.roadmap.map((step, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={step.number}
                    className={`relative flex flex-col md:flex-row items-center ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Content Card */}
                    <div className="w-full md:w-1/2 md:px-8">
                      <div className="bg-slate-50 border border-slate-200 hover:border-purple-400 p-6 rounded-2xl shadow-xs transition-all duration-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-md">
                            {step.stageLabel}
                          </span>
                          <span className="font-mono text-xs text-slate-400">Stage {step.number}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {step.topics.map((t) => (
                            <span
                              key={t}
                              className="bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Timeline Node Badge */}
                    <div className="my-4 md:my-0 flex items-center justify-center w-10 h-10 rounded-full bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-900/20 z-10">
                      {step.number}
                    </div>

                    {/* Empty Half Space for Desktop Balance */}
                    <div className="hidden md:block w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. WHAT STUDENTS WILL GAIN (Light Background) ────────────── */}
      <section className="py-16 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Outcomes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">What You’ll Gain</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EVENT_CONFIG.whatYouWillGain.map((gain) => (
              <div key={gain} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{gain}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. BEFORE YOU APPLY / REQUIREMENTS ───────────────────────── */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Important Checklist
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Before You Apply
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
              <span className="text-2xl font-black text-purple-700">01</span>
              <h3 className="text-base font-bold text-slate-900">Innovation University Student</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Open exclusively to currently enrolled Innovation University students from eligible faculties.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
              <span className="text-2xl font-black text-emerald-700">02</span>
              <h3 className="text-base font-bold text-slate-900">Free Participation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Web Development Journey is completely free of charge for accepted students.
              </p>
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-amber-700">03</span>
                <Laptop className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="text-base font-bold text-amber-950">Laptop Required</h3>
              <p className="text-xs text-amber-900 font-medium leading-relaxed">
                A laptop is mandatory for practical sessions and full participation in workshops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. FREQUENTLY ASKED QUESTIONS (Accordion) ────────────────── */}
      <section className="py-16 sm:py-24 bg-purple-50/30 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {EVENT_CONFIG.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.question}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 text-left text-sm font-bold text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-purple-700 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 10. FINAL REGISTRATION CTA SECTION ──────────────────────── */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-slate-950 text-white border-t border-purple-900/50">
        {/* Background Glowing Radial Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-purple-900/50 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Header Badges */}
          <div className="inline-flex items-center gap-2 bg-purple-950/80 border border-purple-700/80 px-4 py-1.5 rounded-full text-xs font-bold text-purple-300 shadow-md">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Official IEEE Event • Free Participation</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Ready to Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-400">Web Journey?</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Take your first step into Web Development. Join the IEEE Innovation University Student Branch for hands-on, practical training from fundamentals to modern full-stack development.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isRegistrationOpen ? (
              <Link
                to="/register"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold px-9 py-4 rounded-2xl shadow-xl shadow-purple-900/40 hover:shadow-purple-700/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2.5 text-sm"
              >
                <span>Apply Now for Web Dev Journey</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            ) : (
              <button
                disabled
                className="w-full sm:w-auto bg-slate-800 text-slate-500 border border-slate-700 font-bold px-8 py-4 rounded-2xl cursor-not-allowed text-sm"
              >
                Registration Closed
              </button>
            )}

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-purple-300 border border-purple-700/60 font-semibold px-7 py-4 rounded-2xl text-sm transition-all duration-200 hover:border-purple-500 flex items-center justify-center gap-2"
            >
              <span>Back to Top</span>
              <span className="text-purple-400 font-bold">↑</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 11. INSTITUTIONAL FOOTER ─────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-900 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column: Logos & Statement */}
            <div className="md:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-700/80 shadow-lg hover:shadow-purple-900/10 transition-shadow">
                <img
                  src={EVENT_CONFIG.logos.iuLogo}
                  alt="Innovation University"
                  className="h-11 sm:h-14 w-auto object-contain"
                />
                <div className="h-9 w-px bg-slate-200" />
                <img
                  src={EVENT_CONFIG.logos.ieeeLogo}
                  alt="IEEE Student Branch"
                  className="h-11 sm:h-14 w-auto object-contain"
                />
              </div>
              <div>
                <p className="text-slate-200 font-bold text-sm">{EVENT_CONFIG.orgName}</p>
                <p className="text-purple-400 text-xs font-semibold">Web Development Journey • 2026</p>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
                Empowering university students through technical excellence, hands-on learning, and community innovation.
              </p>
            </div>

            {/* Middle Column: Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1.5">
                Quick Links
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#roadmap" className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                    <span className="text-purple-500">›</span> Journey Roadmap
                  </a>
                </li>
                <li>
                  <Link to="/register" className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                    <span className="text-purple-500">›</span> Registration Form
                  </Link>
                </li>
                <li>
                  <Link to="/admin/login" className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right Column: Institutional Identity */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1.5">
                Innovation University
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Innovation Starts Here. Official IEEE Student Branch Event Platform.
              </p>
              <div className="pt-2 flex items-center gap-3 text-slate-500 text-[11px]">
                <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-300 font-mono">
                  IU • IEEE SB
                </span>
                <span>Practical Tech Training</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <div>
              © {new Date().getFullYear()} Innovation University Student Branch. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a>
              <span>•</span>
              <Link to="/register" className="hover:text-white transition-colors">Apply</Link>
              <span>•</span>
              <Link to="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
