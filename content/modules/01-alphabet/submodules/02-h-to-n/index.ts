import type { SubModule } from '@/content/types'

const submodule: SubModule = {
  id: 'alphabet-h-to-n',
  moduleId: 'alphabet',
  title: 'Letters H to N',
  shortTitle: 'H–N',
  activitySequence: ['lesson-card', 'sign-to-picture', 'drag-drop-match', 'spelling'],
  items: [
    { id: 'letter-h', label: 'H', videoPath: '/videos/alphabet/h.mp4', imagePath: '/images/alphabet/h.png', acceptedAnswers: ['h'] },
    { id: 'letter-i', label: 'I', videoPath: '/videos/alphabet/i.mp4', imagePath: '/images/alphabet/i.png', acceptedAnswers: ['i'] },
    { id: 'letter-j', label: 'J', videoPath: '/videos/alphabet/j.mp4', imagePath: '/images/alphabet/j.png', acceptedAnswers: ['j'] },
    { id: 'letter-k', label: 'K', videoPath: '/videos/alphabet/k.mp4', imagePath: '/images/alphabet/k.png', acceptedAnswers: ['k'] },
    { id: 'letter-l', label: 'L', videoPath: '/videos/alphabet/l.mp4', imagePath: '/images/alphabet/l.png', acceptedAnswers: ['l'] },
    { id: 'letter-m', label: 'M', videoPath: '/videos/alphabet/m.mp4', imagePath: '/images/alphabet/m.png', acceptedAnswers: ['m'] },
    { id: 'letter-n', label: 'N', videoPath: '/videos/alphabet/n.mp4', imagePath: '/images/alphabet/n.png', acceptedAnswers: ['n'] },
  ],
}

export default submodule
