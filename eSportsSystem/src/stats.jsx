import React from 'react';
import { useState, useEffect } from 'react';


export default function Stats()
{
    const [segments, setSegments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState('na');
    const [timespan, setTimespan] = useState('30');

    useEffect(()=>{
         async function fetchStats()
        {
            setLoading(true);
            const result = await fetch(`https://vlrggapi.vercel.app/stats?region=${region}&timespan=${timespan}`)
            const segments = await result.json();
            setSegments(segments.data.segments);
            setLoading(false);
        }
        fetchStats();
    },[region, timespan])
}