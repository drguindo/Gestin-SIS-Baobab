import React from 'react';
import type { Notification } from '../../types';
import { NotificationType } from '../../types';
import { ArchiveBoxIcon, UserPlusIcon, ExclamationTriangleIcon } from '../ui/icons';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
    [NotificationType.STOCK]: <ArchiveBoxIcon className="w-6 h-6 text-yellow-500" />,
    [NotificationType.ADMISSION]: <UserPlusIcon className="w-6 h-6 text-blue-500" />,
    [NotificationType.SYSTEM]: <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />,
};

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead, onClose }) => {
    return (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-secondary rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Notifications</h3>
                <button 
                    onClick={onMarkAllAsRead} 
                    className="text-sm text-primary hover:underline disabled:text-gray-400"
                    disabled={notifications.every(n => n.read)}
                >
                    Tout marquer comme lu
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div 
                            key={notification.id} 
                            onClick={() => onMarkAsRead(notification.id)}
                            className={`flex items-start p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${!notification.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                        >
                            <div className="flex-shrink-0 mr-4">
                                {notificationIcons[notification.type]}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 dark:text-gray-100">{notification.title}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notification.timestamp}</p>
                            </div>
                            {!notification.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full ml-4 mt-1 flex-shrink-0"></div>}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">Aucune notification</p>
                )}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 text-center">
                <button onClick={onClose} className="text-sm font-medium text-primary hover:underline">
                    Fermer
                </button>
            </div>
        </div>
    );
};

export default NotificationsPanel;
