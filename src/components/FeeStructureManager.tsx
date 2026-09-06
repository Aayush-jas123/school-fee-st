import React, { useState } from 'react';
import type { CourseFeeRule, CourseType, SeatType, SeatTypeFees } from '../types/feeSystem';
import { getSeatTypesForCourse } from '../types/feeSystem';
import { Settings2, Save, GraduationCap, BookOpen, CheckCircle2, Award, DollarSign, Users, Armchair } from 'lucide-react';
import { formatCurrencyINR } from '../utils/exportUtils';

interface FeeStructureManagerProps {
  rules: CourseFeeRule[];
  sessions: string[];
  onSaveRules: (updatedRules: CourseFeeRule[]) => void;
  onApplyToAllStudents?: (rules: CourseFeeRule[]) => void;
  isReadOnly?: boolean;
}

export const FeeStructureManager: React.FC<FeeStructureManagerProps> = ({ rules, sessions, onSaveRules, onApplyToAllStudents, isReadOnly = false }) => {
  const [localRules, setLocalRules] = useState<CourseFeeRule[]>(rules);
  const [activeCourse, setActiveCourse] = useState<CourseType>('JBT');
  const [activeSession, setActiveSession] = useState<string>(sessions[0] || '2026-2027');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);

  const currentRule = localRules.find((r) => r.course === activeCourse && r.session === activeSession)
    || localRules.find((r) => r.course === activeCourse)
    || localRules[0];

  // Ensure currentRule always has seatTypeFees populated
  const seatTypesForCourse = getSeatTypesForCourse(activeCourse);
  const currentSeatTypeFees: SeatTypeFees[] = seatTypesForCourse.map((st) => {
    const existing = currentRule?.seatTypeFees?.find((sf) => sf.seatType === st);
    return existing || { seatType: st, additionalFee: 0 };
  });

  const handleSeatTypeFeeChange = (seatType: SeatType, additionalFee: number) => {
    if (isReadOnly || !currentRule) return;
    setLocalRules((prev) =>
      prev.map((r) => {
        if (r.course !== activeCourse || r.session !== activeSession) return r;
        const existing = r.seatTypeFees || [];
        const updated = existing.some((sf) => sf.seatType === seatType)
          ? existing.map((sf) => (sf.seatType === seatType ? { ...sf, additionalFee } : sf))
          : [...existing, { seatType, additionalFee }];
        return { ...r, seatTypeFees: updated };
      })
    );
  };

  const handleFeeChange = (field: keyof Omit<CourseFeeRule, 'course' | 'session' | 'scholarshipDiscounts'>, val: number) => {
    if (isReadOnly) return;
    setLocalRules((prev) =>
      prev.map((r) => (r.course === activeCourse && r.session === activeSession ? { ...r, [field]: val } : r))
    );
  };

  const handleScholarshipChange = (cat: 'SC' | 'ST' | 'OBC' | 'General', val: number) => {
    if (isReadOnly) return;
    setLocalRules((prev) =>
      prev.map((r) =>
        r.course === activeCourse && r.session === activeSession
          ? { ...r, scholarshipDiscounts: { ...r.scholarshipDiscounts, [cat]: val } }
          : r
      )
    );
  };

  const handleAddSessionRule = () => {
    if (isReadOnly) return;
    const existingRule = localRules.find((r) => r.course === activeCourse && r.session === activeSession);
    if (existingRule) return; // already exists
    // Clone from same course's first rule as base, or use defaults
    const baseRule = localRules.find((r) => r.course === activeCourse) || localRules[0];
    const newRule: CourseFeeRule = {
      ...baseRule,
      session: activeSession,
    };
    setLocalRules((prev) => [...prev, newRule]);
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
          <div className="w-11 h-11 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold">
            <Settings2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Institutional Fee Structure Configurator</h2>
            <p className="text-xs text-neutral-500">Configure prescribed fee rules, late penalties & scholarship discounts for JBT and B.Ed</p>
          </div>
        </div>

        {isReadOnly ? (
          <span className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 border border-neutral-200 font-bold text-xs">
            Read-Only Portal (Editing Locked)
          </span>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleApplyToAll}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-neutral-900/20 cursor-pointer"
            >
              <Users className="w-4 h-4" /> Apply to Students ({activeSession})
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-neutral-900/20 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Fee Rules
            </button>
          </div>
        )}
      </div>

      {appliedSuccess && (
        <div className="bg-neutral-50 border border-neutral-200 text-neutral-700 p-3 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-neutral-700" />
          <span>Fee structure applied to all students successfully! All balances have been recalculated.</span>
        </div>
      )}

      {savedSuccess && (
        <div className="bg-neutral-50 border border-neutral-200 text-neutral-700 p-3 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
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
              ? 'bg-neutral-900 border-neutral-900 text-white shadow-lg ring-1 ring-neutral-900'
              : 'bg-neutral-50/60 border-neutral-200 text-neutral-500 hover:border-neutral-300'
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
              ? 'bg-neutral-900 border-neutral-900 text-white shadow-lg ring-1 ring-neutral-900'
              : 'bg-neutral-50/60 border-neutral-200 text-neutral-500 hover:border-neutral-300'
          }`}
        >
          <BookOpen className="w-6 h-6 text-neutral-700" />
          <div>
            <h4 className="font-bold text-sm text-neutral-900">B.Ed Program</h4>
            <p className="text-[11px] text-neutral-500">2 Years Degree</p>
          </div>
        </button>
      </div>

      {/* Session Selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-bold text-neutral-500 uppercase">Session:</span>
        {sessions.map((sess) => {
          const hasRule = localRules.some((r) => r.course === activeCourse && r.session === sess);
          return (
            <button
              key={sess}
              onClick={() => setActiveSession(sess)}
              className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                activeSession === sess
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                  : 'bg-neutral-50/60 border-neutral-200 text-neutral-500 hover:border-neutral-300'
              }`}
            >
              {sess}
              {!hasRule && activeSession === sess && (
                <span className="ml-1.5 text-[10px] opacity-70">(no rule yet)</span>
              )}
            </button>
          );
        })}
        {activeSession && !localRules.some((r) => r.course === activeCourse && r.session === activeSession) && (
          <button
            onClick={handleAddSessionRule}
            className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            + Create Rule for this Session
          </button>
        )}
      </div>

      {/* Total Fee Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        <div className="lg:col-span-2 bg-neutral-50/60 p-5 rounded-2xl border border-neutral-200 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-neutral-700" /> Base Annual Fee — {currentRule.course} Program ({activeSession})
          </h3>

          <div>
            <label className="block text-neutral-500 mb-1">Base Total Annual Fee (₹) — applied to standard/normal seat</label>
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
            <span className="font-bold text-neutral-700">This is the base fee for {currentRule.course} students in session {activeSession}</span>
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

      {/* Seat Type Premium Fee Configuration */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-5">
        <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
            <Armchair className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Seat Type Premium Fees — {activeCourse} Program</h3>
            <p className="text-[11px] text-neutral-500">
              {activeCourse === 'B.Ed'
                ? 'Configure additional fee premium for Normal and Management seats'
                : 'Configure additional fee premium for Subsidised, Non-Subsidised and Management seats'}
            </p>
          </div>
        </div>

        <div className={`grid gap-4 ${seatTypesForCourse.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {currentSeatTypeFees.map((stf) => {
            const effectiveTotal = currentRule.tuitionFee + stf.additionalFee;
            const isBase = stf.additionalFee === 0;
            return (
              <div
                key={stf.seatType}
                className={`rounded-2xl border p-4 space-y-3 transition-all ${
                  stf.seatType === 'Management'
                    ? 'bg-neutral-50 border-neutral-200'
                    : stf.seatType === 'Subsidised'
                    ? 'bg-neutral-50 border-neutral-200'
                    : stf.seatType === 'Non-Subsidised'
                    ? 'bg-neutral-50 border-neutral-200'
                    : 'bg-neutral-50/60 border-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {stf.seatType === 'Management' && <span className="text-neutral-500 text-sm">★</span>}
                    <span className="text-sm font-bold text-neutral-900">{stf.seatType}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isBase
                      ? 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                      : 'bg-neutral-200 text-neutral-700 border border-neutral-200'
                  }`}>
                    {isBase ? 'BASE' : 'PREMIUM'}
                  </span>
                </div>

                <div>
                  <label className="block text-neutral-500 text-[10px] mb-1">
                    Additional Premium over Base (₹)
                  </label>
                  <input
                    type="number"
                    value={stf.additionalFee}
                    disabled={isReadOnly}
                    onChange={(e) => handleSeatTypeFeeChange(stf.seatType, Number(e.target.value))}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                    min={0}
                    placeholder="0"
                  />
                </div>

                <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500 font-medium">Effective Total Fee</span>
                  <span className="text-sm font-extrabold text-neutral-900">
                    {formatCurrencyINR(effectiveTotal)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-neutral-500 pt-1">
          Total Fee = Base Annual Fee ({formatCurrencyINR(currentRule.tuitionFee)}) + Seat Premium. 
          Category scholarships are applied on top of the effective total.
        </p>
      </div>
    </div>
  );
};
