import type { SubModule } from '@/content/types'

const submodule: SubModule = {
  id: 'alphabet-o-to-u',
  moduleId: 'alphabet',
  title: 'Letters O to U',
  shortTitle: 'O–U',
  activitySequence: ['lesson-card', 'sign-to-picture', 'drag-drop-match', 'spelling'],
  items: [
    { id: 'letter-o', label: 'O', videoPath: '/videos/alphabet/o.mp4', imagePath: '/images/alphabet/o.png', acceptedAnswers: ['o'] },
    { id: 'letter-p', label: 'P', videoPath: '/videos/alphabet/p.mp4', imagePath: '/images/alphabet/p.png', acceptedAnswers: ['p'] },
    { id: 'letter-q', label: 'Q', videoPath: '/videos/alphabet/q.mp4', imagePath: '/images/alphabet/q.png', acceptedAnswers: ['q'] },
    { id: 'letter-r', label: 'R', videoPath: '/videos/alphabet/r.mp4', imagePath: '/images/alphabet/r.png', acceptedAnswers: ['r'] },
    { id: 'letter-s', label: 'S', videoPath: '/videos/alphabet/s.mp4', imagePath: '/images/alphabet/s.png', acceptedAnswers: ['s'] },
    { id: 'letter-t', label: 'T', videoPath: '/videos/alphabet/t.mp4', imagePath: '/images/alphabet/t.png', acceptedAnswers: ['t'] },
    { id: 'letter-u', label: 'U', videoPath: '/videos/alphabet/u.mp4', imagePath: '/images/alphabet/u.png', acceptedAnswers: ['u'] },
  ],
}

export default submodule
