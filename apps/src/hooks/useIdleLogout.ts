'use client';

import { useEffect, useRef, useState } from 'react';

const IDLE_TIME = 5 * 60 * 1000;
const LOGOUT_DELAY = 2 * 60 * 1000;
const LAST_ACTIVE_KEY = 'last_active_time';

export function useIdleLogout(onLogout: () => void, enabled: boolean = true) {
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
    const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'] as const;

    const clearTimers = () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };

    const removeEvents = () => {
        events.forEach((event) => window.removeEventListener(event, resetTimer));
    };

    const addEvents = () => {
        events.forEach((event) => window.addEventListener(event, resetTimer));
    };

    const startIdleTimer = () => {
        clearTimers();

        idleTimerRef.current = setTimeout(() => {
            const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
            const now = Date.now();

            console.log('=============DIFF=============');

            if (!lastActive) return;

            const diff = now - Number(lastActive);

            console.log(diff);

            if (diff < IDLE_TIME) {
                console.log('⛔ Not really idle, skip');
                startIdleTimer();
                return;
            }

            setShowPopup(true);
            removeEvents();

            logoutTimerRef.current = setTimeout(() => {
                const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
                if (!lastActive) return;

                const diff = Date.now() - Number(lastActive);

                if (diff >= IDLE_TIME + LOGOUT_DELAY) {
                    onLogout();
                } else {
                    setShowPopup(false);

                    addEvents();
                    startIdleTimer();
                }
            }, LOGOUT_DELAY);
        }, IDLE_TIME);
    };

    const resetTimer = () => {
        setShowPopup(false);

        // console.log('=========RESET=========');
        // console.log(Date.now().toString());

        localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());

        addEvents();
        startIdleTimer();
    };

    useEffect(() => {
        if (!enabled) return;

        addEvents();
        startIdleTimer();

        return () => {
            removeEvents();
            clearTimers();
        };
    }, []);

    return {
        showPopup,
        stayLoggedIn: resetTimer,
        logoutNow: onLogout,
    };
}
