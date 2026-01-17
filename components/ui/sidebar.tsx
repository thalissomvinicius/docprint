"use client";

import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { haptics } from "../../utils/haptics";

export interface Links {
    label: string;
    href: string;
    icon: React.JSX.Element | React.ReactNode;
    onClick?: () => void;
}

interface SidebarContextProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
    undefined
);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = true,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) => {
    const [openState, setOpenState] = useState(false);

    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const Sidebar = ({
    children,
    open,
    setOpen,
    animate,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) => {
    return (
        <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
            {children}
        </SidebarProvider>
    );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div> & { links?: Links[] }) => {
    return (
        <>
            <DesktopSidebar {...props} />
            {props.links && <MobileBottomBar links={props.links} />}
        </>
    );
};

export const DesktopSidebar = ({
    className,
    children,
    ...props
}: React.ComponentProps<typeof motion.div>) => {
    const { open, setOpen, animate } = useSidebar();
    return (
        <motion.div
            className={cn(
                "h-full px-4 py-6 hidden md:flex md:flex-col w-[280px] flex-shrink-0",
                "bg-gradient-to-b from-brand to-blue-800 backdrop-blur-2xl shadow-2xl",
                className
            )}
            animate={{
                width: animate ? (open ? "280px" : "70px") : "280px",
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const MobileBottomBar = ({ links }: { links: Links[] }) => {
    const [active, setActive] = useState(0);

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg z-50 safe-area-pb">
            <div
                className="flex overflow-x-auto overflow-y-hidden px-2 py-3 gap-1 scrollbar-hide snap-x snap-mandatory"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                <style>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                {links.map((link, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            haptics.light();
                            setActive(idx);
                            link.onClick?.();
                        }}
                        className={cn(
                            "flex flex-col items-center justify-center min-w-[70px] px-2 py-2 rounded-xl transition-all flex-shrink-0 snap-start",
                            active === idx
                                ? "bg-blue-50 text-blue-600"
                                : "text-neutral-600 hover:bg-neutral-50"
                        )}
                    >
                        <div className={cn(
                            "mb-1 transition-transform",
                            active === idx && "scale-110"
                        )}>
                            {React.isValidElement(link.icon)
                                ? React.cloneElement(link.icon, {
                                    className: cn("h-5 w-5", active === idx ? "stroke-[2.5px]" : "stroke-2")
                                } as any)
                                : link.icon
                            }
                        </div>
                        <span className="text-[10px] font-medium text-center leading-tight line-clamp-2 max-w-[70px]">
                            {link.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Scroll indicator - subtle hint */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none opacity-30">
                <div className="w-1 h-1 rounded-full bg-neutral-400"></div>
                <div className="w-1 h-1 rounded-full bg-neutral-400"></div>
                <div className="w-1 h-1 rounded-full bg-neutral-400"></div>
            </div>
        </div>
    );
};

export const SidebarLink = ({
    link,
    className,
    ...props
}: {
    link: Links;
    className?: string;
}) => {
    const { open, animate } = useSidebar();
    return (
        <div
            onClick={link.onClick}
            className={cn(
                "flex items-center justify-start gap-3 group/sidebar py-3 px-3 cursor-pointer rounded-xl transition-all duration-200",
                "text-white/70 hover:text-white hover:bg-white/10",
                className
            )}
            {...props}
        >
            <div className="flex-shrink-0 text-white group-hover/sidebar:scale-110 transition-transform">
                {link.icon}
            </div>
            <motion.span
                animate={{
                    display: animate ? (open ? "inline-block" : "none") : "inline-block",
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                }}
                className="text-sm font-medium whitespace-pre inline-block !p-0 !m-0"
            >
                {link.label}
            </motion.span>
        </div>
    );
};
