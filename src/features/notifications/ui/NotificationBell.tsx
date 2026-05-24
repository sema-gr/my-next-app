'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Bell,
    Check,
    Info,
    ShieldAlert,
    CheckCircle2,
    UserPlus,
    Trophy,
    AlertTriangle,
} from 'lucide-react';
import { useNotifications, NotificationType } from '@/entities/notification';

export function NotificationBell() {
    const router = useRouter();
    const { notifications, unreadCount, markAsRead, markAllAsRead } =
        useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIconInfo = (type: NotificationType) => {
        switch (type) {
            case 'SUCCESS':
                return {
                    icon: CheckCircle2,
                    color: 'text-green-500',
                    bg: 'bg-green-50',
                };
            case 'ERROR':
                return {
                    icon: ShieldAlert,
                    color: 'text-red-500',
                    bg: 'bg-red-50',
                };
            case 'WARNING':
                return {
                    icon: AlertTriangle,
                    color: 'text-orange-500',
                    bg: 'bg-orange-50',
                };
            case 'INFO':
                return {
                    icon: Info,
                    color: 'text-indigo-500',
                    bg: 'bg-indigo-50',
                };
            case 'TEAM_JOIN_REQUEST':
                return {
                    icon: UserPlus,
                    color: 'text-blue-500',
                    bg: 'bg-blue-50',
                };
            case 'TOURNAMENT_UPDATE':
                return {
                    icon: Trophy,
                    color: 'text-yellow-500',
                    bg: 'bg-yellow-50',
                };
            default:
                return {
                    icon: Info,
                    color: 'text-slate-500',
                    bg: 'bg-slate-100',
                };
        }
    };

    const handleNotificationClick = (id: string, link?: string | null) => {
        markAsRead(id);
        setIsOpen(false);
        if (link) {
            router.push(link);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-[10px] font-black text-white bg-red-500 rounded-full border-2 border-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-[-180px] mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <h3 className="font-bold text-slate-900">Сповіщення</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                            >
                                <Check className="w-3 h-3" /> Прочитати всі
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-sm font-bold text-slate-400">
                                    У вас немає нових сповіщень
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {notifications.map((notification) => {
                                    const {
                                        icon: Icon,
                                        color,
                                        bg,
                                    } = getIconInfo(notification.type);
                                    return (
                                        <div
                                            key={notification.id}
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification.id,
                                                    notification.link
                                                )
                                            }
                                            className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4 ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <div
                                                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${bg}`}
                                            >
                                                <Icon
                                                    className={`w-5 h-5 ${color}`}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 truncate">
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-2">
                                                    {new Date(
                                                        notification.createdAt
                                                    ).toLocaleString('uk-UA', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
