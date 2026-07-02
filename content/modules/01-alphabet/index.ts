import type { Module } from '@/content/types'
import aToG from './submodules/01-a-to-g'
import hToN from './submodules/02-h-to-n'
import oToU from './submodules/03-o-to-u'
import vToZ from './submodules/04-v-to-z'

const module: Module = {
  id: 'alphabet',
  order: 1,
  title: 'Alphabet',
  description: 'Learn the Filipino Sign Language alphabet from A to Z.',
  icon: '🔤',
  subModules: [aToG, hToN, oToU, vToZ],
}

export default module
