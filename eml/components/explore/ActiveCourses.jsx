import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import ActiveExploreCard from './ActiveExploreCard'

export default function ActiveCourses({ courseList, filter }) {
    const [views, setViews] = useState([]);

    useEffect(() => {
        async function loadViews() {
            const componentPromises = courseList.map(({ title, iconPath, isDownloaded, courseId, category }, index) => {
                if (isDownloaded && category === filter) {
                    return <ActiveExploreCard key={index} title={title} courseId={courseId} uri={iconPath} />;
                } else if(isDownloaded && filter === -1){
                    return <ActiveExploreCard key={index} title={title} courseId={courseId} uri={iconPath} />;
                }
            });

            Promise.all(componentPromises).then(setViews);
        }

        loadViews();
    }, [filter]);

    return (
        <View className="flex-wrap flex-row flex-1 justify-evenly">
            {views}
        </View>
    )
}