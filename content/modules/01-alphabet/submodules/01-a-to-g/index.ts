import type { SubModule } from '@/content/types'

const submodule: SubModule = {
  id: 'alphabet-a-to-g',
  moduleId: 'alphabet',
  title: 'Letters A to G',
  shortTitle: 'A–G',
  activitySequence: ['lesson-card', 'sign-to-picture', 'drag-drop-match', 'spelling'],
  items: [
    {
      id: 'letter-a',
      label: 'A',
      videoPath: '/videos/alphabet/a.mp4',
      imagePath: '/images/alphabet/a.png',
      acceptedAnswers: ['a'],
    },
    {
      id: 'letter-b',
      label: 'B',
      videoPath: '/videos/alphabet/b.mp4',
      imagePath: '/images/alphabet/b.png',
      acceptedAnswers: ['b'],
    },
    {
      id: 'letter-c',
      label: 'C',
      videoPath: '/videos/alphabet/c.mp4',
      imagePath: '/images/alphabet/c.png',
      acceptedAnswers: ['c'],
    },
    {
      id: 'letter-d',
      label: 'D',
      videoPath: '/videos/alphabet/d.mp4',
      imagePath: '/images/alphabet/d.png',
      acceptedAnswers: ['d'],
    },
    {
      id: 'letter-e',
      label: 'E',
      videoPath: '/videos/alphabet/e.mp4',
      imagePath: '/images/alphabet/e.png',
      acceptedAnswers: ['e'],
    },
    {
      id: 'letter-f',
      label: 'F',
      videoPath: '/videos/alphabet/f.mp4',
      imagePath: '/images/alphabet/f.png',
      acceptedAnswers: ['f'],
    },
    {
      id: 'letter-g',
      label: 'G',
      videoPath: '/videos/alphabet/g.mp4',
      imagePath: '/images/alphabet/g.png',
      acceptedAnswers: ['g'],
    },
  ],
}

export default submodule
