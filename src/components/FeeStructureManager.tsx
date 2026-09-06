import React, { useState } from 'react';
import type { CourseFeeRule, CourseType } from '../types/feeSystem';
import { Settings2, Save, GraduationCap, BookOpen, CheckCircle2, Award, DollarSign, Users } from 'lucide-react';
import { formatCurrencyINR } from '../utils/exportUtils';

interface FeeStructureManagerProps {
  rules: CourseFeeRule[];
  onSaveRules: (updatedRules: CourseFeeRule[]) => void;
  onApplyToAllStudents?: (rules: CourseFeeRule[]) => void;
  isReadOnly?: boolean;
}

export const FeeStructureManager: React.FC<FeeStructureManagerProps> = ({ rules, onSaveRules, onApplyToAllStudents, isReadOnly = false }) => {
  const [localRules, setLocalRules] = useState<CourseFeeRule[]>(rules);
  const [activeCourse, setActiveCourse] = useState<CourseType>('JBT');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);

  const currentRule = localRules.find((r) => r.course === activeCourse) || localRules[0];

  const handleFeeChange = (field: keyof Omit<CourseFeeRule, 'course' | 'scholarshipDiscounts'>, val: number) => {
    if (isReadOnly) return;
    setLocalRules((prev) =>
      prev.map((r) => (r.course === activeCourse ? { ...r, [field]: val } : r))
    );
  };

  const handleScholarshipChange = (cat: 'SC' | 'ST' | 'OBC' | 'General', val: number) => {
    if (isReadOnly) return;
    setLocalRules((prev) =>
      prev.map((r) =>
        r.course === activeCourse
          ? { ...r, scholarshipDiscounts: { ...r.scholarshipDiscounts, [cat]: val } }
          : r
      )
    );
  };

  const handleSave = () => {
    if (isReadOnly) return;
    onSaveRules(localRules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleApplyToAll = () => {
    if (isReadOnly || !onApplyToAllStudents) return;
    onApplyToAllStudents(localRules);
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 3000);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-lg space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-violet-500/20 text-neutral-700 flex items-center justify-center font-bold">
            <Settings2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Institutional Fee Structure Configurator</h2>
            <p className="text-xs text-neutral-500">Configure prescribed fee rules, late penalties & scholarship discounts for JBT and B.Ed</p>
          </div>
        </div>

        {isReadOnly ? (
          <span className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold text-xs">
            Read-Only Portal (Editing Locked)
          </span>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleApplyToAll}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-neutral-900 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <Users className="w-4 h-4" /> Apply to All Students
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-neutral-900 font-bold text-xs flex items-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Fee Rules
            </button>
          </div>
        )}
      </div>

      {appliedSuccess && (
        <div className="bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 p-3 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-neutral-700" />
          <span>Fee structure applied to all students successfully! All balances have been recalculated.</span>
        </div>
      )}

      {savedSuccess && (
        <div className="bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 p-3 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-neutral-700" />
          <span>Fee structure rules updated successfully across the institution!</span>
        </div>
      )}

      {/* Program Selector Tabs */}
      <div className="grid grid-cols-2 gap-4 max-w-lg">
        <button
          onClick={() => setActiveCourse('JBT')}
          className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
            activeCourse === 'JBT'
              ? 'bg-violet-600/20 border-violet-500/30 text-neutral-900 shadow-lg ring-1 ring-violet-500/40'
              : 'bg-neutral-50/60 border-neutral-200 text-neutral-500 hover:border-zinc-700/50'
          }`}
        >
          <GraduationCap className="w-6 h-6 text-neutral-700" />
          <div>
            <h4 className="font-bold text-sm text-neutral-900">JBT Program</h4>
            <p className="text-[11px] text-neutral-500">2 Years Diploma</p>
          </div>
        </button>

        <button
          onClick={() => setActiveCourse('B.Ed')}
          className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
            activeCourse === 'B.Ed'
              ? 'bg-violet-600/20 border-violet-500/30 text-neutral-900 shadow-lg ring-1 ring-violet-500/40'
              : 'bg-neutral-50/60 border-neutral-200 text-neutral-500 hover:border-zinc-700/50'
          }`}
        >
          <BookOpen className="w-6 h-6 text-neutral-700" />
          <div>
            <h4 className="font-bold text-sm text-neutral-900">B.Ed Program</h4>
            <p className="text-[11px] text-neutral-500">2 Years Degree</p>
          </div>
        </button>
      </div>

      {/* Total Fee Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        <div className="lg:col-span-2 bg-neutral-50/60 p-5 rounded-2xl border border-neutral-200 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-neutral-700" /> Annual Fee — {currentRule.course} Program
          </h3>

          <div>
            <label className="block text-neutral-500 mb-1">Total Annual Fee (₹)</label>
            <input
              type="number"
              value={currentRule.tuitionFee}
              disabled={isReadOnly}
              onChange={(e) => handleFeeChange('tuitionFee', Number(e.target.value))}
              className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 text-lg font-bold disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="Enter total annual fee"
            />
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
            <span className="font-bold text-neutral-700">This fee will be applied to all {currentRule.course} students</span>
            <strong className="text-neutral-700 text-base font-extrabold">
              {formatCurrencyINR(currentRule.tuitionFee)}
            </strong>
          </div>
        </div>

        {/* Scholarship & Penalty Rules */}
        <div className="space-y-4">
          <div className="bg-neutral-50/60 p-5 rounded-2xl border border-neutral-200 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-neutral-700" /> Category Scholarship Concessions
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-neutral-500 mb-1">SC Category Discount (₹)</label>
                <input
                  type="number"
                  value={currentRule.scholarshipDiscounts.SC}
                  disabled={isReadOnly}
                  onChange={(e) => handleScholarshipChange('SC', Number(e.target.value))}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">ST Category Discount (₹)</label>
                <input
                  type="number"
                  value={currentRule.scholarshipDiscounts.ST}
                  disabled={isReadOnly}
                  onChange={(e) => handleScholarshipChange('ST', Number(e.target.value))}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">OBC Category Discount (₹)</label>
                <input
                  type="number"
                  value={currentRule.scholarshipDiscounts.OBC}
                  disabled={isReadOnly}
                  onChange={(e) => handleScholarshipChange('OBC', Number(e.target.value))}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="bg-neutral-50/60 p-5 rounded-2xl border border-neutral-200 space-y-3">
            <h3 className="text-sm font-bold text-neutral-900">Daily Late Penalty Rule</h3>
            <div>
              <label className="block text-neutral-500 mb-1">Fine Amount per Day Overdue (₹)</label>
              <input
                type="number"
                value={currentRule.lateFeePerDay}
                disabled={isReadOnly}
                onChange={(e) => handleFeeChange('lateFeePerDay', Number(e.target.value))}
                className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
