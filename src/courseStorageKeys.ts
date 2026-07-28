// Where each course surface keeps its per-learner state.
//
// These live in their own module so the persona preview can seed a scope
// without importing the components it is about to mount — the cycle that would
// otherwise create is the kind that only shows up as an undefined-at-init crash
// in a production build.

const scope = (email: string) => (email || 'admin-preview').trim().toLowerCase()

/** The Writing course shell: onboarding, completions, resume points. */
export const writingPlanStorageKey = (email: string) => `writing-course-plan:${scope(email)}`

/** The multi-course journey home: schedule, enrolment, non-Writing progress. */
export const journeyStorageKey = (email: string) => `course-journey:${scope(email)}`
