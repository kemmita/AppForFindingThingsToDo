import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Header, Tab} from "semantic-ui-react";
import {RootStoreContext} from "../../../app/stores/rootStore";
import AboutPaneEditFalse from "./AboutPaneEditFalse";
import AboutPaneEditTrue from "./AboutPaneEditTrue";
import {IProfile} from "../../../app/Interfaces/profile";

interface IProps {}

const AboutPane: React.FC<IProps> = (props) => {
    const rootStore = useContext(RootStoreContext);
    const {userStore} = rootStore;
    const [editProfile, setEditProfile] = useState<boolean>(false);
    const handleFormSubmit = (values: IProfile) =>{
        userStore.updateUserProfileData(values);
        setEditProfile(false);
    };

    return (
            <Tab.Pane>
                <Header floated={'left'} icon={'user'} content={`About: ${userStore.user!.displayName}`}  />
                {!editProfile && <Button floated={'right'} content={'Edit Profile'} onClick={() => setEditProfile(true)}/>}
                {editProfile && <Button floated={'right'} content={'Cancel'} onClick={() => setEditProfile(false)}/>}
                {!editProfile &&
                    <AboutPaneEditFalse />
                }
                {editProfile &&
                    <AboutPaneEditTrue profile={userStore.profile!} handleFormSubmit={handleFormSubmit}/>
                }
            </Tab.Pane>
    );
};

export default observer(AboutPane);
