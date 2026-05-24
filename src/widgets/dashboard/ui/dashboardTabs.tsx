'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui';

import { TournamentsList } from '@/features/tournaments';
import { TeamsList } from '@/features/teams';
import { MatchesList } from '@/features/matches';

export function DashboardTabs() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const tab = searchParams.get('tab');
    const [selectedTab, setSelectedTab] = useState('tournaments');

    useEffect(() => {
        if (tab) setSelectedTab(tab);
    }, [tab]);

    const handleTabChange = (value: string) => {
        setSelectedTab(value);
        router.push(`?tab=${value}`);
    };

    return (
        <Tabs value={selectedTab} onValueChange={handleTabChange}>
            <TabsList>
                <TabsTrigger value="tournaments">Турніри</TabsTrigger>
                <TabsTrigger value="teams">Команди</TabsTrigger>
                <TabsTrigger value="matches">Матчі</TabsTrigger>
            </TabsList>

            <TabsContent value="tournaments">
                <TournamentsList />
            </TabsContent>

            <TabsContent value="teams">
                <TeamsList />
            </TabsContent>

            <TabsContent value="matches">
                <MatchesList />
            </TabsContent>
        </Tabs>
    );
}
