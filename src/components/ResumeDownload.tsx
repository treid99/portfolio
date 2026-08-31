import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { site } from '../data/site'
import './ResumeDownload.css'

/**
 * Resume download control: one button, two formats.
 *
 * The trigger opens a menu rather than downloading directly, so PDF and DOCX
 * are equally reachable from every entry point on the site. Both files live in
 * `public/` and are named in `site.resume`.
 */

const formats = [
  { ext: 'PDF', label: 'Download as PDF', file: site.resume.pdf },
  { ext: 'DOCX', label: 'Download as DOCX', file: site.resume.docx },
] as const

/** Gap between the trigger and the menu, in px. */
const GAP = 7
/** Keep the menu this far off the viewport edge, in px. */
const EDGE = 8

type Props = {
  /** Trigger text. */
  label?: string
  variant?: 'primary' | 'ghost'
  /** Extra classes for the trigger, so callers keep their local sizing. */
  className?: string
  /** Which edge the menu lines up with. */
  align?: 'start' | 'end'
  /** Full-width trigger and menu — used inside the mobile sheet. */
  block?: boolean
  /** Push the menu into the flow instead of floating it over the page. */
  inline?: boolean
  /** Leading download glyph on the trigger. */
  icon?: boolean
}

type Placement = {
  top: number
  left?: number
  right?: number
  minWidth: number
}

export default function ResumeDownload({
  label = 'Resume',
  variant = 'ghost',
  className = '',
  align = 'end',
  block = false,
  inline = false,
  icon = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<Placement | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const menuId = useId()

  const close = (refocus = false) => {
    setOpen(false)
    if (refocus) triggerRef.current?.focus()
  }

  /**
   * The floating menu is portalled to <body> and positioned by hand. It has to
   * be: the hero clips its overflow and isolates its stacking context, so a
   * menu left in place is both cut off and painted under the next section.
   */
  const place = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    const height = menuRef.current?.offsetHeight ?? 0
    const below = window.innerHeight - rect.bottom

    // Flip above the trigger only when there is genuinely more room up there.
    const up = height > 0 && below < height + GAP && rect.top > below
    const edge =
      align === 'end'
        ? { right: Math.max(EDGE, window.innerWidth - rect.right) }
        : { left: Math.max(EDGE, rect.left) }

    setPlacement({
      top: up ? Math.max(EDGE, rect.top - height - GAP) : rect.bottom + GAP,
      ...edge,
      minWidth: rect.width,
    })
  }, [align])

  // Measure once the menu is mounted, then track anything that moves it.
  useLayoutEffect(() => {
    if (!open || inline) return
    place()
    const onMove = () => place()
    window.addEventListener('scroll', onMove, true)
    window.addEventListener('resize', onMove)
    return () => {
      window.removeEventListener('scroll', onMove, true)
      window.removeEventListener('resize', onMove)
    }
  }, [open, inline, place])

  useEffect(() => {
    if (!open) setPlacement(null)
  }, [open])

  // Dismiss on outside pointer or Escape.
  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node
      // The menu sits outside rootRef once portalled, so check it separately —
      // otherwise clicking an item unmounts the link before it downloads.
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close(true)
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const focusItem = (i: number) => {
    const items = itemRefs.current.filter(Boolean)
    if (!items.length) return
    items[(i + items.length) % items.length]?.focus()
  }

  const openWith = (index: number) => {
    setOpen(true)
    // The menu mounts on the next paint; wait for it before moving focus.
    requestAnimationFrame(() => focusItem(index))
  }

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      openWith(0)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      openWith(-1)
    }
  }

  const onMenuKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusItem(i + 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusItem(i - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusItem(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      focusItem(-1)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  const menu = (
    <div
      ref={menuRef}
      id={menuId}
      role="menu"
      aria-label={`${label} — choose a format`}
      className={`resume-dl__menu ${inline ? '' : 'resume-dl__menu--floating'}`}
      style={inline ? undefined : { ...placement, visibility: placement ? 'visible' : 'hidden' }}
    >
      {formats.map((f, i) => (
        <a
          key={f.ext}
          ref={(el) => {
            itemRefs.current[i] = el
          }}
          role="menuitem"
          className="resume-dl__item"
          href={`${import.meta.env.BASE_URL}${f.file}`}
          download
          onClick={() => close()}
          onKeyDown={(e) => onMenuKeyDown(e, i)}
        >
          {f.label}
        </a>
      ))}
      <p className="resume-dl__meta">{site.resume.updated}</p>
    </div>
  )

  return (
    <div
      ref={rootRef}
      className={`resume-dl ${block ? 'resume-dl--block' : ''} ${
        inline ? 'resume-dl--inline' : ''
      } ${open ? 'is-open' : ''}`}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`btn btn--${variant} resume-dl__trigger ${className}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
      >
        {icon && <DownloadIcon />}
        {label}
        <Caret />
      </button>

      {open && (inline ? menu : createPortal(menu, document.body))}
    </div>
  )
}

function Caret() {
  return (
    <svg
      className="resume-dl__caret"
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m6 9.5 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5v11m0 0 4.2-4.2M12 14.5 7.8 10.3M4.5 18.5h15"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
