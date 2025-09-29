import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function TeamRec()
{
    const { region, team } = useParams();
    const [membersStats,setMembersStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);
    const [upcomingMatches,setUpcomingMatches] = useState([]);
    const [completedMatches,setCompletedMatches] = useState([]);

    useEffect(()=>{
        async function fetchStats()
        {
            setLoading(true);
            const result = await fetch(`https://vlrggapi.vercel.app/stats?region=${region}&timespan=30`)
            const stats = await result.json();
            setStats(stats.data.segments);
            setLoading(false);
        }
        function setMemberStats()
        {
            if(stats.length < 0)
                return;
            setLoading(true);
            const members = stats.filter(stat => stat.org === team);
            setMembersStats(members);
            setLoading(false);
        }
        fetchStats();
        setMemberStats();

    },[region, team]);

    useEffect(()=>{
        async function fetchMatches()
        {
            setLoading(true);
            const result = await fetch(`https://vlrggapi.vercel.app/match?q=upcoming`)
            const matches = await result.json();
            setMatches(matches.data.segments);
            setLoading(false);
        }
    },[region, team]);

}