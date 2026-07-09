import type { Module } from '@/content/types'

// Sub-modules TBD — add submodule folders here following the same pattern as 01-alphabet
const module: Module = {
  id: 'numbers',
  order: 2,
  title: 'Numbers and Counting',
  description: 'Learn to sign numbers and count in Filipino Sign Language.',
  icon: '🔢',
  subModules: [],
  color: 'bg-[#63B6F5] shadow-[0_4px_0_#2087D5] hover:bg-[#43AAF9]'
}

export default module
