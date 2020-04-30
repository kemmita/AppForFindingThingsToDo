import React from 'react';
import {observer} from "mobx-react-lite";
import {Tab} from "semantic-ui-react";
import AboutPane from "./Panes/AboutPane";
import PhotosPane from "./Panes/PhotosPane";
import ProfileFollowings from "./ProfileFollowings";
import ActivitiesPane from "./Panes/ActivitiesPane";

const panes = [
    {menuItem: 'About', render: () => <AboutPane />},
    {menuItem: 'Photos', render: () => <PhotosPane />},
    {menuItem: 'Activities', render: () => <ActivitiesPane />},
    {menuItem: 'Followers', render: () => <ProfileFollowings />},
    {menuItem: 'Following', render: () => <ProfileFollowings />}
];

interface IProps {
    setActiveTab: (activeIndex: any) => void;
}

const ProfileContent: React.FC<IProps> = (props) => {
    return (
        <Tab
            menu={{fluid: true, vertical: true}}
            menuPosition='right'
            panes={panes}
            onTabChange={(e, data) => props.setActiveTab(data.activeIndex)}
        />
    );
};

export default observer(ProfileContent);
