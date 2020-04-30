import React from 'react';
import {observer} from "mobx-react-lite";
import {Button, Divider, Grid, Header, Item, Reveal, Segment, Statistic} from "semantic-ui-react";
import {IProfile} from "../../app/Interfaces/profile";

interface IProps {
    profileData: IProfile
    follow: (username: string) => void;
    unfollow: (username: string) => void;
    isCurrentUser: boolean,
    loading: boolean
}

const ProfileHeader: React.FC<IProps> = (props) => {

        return (
            <Segment>
                <Grid>
                    <Grid.Column width={12}>
                        <Item.Group>
                            <Item>
                                <Item.Image
                                    avatar
                                    size='small'
                                    src={props.profileData.image ? props.profileData.image : '/assets/user.png'}
                                />
                                <Item.Content verticalAlign='middle'>
                                    <Header as='h1'>{props.profileData.displayName}</Header>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Statistic.Group widths={2}>
                            <Statistic label='Followers' value={props.profileData.followersCount}/>
                            <Statistic label='Following' value={props.profileData.followingCount}/>
                        </Statistic.Group>
                        <Divider/>
                        {!props.isCurrentUser &&
                            <Reveal animated='move'>
                                <Reveal.Content visible style={{width: '100%'}}>
                                    <Button
                                        fluid
                                        color='teal'
                                        content={props.profileData.following ? 'Following' : 'Not Following'}
                                    />
                                </Reveal.Content>
                                <Reveal.Content hidden>
                                    {props.profileData.following ?
                                        <Button
                                            loading={props.loading}
                                            fluid
                                            basic
                                            color={'red'}
                                            content={'Unfollow'}
                                            onClick={() => props.unfollow(props.profileData!.username)}
                                        />
                                    :
                                        <Button
                                            loading={props.loading}
                                            fluid
                                            basic
                                            color={'green'}
                                            content={'Follow'}
                                            onClick={() => props.follow(props.profileData!.username)}
                                        />
                                    }
                                </Reveal.Content>
                            </Reveal>
                        }
                    </Grid.Column>
                </Grid>
            </Segment>
        );
    };

export default observer(ProfileHeader);


