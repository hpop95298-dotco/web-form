import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EVENT_CONFIG, checkIsRegistrationOpen } from '../../config/eventConfig';
import {
  JourneyRegistrationFormData,
  FACULTIES,
  ACADEMIC_YEARS,
  PROGRAMMING_LEVELS,
  WEB_EXPERIENCES,
  WEB_PROJECT_OPTIONS,
  TECHNOLOGIES_LIST,
  INTEREST_AREAS_LIST,
} from '../../types/journeyRegistration';
import { submitApplication, checkDuplicate } from '../../services/journeyService';
import { sendConfirmationEmail } from '../../services/emailService';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Edit3,
  Laptop,
  ArrowLeft,
  ShieldCheck,
  Check,
} from 'lucide-react';

const INITIAL_FORM_DATA: JourneyRegistrationFormData = {
  fullName: '',
  universityId: '',
  universityEmail: '',
  phone: '',
  faculty: '',
  academicYear: '',
  programmingLevel: '',
  webDevExperience: '',
  technologies: [],
  otherTechnologies: '',
  hasWebProject: '',
  projectDescription: '',
  githubUrl: '',
  interestReason: '',
  interestAreas: [],
  hasLaptop: '',
  confirmedAccurate: false,
};

export default function RegistrationPage() {
  const navigate = useNavigate();
  const isRegistrationOpen = checkIsRegistrationOpen();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<JourneyRegistrationFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  if (!isRegistrationOpen) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Registration Closed</h1>
            <p className="text-xs text-slate-600">
              Thank you for your interest in the Web Development Journey. The registration window for this cycle has now closed.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Event Details
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof JourneyRegistrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleCheckbox = (field: 'technologies' | 'interestAreas', value: string) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      const exists = current.includes(value);
      const updated = exists ? current.filter((item) => item !== value) : [...current, value];
      return { ...prev, [field]: updated };
    });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Step Validation
  const validateStep = async (step: number): Promise<boolean> => {
    const newErrors: Record<string, string> = {};
    setGeneralError(null);

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
      if (!formData.universityId.trim()) newErrors.universityId = 'University ID is required.';
      if (!formData.universityEmail.trim()) {
        newErrors.universityEmail = 'University Email is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.universityEmail.trim())) {
        newErrors.universityEmail = 'Please enter a valid email address.';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone / WhatsApp Number is required.';
      if (!formData.faculty) newErrors.faculty = 'Please select your faculty.';
      if (!formData.academicYear) newErrors.academicYear = 'Please select your academic year.';

      if (Object.keys(newErrors).length === 0) {
        setIsSubmitting(true);
        const dupResult = await checkDuplicate(formData.universityId, formData.universityEmail);
        setIsSubmitting(false);

        if (dupResult.exists) {
          setGeneralError('You have already submitted an application for the Web Development Journey.');
          return false;
        }
      }
    } else if (step === 2) {
      if (!formData.programmingLevel) {
        newErrors.programmingLevel = 'Please select your current programming level.';
      }
      if (!formData.webDevExperience) {
        newErrors.webDevExperience = 'Please select your previous web development experience.';
      }
      if (!formData.hasWebProject) {
        newErrors.hasWebProject = 'Please answer if you have built a Web Project before.';
      }
      if (formData.githubUrl && formData.githubUrl.trim() !== '') {
        if (!/^https?:\/\/(www\.)?github\.com\/.+/i.test(formData.githubUrl.trim())) {
          newErrors.githubUrl = 'Please enter a valid GitHub profile URL (e.g., https://github.com/username).';
        }
      }
    } else if (step === 3) {
      if (!formData.interestReason.trim()) {
        newErrors.interestReason = 'Please tell us why you are interested in joining.';
      }
      if (formData.interestAreas.length === 0) {
        newErrors.interestAreas = 'Please select at least one area of interest.';
      }
    } else if (step === 4) {
      if (!formData.hasLaptop) {
        newErrors.hasLaptop = 'Please indicate whether you have a laptop available.';
      }
    } else if (step === 5) {
      if (!formData.confirmedAccurate) {
        newErrors.confirmedAccurate = 'You must confirm that the provided information is accurate.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setGeneralError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = async (targetStep: number) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateStep(5);
    if (!isValid) return;

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      const response = await submitApplication(formData);
      if (response.success) {
        sendConfirmationEmail({
          studentName: formData.fullName,
          universityEmail: formData.universityEmail,
          universityId: formData.universityId,
        });

        navigate('/success', {
          state: {
            studentName: formData.fullName,
            universityEmail: formData.universityEmail,
            applicationCode: response.applicationCode,
          },
        });
      } else {
        setGeneralError(response.error || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setGeneralError('An unexpected network error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = [
    { num: '01', title: 'Student' },
    { num: '02', title: 'Technical' },
    { num: '03', title: 'Interests' },
    { num: '04', title: 'Requirements' },
    { num: '05', title: 'Review' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20 pt-8 selection:bg-purple-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-4">
            <img src={EVENT_CONFIG.logos.iuLogo} alt="IU Logo" className="h-14 sm:h-16 w-auto object-contain" />
            <div className="h-10 w-px bg-slate-300" />
            <img src={EVENT_CONFIG.logos.ieeeLogo} alt="IEEE Logo" className="h-14 sm:h-16 w-auto object-contain" />
          </div>
          <Link
            to="/"
            className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Event Details
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
            Official Student Registration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Web Development Journey Application
          </h1>
        </div>

        {/* Progress Bar Indicator */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Step {currentStep} of 5</span>
            <span className="text-purple-700 font-bold">{stepLabels[currentStep - 1].title}</span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-700 h-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-5 gap-1 pt-1">
            {stepLabels.map((s, idx) => {
              const stepNum = idx + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => handleStepClick(stepNum)}
                  disabled={stepNum > currentStep}
                  className={`flex flex-col items-center gap-1 text-center transition-all ${
                    isCurrent
                      ? 'text-purple-700 font-bold'
                      : isCompleted
                      ? 'text-emerald-600 font-semibold cursor-pointer'
                      : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-purple-700 text-white shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="text-[11px] hidden sm:inline">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* General Error Alert */}
        {generalError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs sm:text-sm font-medium flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>{generalError}</div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* STEP 1: Student Information */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">Step 1 — Student Information</h2>
                <p className="text-xs text-slate-500">Please enter your official university details.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="e.g., Ahmed Mohamed Ali"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm outline-none"
                  />
                  {errors.fullName && <p className="text-[11px] text-rose-600">{errors.fullName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase">
                    University ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.universityId}
                    onChange={(e) => handleInputChange('universityId', e.target.value)}
                    placeholder="e.g., 20240182"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm outline-none font-mono"
                  />
                  {errors.universityId && <p className="text-[11px] text-rose-600">{errors.universityId}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase">
                    University Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.universityEmail}
                    onChange={(e) => handleInputChange('universityEmail', e.target.value)}
                    placeholder="student@innovation.edu.eg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm outline-none"
                  />
                  {errors.universityEmail && (
                    <p className="text-[11px] text-rose-600">{errors.universityEmail}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase">
                    Phone / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm outline-none"
                  />
                  {errors.phone && <p className="text-[11px] text-rose-600">{errors.phone}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase">
                    Faculty <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.faculty}
                    onChange={(e) => handleInputChange('faculty', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm outline-none bg-white"
                  >
                    <option value="">Select Faculty</option>
                    {FACULTIES.map((fac) => (
                      <option key={fac} value={fac}>
                        {fac}
                      </option>
                    ))}
                  </select>
                  {errors.faculty && <p className="text-[11px] text-rose-600">{errors.faculty}</p>}
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase">
                    Academic Year <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {ACADEMIC_YEARS.map((yr) => (
                      <label
                        key={yr}
                        className={`border rounded-xl p-2.5 text-xs text-center cursor-pointer font-medium transition-all ${
                          formData.academicYear === yr
                            ? 'border-purple-600 bg-purple-50 text-purple-800 font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="academicYear"
                          value={yr}
                          checked={formData.academicYear === yr}
                          onChange={(e) => handleInputChange('academicYear', e.target.value)}
                          className="sr-only"
                        />
                        {yr}
                      </label>
                    ))}
                  </div>
                  {errors.academicYear && (
                    <p className="text-[11px] text-rose-600">{errors.academicYear}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Technical Background */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">Step 2 — Technical Background</h2>
                <p className="text-xs text-slate-500">
                  Help us understand your current programming level and experience.
                </p>
              </div>

              {/* Programming Level */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Current Programming Level <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PROGRAMMING_LEVELS.map((lvl) => (
                    <label
                      key={lvl}
                      className={`border rounded-xl p-3 text-xs text-center cursor-pointer font-medium transition-all ${
                        formData.programmingLevel === lvl
                          ? 'border-purple-600 bg-purple-50 text-purple-800 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="programmingLevel"
                        value={lvl}
                        checked={formData.programmingLevel === lvl}
                        onChange={(e) => handleInputChange('programmingLevel', e.target.value)}
                        className="sr-only"
                      />
                      {lvl}
                    </label>
                  ))}
                </div>
                {errors.programmingLevel && (
                  <p className="text-[11px] text-rose-600">{errors.programmingLevel}</p>
                )}
              </div>

              {/* Web Experience */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Previous Web Development Experience <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  {WEB_EXPERIENCES.map((exp) => (
                    <label
                      key={exp}
                      className={`flex items-center gap-3 border rounded-xl p-3 text-xs font-medium cursor-pointer transition-all ${
                        formData.webDevExperience === exp
                          ? 'border-purple-600 bg-purple-50 text-purple-800 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="webDevExperience"
                        value={exp}
                        checked={formData.webDevExperience === exp}
                        onChange={(e) => handleInputChange('webDevExperience', e.target.value)}
                        className="text-purple-600 focus:ring-purple-500 h-4 w-4"
                      />
                      <span>{exp}</span>
                    </label>
                  ))}
                </div>
                {errors.webDevExperience && (
                  <p className="text-[11px] text-rose-600">{errors.webDevExperience}</p>
                )}
              </div>

              {/* Selectable Tech Chips */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Technologies Previously Used
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TECHNOLOGIES_LIST.map((tech) => {
                    const isSelected = formData.technologies.includes(tech);
                    return (
                      <label
                        key={tech}
                        className={`flex items-center gap-2 border rounded-xl p-2.5 text-xs font-medium cursor-pointer transition-all ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50 text-purple-800 font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCheckbox('technologies', tech)}
                          className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                        />
                        <span>{tech}</span>
                      </label>
                    );
                  })}
                </div>

                {formData.technologies.includes('Other') && (
                  <div className="pt-1.5">
                    <input
                      type="text"
                      value={formData.otherTechnologies || ''}
                      onChange={(e) => handleInputChange('otherTechnologies', e.target.value)}
                      placeholder="Specify other technologies..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 text-xs outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Web Project Question */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Have you built a Web Project before? <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {WEB_PROJECT_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className={`border rounded-xl p-3 text-xs text-center cursor-pointer font-medium transition-all ${
                        formData.hasWebProject === opt
                          ? 'border-purple-600 bg-purple-50 text-purple-800 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="hasWebProject"
                        value={opt}
                        checked={formData.hasWebProject === opt}
                        onChange={(e) => handleInputChange('hasWebProject', e.target.value)}
                        className="sr-only"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {errors.hasWebProject && (
                  <p className="text-[11px] text-rose-600">{errors.hasWebProject}</p>
                )}
              </div>

              {/* CONDITIONAL DISPLAY: Show Project Description ONLY if user chose a project option */}
              {formData.hasWebProject && formData.hasWebProject !== 'No' && (
                <div className="space-y-1 animate-fade-in">
                  <label className="block text-xs font-semibold text-slate-700 uppercase">
                    Project Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.projectDescription || ''}
                    onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                    placeholder="Briefly describe what you built..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 text-xs outline-none"
                  />
                </div>
              )}

              {/* GitHub */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  GitHub Profile (Optional)
                </label>
                <input
                  type="url"
                  value={formData.githubUrl || ''}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/yourusername"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 text-xs outline-none font-mono"
                />
                {errors.githubUrl && <p className="text-[11px] text-rose-600">{errors.githubUrl}</p>}
              </div>
            </div>
          )}

          {/* STEP 3: Interests */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">Step 3 — Your Interest</h2>
                <p className="text-xs text-slate-500">
                  Share your motivation and select topics you wish to explore.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Why are you interested in joining the Web Development Journey?{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.interestReason}
                  onChange={(e) => handleInputChange('interestReason', e.target.value)}
                  placeholder="Share your learning goals and what you hope to achieve..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 text-xs outline-none"
                />
                {errors.interestReason && (
                  <p className="text-[11px] text-rose-600">{errors.interestReason}</p>
                )}
              </div>

              {/* Selectable Cards for Areas of Interest */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Areas of Interest <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {INTEREST_AREAS_LIST.map((area) => {
                    const isSelected = formData.interestAreas.includes(area);
                    return (
                      <label
                        key={area}
                        className={`flex items-center gap-2.5 border rounded-xl p-3 text-xs font-medium cursor-pointer transition-all ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50 text-purple-800 font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCheckbox('interestAreas', area)}
                          className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                        />
                        <span>{area}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.interestAreas && (
                  <p className="text-[11px] text-rose-600">{errors.interestAreas}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Requirements */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">Step 4 — Laptop Requirement</h2>
                <p className="text-xs text-slate-500">Confirm equipment readiness for practical sessions.</p>
              </div>

              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2.5 text-amber-950 font-bold text-sm">
                  <Laptop className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span>Hardware Requirement Notice</span>
                </div>
                <p className="text-xs text-amber-900 font-medium leading-relaxed">
                  ⚠️ A laptop is mandatory for practical sessions and full participation in the Web Development Journey.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Do you have a laptop that you can bring to the sessions?{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Yes', 'No'].map((opt) => (
                    <label
                      key={opt}
                      className={`border rounded-2xl p-4 text-center text-xs sm:text-sm font-bold cursor-pointer transition-all ${
                        formData.hasLaptop === opt
                          ? opt === 'Yes'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                            : 'border-rose-600 bg-rose-50 text-rose-800'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="hasLaptop"
                        value={opt}
                        checked={formData.hasLaptop === opt}
                        onChange={(e) => handleInputChange('hasLaptop', e.target.value)}
                        className="sr-only"
                      />
                      {opt === 'Yes' ? 'Yes, I have a laptop' : 'No, I do not have a laptop'}
                    </label>
                  ))}
                </div>
                {errors.hasLaptop && <p className="text-[11px] text-rose-600">{errors.hasLaptop}</p>}
              </div>
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">Step 5 — Review & Submit</h2>
                <p className="text-xs text-slate-500">
                  Please review all entered information carefully before submitting your application.
                </p>
              </div>

              {/* Grouped Summary Sections with Edit Links */}
              <div className="space-y-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold uppercase text-purple-800">1. Student Info</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-slate-700">
                    <div>
                      <span className="text-slate-400">Name:</span> {formData.fullName}
                    </div>
                    <div>
                      <span className="text-slate-400">ID:</span> {formData.universityId}
                    </div>
                    <div>
                      <span className="text-slate-400">Email:</span> {formData.universityEmail}
                    </div>
                    <div>
                      <span className="text-slate-400">Phone:</span> {formData.phone}
                    </div>
                    <div>
                      <span className="text-slate-400">Faculty:</span> {formData.faculty}
                    </div>
                    <div>
                      <span className="text-slate-400">Year:</span> {formData.academicYear}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold uppercase text-purple-800">2. Technical Background</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit →
                    </button>
                  </div>
                  <div className="text-slate-700 space-y-1">
                    <div>
                      <span className="text-slate-400">Level:</span> {formData.programmingLevel}
                    </div>
                    <div>
                      <span className="text-slate-400">Experience:</span> {formData.webDevExperience}
                    </div>
                    <div>
                      <span className="text-slate-400">Tech:</span>{' '}
                      {formData.technologies.join(', ') || 'None'}
                    </div>
                    <div>
                      <span className="text-slate-400">Web Project:</span> {formData.hasWebProject}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold uppercase text-purple-800">3. Interests</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit →
                    </button>
                  </div>
                  <div className="text-slate-700 space-y-1">
                    <div>
                      <span className="text-slate-400">Motivation:</span> {formData.interestReason}
                    </div>
                    <div>
                      <span className="text-slate-400">Areas:</span>{' '}
                      {formData.interestAreas.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold uppercase text-purple-800">4. Laptop</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit →
                    </button>
                  </div>
                  <div className="text-slate-700">
                    <span className="text-slate-400">Laptop Available:</span>{' '}
                    <strong className={formData.hasLaptop === 'Yes' ? 'text-emerald-700' : 'text-rose-700'}>
                      {formData.hasLaptop}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-3 border-2 border-purple-200 bg-purple-50/50 p-4 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.confirmedAccurate}
                    onChange={(e) => handleInputChange('confirmedAccurate', e.target.checked)}
                    className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                  />
                  <span className="text-xs font-semibold text-purple-950">
                    I confirm that the information provided is accurate and truthful.
                  </span>
                </label>
                {errors.confirmedAccurate && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.confirmedAccurate}</p>
                )}
              </div>
            </div>
          )}

          {/* Form Action Buttons */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Next'}
                {!isSubmitting && <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-7 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
