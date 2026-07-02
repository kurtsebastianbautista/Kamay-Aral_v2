import { redirect } from 'next/navigation'

// /modules redirects to /dashboard — modules are listed there
export default function ModulesPage() {
  redirect('/dashboard')
}
