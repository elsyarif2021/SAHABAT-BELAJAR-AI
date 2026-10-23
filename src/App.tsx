/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { LevelSelectorModal } from './components/LevelSelectorModal';
import { ChatTutor } from './components/ChatTutor';
import { QuizArena } from './components/QuizArena';
import { GuruStudio } from './components/GuruStudio';
import { PojokTPQ } from './components/PojokTPQ';
import { StudyPlanner } from './components/StudyPlanner';
import { EDUCATION_LEVELS } from './data/educationLevels';
import { EducationLevelId } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz' | 'studio' | 'tpq' | 'planner'>('chat');
  const [currentLevelId, setCurrentLevelId] = useState<EducationLevelId>('sd');
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [initialPromptForChat, setInitialPromptForChat] = useState<string | null>(null);

  const currentLevel = EDUCATION_LEVELS.find((l) => l.id === currentLevelId) || EDUCATION_LEVELS[2];

  const handleSelectLevel = (levelId: EducationLevelId) => {
    setCurrentLevelId(levelId);
  };

  const handleAskTutorFromOtherTab = (prompt: string) => {
    setActiveTab('chat');
    setInitialPromptForChat(prompt);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLevel={currentLevel}
        onSelectLevel={handleSelectLevel}
        onOpenLevelModal={() => setIsLevelModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-10">
        {activeTab === 'chat' && (
          <ChatTutor
            currentLevel={currentLevel}
            onSelectLevel={handleSelectLevel}
            onOpenLevelModal={() => setIsLevelModalOpen(true)}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizArena currentLevel={currentLevel} />
        )}

        {activeTab === 'studio' && (
          <GuruStudio />
        )}

        {activeTab === 'tpq' && (
          <PojokTPQ onAskTutor={handleAskTutorFromOtherTab} />
        )}

        {activeTab === 'planner' && (
          <StudyPlanner
            currentLevel={currentLevel}
            onAskTutor={handleAskTutorFromOtherTab}
          />
        )}
      </main>

      {/* Education Level Selection Modal */}
      <LevelSelectorModal
        isOpen={isLevelModalOpen}
        onClose={() => setIsLevelModalOpen(false)}
        currentLevelId={currentLevelId}
        onSelectLevel={handleSelectLevel}
      />
    </div>
  );
}
