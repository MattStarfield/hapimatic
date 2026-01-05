import type { ReactNode } from 'react'

/**
 * BrandedFrame wraps the app content with HAPImatic branding:
 * - Mint green header bar with "HAPImatic" text in white
 * - Mint green border on left, right, and bottom edges
 * - Handles iOS safe-area-inset-top for the header
 */
export function BrandedFrame({ children }: { children: ReactNode }) {
    return (
        <div className="h-full flex flex-col bg-[#5ae6ab]">
            {/* Branded header - handles safe area for iOS status bar */}
            <div className="pt-[env(safe-area-inset-top)]">
                <div className="px-3 py-1.5 text-center">
                    <span className="text-white font-semibold text-sm tracking-wide">
                        HAPImatic
                    </span>
                </div>
            </div>

            {/* Content wrapper - thin border on sides, slightly more at bottom for rounded corners */}
            <div className="flex-1 min-h-0 flex flex-col px-1 pt-1 pb-2">
                {/* Content area with rounded corners to match iPhone screen shape */}
                <div className="flex-1 min-h-0 flex flex-col bg-[var(--app-bg)] overflow-hidden rounded-2xl">
                    {children}
                </div>
            </div>
            {/* Bottom safe area - mint green shows through */}
            <div className="pb-[env(safe-area-inset-bottom)]" />
        </div>
    )
}
