'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useScrollPosition from '@react-hook/window-scroll'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell } from 'lucide-react'

import { routesConfig } from '@/config/navigation'
import { ModeToggle } from '@/components/mode-toggle'
import { UserNav } from '@/components/user-nav'

import { Button, buttonVariants } from '../ui/button'

const transition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.15,
}

const useRange = (
  num: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => {
  const mappedValue = useMemo(() => {
    const newValue =
      ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
    const largest = Math.max(outMin, outMax)
    const smallest = Math.min(outMin, outMax)
    return Math.min(Math.max(newValue, smallest), largest)
  }, [inMax, inMin, num, outMax, outMin])

  return mappedValue
}

export function DashboardHeader() {
  const [hoveredTabIndex, setHoveredTabIndex] = useState<number | null>(null)
  const [navigationItemRefs, setNavigationItemRefs] = useState<
    Array<HTMLDivElement | null>
  >([])
  const pathname = usePathname()

  useEffect(() => {
    setNavigationItemRefs((prev) =>
      prev.slice(0, routesConfig.dashboardNav.length),
    )
  }, [])

  const navRef = useRef<HTMLDivElement>(null)
  const navRect = navRef.current?.getBoundingClientRect()

  const selectedRect = navigationItemRefs
    .find((ref, index) => routesConfig.dashboardNav[index].href === pathname)
    ?.getBoundingClientRect()
  const hoveredRect =
    navigationItemRefs[hoveredTabIndex ?? -1]?.getBoundingClientRect()

  // Logo animation on scroll
  const y = useScrollPosition(60)
  const navX = useRange(y, 0, 50, 0, 42)
  const logoScale = useRange(y, 0, 50, 1, 0.8)
  const top = useRange(y, 0, 50, 24, 16)

  return (
    <>
      <header className="z-50 flex h-14 items-end justify-between gap-4 pl-14 pr-5">
        <Link href="/dashboard">
          <svg
            style={{
              transform: `scale(${logoScale})`,
              top,
            }}
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            aria-label="Food explorer Logo"
            className="fixed left-6 top-4 z-50"
            fill="none"
            viewBox="0 0 43 48"
          >
            <path
              fill="currentColor"
              className="fill-[#065E7C]"
              d="M21.57.217l21.404 11.875v23.75L21.57 47.719.168 35.843V12.092L21.57.217z"
            ></path>
          </svg>

          <div className="flex h-10 items-center">
            <strong className="text-xl">Food Explorer</strong>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ModeToggle variant="outline" className="rounded-full" />
          <Button size="icon" variant="outline" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <UserNav />
        </div>
      </header>
      <nav
        ref={navRef}
        onPointerLeave={() => setHoveredTabIndex(null)}
        className="sticky top-0 z-10 flex border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90"
      >
        <div
          style={{
            transform: `translateX(${navX}px)`,
          }}
          className="relative flex h-14 items-center gap-1 pl-4"
        >
          {routesConfig.dashboardNav.map((item, i) => {
            return (
              <div
                key={i}
                ref={(el) => (navigationItemRefs[i] = el)}
                className="z-50"
                onPointerEnter={() => {
                  setHoveredTabIndex(i)
                }}
                onFocus={() => {
                  setHoveredTabIndex(i)
                }}
              >
                <Link
                  href={item.href}
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}
                >
                  {item.title}
                </Link>
              </div>
            )
          })}
        </div>

        <AnimatePresence>
          {hoveredRect && navRect && (
            <motion.div
              key={'hover'}
              className="absolute left-0 top-0 -z-10 mb-1 rounded-md bg-accent p-1"
              initial={{
                x: hoveredRect.left - navRect.left,
                y: hoveredRect.top - navRect.top,
                width: hoveredRect.width,
                height: hoveredRect.height,
                opacity: 0,
              }}
              animate={{
                x: hoveredRect.left - navRect.left,
                y: hoveredRect.top - navRect.top,
                width: hoveredRect.width,
                height: hoveredRect.height,
                opacity: 1,
              }}
              exit={{
                x: hoveredRect.left - navRect.left,
                y: hoveredRect.top - navRect.top,
                width: hoveredRect.width,
                height: hoveredRect.height,
                opacity: 0,
              }}
              transition={transition}
            />
          )}
        </AnimatePresence>

        {selectedRect && navRect && (
          <motion.div
            className={
              'absolute bottom-0 left-0.5 z-10 h-[3px] bg-zinc-700 dark:bg-zinc-200'
            }
            initial={false}
            animate={{
              width: selectedRect.width * 0.8,
              x: `calc(${selectedRect.left - navRect.left}px + 10%)`,
              opacity: 1,
            }}
            transition={transition}
          />
        )}
      </nav>
    </>
  )
}
