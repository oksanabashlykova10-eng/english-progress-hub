import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const [{ default: StudentPortal }, { default: StudentAchievements }, { default: Modal }, { default: AvatarSlot }, data] = await Promise.all([
    vite.ssrLoadModule('/src/pages/StudentPortal.jsx'),
    vite.ssrLoadModule('/src/pages/StudentAchievements.jsx'),
    vite.ssrLoadModule('/src/components/Modal.jsx'),
    vite.ssrLoadModule('/src/components/AvatarSlot.jsx'),
    vite.ssrLoadModule('/src/data/mockData.js'),
  ]);
  const portal = renderToString(React.createElement(MemoryRouter, null, React.createElement(StudentPortal)));
  const achievementsPage = renderToString(React.createElement(MemoryRouter, null, React.createElement(StudentAchievements)));
  const slots = React.createElement('div', null, data.avatarOptions.map((option, index) => React.createElement(AvatarSlot, { key: option.id, option, selected: index === 0 })));
  const modal = renderToString(React.createElement(Modal, { title: 'Choose your avatar', onClose: () => {}, footer: React.createElement('button', null, 'Save avatar') }, slots));
  if (!portal.includes('Hi, Ann!') || !portal.includes('Recent Results') || !portal.includes('Optional Task from Teacher')) throw new Error('Student Portal content missing');
  if (!achievementsPage.includes('My trophy constellation') || !achievementsPage.includes('In Progress') || !achievementsPage.includes('Unlocked')) throw new Error('Achievements page did not render calculated states and filters');
  if (!modal.includes('Choose your avatar') || (modal.match(/avatar-slot/g) || []).length < 8) throw new Error('Avatar modal did not render all slots');
  console.log('Student Portal SSR: OK');
  console.log('Avatar modal SSR (8 slots): OK');
  console.log('Achievements page SSR and filters: OK');
} finally {
  await vite.close();
}
