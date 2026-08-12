// Which skill courses an account is actually enrolled in.
//
// Two things are deliberately kept apart:
//
//   ACCESS (this file)        — WHICH courses the student bought. Enforced.
//   PLAN (bundlePlans.ts)     — WHICH lessons a study plan schedules. Never hides.
//
// A locked skill stays *visible* in the navigation. Hiding it outright made the
// app look broken to a student who bought a single course — Reading simply was
// not there, with nothing to explain why — so a locked skill now opens a page
// that names the course they are not enrolled in and says what to do next.
//
// The source of truth is `learner_access.enabled_modules` in Supabase, edited
// from the admin Learners panel and carried on the auth session.

export type SkillModule = 'speaking' | 'listening' | 'reading' | 'writing'

export type SkillModuleMeta = {
  key: SkillModule
  /** Course name as it is sold and as it appears in the lock message. */
  label: string
}

export const SKILL_MODULES: SkillModuleMeta[] = [
  { key: 'speaking', label: 'Speaking' },
  { key: 'listening', label: 'Listening' },
  { key: 'reading', label: 'Reading' },
  { key: 'writing', label: 'Writing' }
]

/** Matches the `enabled_modules` column default in supabase/schema.sql. */
export const DEFAULT_ENABLED_MODULES: SkillModule[] = ['speaking', 'reading', 'listening']

export const MODULE_LABEL: Record<SkillModule, string> = SKILL_MODULES.reduce(
  (acc, module) => ({ ...acc, [module.key]: module.label }),
  {} as Record<SkillModule, string>
)

/** Free-trial accounts get a fixed sample of the course, whatever they own. */
export const TRIAL_MODULES: SkillModule[] = ['speaking', 'reading']

export type ModuleAccessSession =
  | {
      role?: string | null
      enabledModules?: SkillModule[] | null
    }
  | null
  | undefined

export function hasModuleAccess(session: ModuleAccessSession, moduleKey: SkillModule): boolean {
  if (session?.role === 'admin') return true
  if (session?.role === 'trial') return TRIAL_MODULES.includes(moduleKey)
  return Boolean(session?.enabledModules?.includes(moduleKey))
}

/** The courses this account can open, in taught order, for the lock message. */
export function enrolledModuleLabels(session: ModuleAccessSession): string[] {
  return SKILL_MODULES.filter((module) => hasModuleAccess(session, module.key)).map(
    (module) => module.label
  )
}

export type LockedModuleCopy = {
  /** Headline — names the course, not the feature. */
  title: string
  /** The teacher's wording: not a student of this course, so no access. */
  message: string
  /** What the account *does* open, so the lock never reads as a total block. */
  enrolled: string
  /** The way out — buy the course, or ask an admin to switch it on. */
  help: string
}

export function describeLockedModule(
  moduleKey: SkillModule,
  session: ModuleAccessSession
): LockedModuleCopy {
  const label = MODULE_LABEL[moduleKey]
  const enrolledLabels = enrolledModuleLabels(session)

  return {
    title: `คอร์ส ${label} ยังไม่เปิดสำหรับบัญชีนี้`,
    message: `นักเรียนไม่ใช่นักเรียนในคอร์ส ${label} จึงไม่สามารถเข้าใช้ features ได้ครับ`,
    enrolled: enrolledLabels.length
      ? `คอร์สที่เปิดให้บัญชีนี้: ${enrolledLabels.join(', ')}`
      : 'ตอนนี้ยังไม่มีคอร์สไหนเปิดให้บัญชีนี้ครับ',
    help: `ถ้าสมัครคอร์ส ${label} ไว้แล้ว หรืออยากเปิดเพิ่ม ทักแอดมิน English Plan ได้เลยครับ`
  }
}

/** aria-label for a locked navigation button, so the lock is not icon-only. */
export function lockedModuleAriaLabel(moduleKey: SkillModule): string {
  return `${MODULE_LABEL[moduleKey]} — ล็อกอยู่ ยังไม่ได้เป็นนักเรียนคอร์สนี้`
}
