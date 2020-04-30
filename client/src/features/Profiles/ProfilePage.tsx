import React, {Fragment, useContext, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import {RootStoreContext} from "../../app/stores/rootStore";
import {RouteComponentProps} from "react-router";
import LoadingComponent from "../../app/layout/LoadingComponent";

interface IDetailParams {
    username: string
}

const ProfilePage: React.FC<RouteComponentProps<IDetailParams>> = (props) => {
    const rootStore = useContext(RootStoreContext);
    const {userStore} = rootStore;

    useEffect (() =>{
        userStore.getUserProfileData(props.match.params.username);
        userStore.getCurrentUserProfileData(userStore.user!.username);
    }, [userStore, userStore.getUserProfileData, props.match.params.username]);

    if (userStore.loadingProfile) return <LoadingComponent content='Loading Profile...' />;

    return (
        <Fragment>
            <ProfileHeader
                profileData={userStore.profile!}
                follow={userStore.follow}
                unfollow={userStore.unfollow}
                loading={userStore.loading}
                isCurrentUser={userStore.isCurrentUser}
            />
            <ProfileContent setActiveTab={userStore.setActiveTab}/>
        </Fragment>
    );
};

export default observer(ProfilePage);
