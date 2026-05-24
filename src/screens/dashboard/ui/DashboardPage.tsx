'use client';

import { Header } from '@/shared/ui';
import { DashboardTabs } from '@/widgets/dashboard';

export function DashboardPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <main className="p-6 max-w-7xl mx-auto">
                <DashboardTabs />
            </main>
        </div>
    );
}
