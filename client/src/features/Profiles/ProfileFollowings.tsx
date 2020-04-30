import React, {useContext, useEffect} from 'react';
import { Tab, Grid, Header, Card } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileCard from './ProfileCard';
import {observer} from 'mobx-react-lite';

interface IProps {
}

const ProfileFollowings: React.FC<IProps> = (props) => {
    const rootStore = useContext(RootStoreContext);
    const userStore = rootStore.userStore;

    return (
        <Tab.Pane loading={userStore.loading}>
            <Grid>
                <Grid.Column width={16}>
                    <Header
                        floated='left'
                        icon='user'
                        content={
                            userStore.activeTab === 3
                                ? `People following ${userStore.profile!.displayName}` : `People ${userStore.profile!.displayName} is following`
                        }
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={5}>
                        {userStore.followings.map((profile) =>(
                            <ProfileCard key={profile.username} profile={profile} />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
};

export default observer(ProfileFollowings);
