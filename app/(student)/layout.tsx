import StudentNav from '@/components/student/StudentNav'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf8f4]">
      <main className="flex-1 pb-20">
        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </main>
      <StudentNav />
    </div>
  )
}
