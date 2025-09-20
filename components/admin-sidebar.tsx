"use client"
import {
    BarChart3,
    Brain,
    CreditCard,
    DollarSign,
    Settings,
    Users,
    X
} from 'lucide-react';
import React from 'react';

interface SidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}
export const AdminSidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, isOpen, setIsOpen }) => {
    const menuItems: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
        { id: 'users', label: 'Users', icon: Users },
        { id: 'ai-models', label: 'AI Models', icon: Brain },
        { id: 'payments', label: 'Payments', icon: DollarSign },
        { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed top-0 left-0 h-full w-64 bg-sidebar-background border-r border-sidebar-border z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        md:w-20 lg:w-64
      `}>
                <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                    <h1 className="text-xl font-bold text-sidebar-foreground hidden lg:block">Admin Panel</h1>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 rounded-md hover:bg-sidebar-accent"
                    >
                        <X className="w-6 h-6 text-sidebar-foreground" />
                    </button>
                </div>

                <nav className="p-2 lg:p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            setActiveSection(item.id);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${activeSection === item.id
                                                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                            } justify-center lg:justify-start`}
                                        title={item.label}
                                    >
                                        <Icon className="w-5 h-5 lg:mr-3" />
                                        <span className="hidden lg:inline">{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </>
    );
};