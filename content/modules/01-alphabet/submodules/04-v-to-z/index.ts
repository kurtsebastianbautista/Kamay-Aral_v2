import type { SubModule } from '@/content/types'

const submodule: SubModule = {
  id: 'alphabet-v-to-z',
  moduleId: 'alphabet',
  title: 'Letters V to Z',
  shortTitle: 'V–Z',
  activitySequence: ['lesson-card', 'sign-to-picture', 'drag-drop-match', 'spelling'],
  items: [
    { id: 'letter-v', label: 'V', videoPath: '/videos/alphabet/v.mp4', imagePath: '/images/alphabet/v.png', acceptedAnswers: ['v'] },
    { id: 'letter-w', label: 'W', videoPath: '/videos/alphabet/w.mp4', imagePath: '/images/alphabet/w.png', acceptedAnswers: ['w'] },
    { id: 'letter-x', label: 'X', videoPath: '/videos/alphabet/x.mp4', imagePath: '/images/alphabet/x.png', acceptedAnswers: ['x'] },
    { id: 'letter-y', label: 'Y', videoPath: '/videos/alphabet/y.mp4', imagePath: '/images/alphabet/y.png', acceptedAnswers: ['y'] },
    { id: 'letter-z', label: 'Z', videoPath: '/videos/alphabet/z.mp4', imagePath: '/images/alphabet/z.png', acceptedAnswers: ['z'] },
  ],
}

export default submodule
