import './LockedModuleNotice.css'
import { describeLockedModule, type ModuleAccessSession, type SkillModule } from './moduleAccess'

/** Padlock used both on the locked page and beside locked navigation entries. */
export function ModuleLockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 10V7.5a5 5 0 0 1 10 0V10"
        stroke="#0b1530"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect x="4" y="10" width="16" height="11" rx="3" fill="#0b1530" />
      <circle cx="12" cy="15" r="1.7" fill="#ffcc00" />
      <path d="M12 16.4v2.1" stroke="#ffcc00" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

type LockedModuleNoticeProps = {
  module: SkillModule
  session: ModuleAccessSession
  onBackHome: () => void
}

/**
 * Shown in place of a skill page when the account is not enrolled in it.
 *
 * Every skill page routes through this one component so the wording stays
 * identical wherever a student hits the lock.
 */
export function LockedModuleNotice({ module, session, onBackHome }: LockedModuleNoticeProps) {
  const copy = describeLockedModule(module, session)

  return (
    <section className="panel full lockedModulePanel">
      <div className="lockedModuleNotice" role="status" aria-live="polite">
        <span className="lockedModuleBadge">
          <ModuleLockIcon />
        </span>
        <p className="lockedModuleKicker">Locked</p>
        <h3>{copy.title}</h3>
        <p className="lockedModuleMessage">{copy.message}</p>
        <p className="lockedModuleEnrolled">{copy.enrolled}</p>
        <p className="lockedModuleHelp">{copy.help}</p>
        <button type="button" className="lockedModuleAction" onClick={onBackHome}>
          กลับหน้าแรก
        </button>
      </div>
    </section>
  )
}
