import React from 'react';
import {Item} from "semantic-ui-react";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import {Link} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {IActivity} from "../../../app/Interfaces/activity";
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";
import {Image, Popup} from "semantic-ui-react";
import {format} from 'date-fns';
import Label from "semantic-ui-react/dist/commonjs/elements/Label";

const hostName = (activity: IActivity) =>{
    const hostToReturn = activity.attendees.find(a => a.isHost);
    if (hostToReturn)
    return hostToReturn.displayName;
};

interface IProps {
    activity: IActivity;
}

const ActivityListItem: React.FC<IProps> = ({activity}) => {
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image fluid src={`/assets/categoryImages/${activity.category}.jpg` ||'/assets/user.png'}  />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activity/${activity.id}`}>{activity.title}</Item.Header>
                            <Item.Description>
                                Hosted By: <Link to={`/profile/${hostName(activity)}`}> {hostName(activity)} </Link>
                            </Item.Description>
                            {activity.isHost &&
                                <Item.Description>
                                    <Label basic color={'orange'} content={'You are hosting this activity'}/>
                                </Item.Description>
                            }
                            {activity.isGoing && !activity.isHost &&
                            <Item.Description>
                                <Label basic color={'green'} content={'You are going to this activity'}/>
                            </Item.Description>
                            }
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' /> {format(activity.date, 'h:mm a')}
                <Icon name='marker' /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                <Image.Group size='mini'>
                    {activity.attendees.map(
                        a => !a.isHost &&
                            <Link key={a.username} to={`/profile/${a.username}`}>
                                <Popup
                                    trigger={<Item.Image size='mini' circular src={a.image || '/assets/user.png'} />}
                                    content={a.displayName}
                                    key={a.username}
                                    position={'top center'}
                                />
                            </Link>
                    )}
                </Image.Group>
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to={`/activity/${activity.id}`} floated='right' content='view' color='blue'/>
            </Segment>
        </Segment.Group>
    );
};

export default observer(ActivityListItem);
