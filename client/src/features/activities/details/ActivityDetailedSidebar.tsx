import React, {Fragment, useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Segment,Image} from "semantic-ui-react";
import List from "semantic-ui-react/dist/commonjs/elements/List";
import Item from "semantic-ui-react/dist/commonjs/views/Item";
import Label from "semantic-ui-react/dist/commonjs/elements/Label";
import {Link} from "react-router-dom";
import {IAttendee} from "../../../app/Interfaces/attendee";
import {RootStoreContext} from "../../../app/stores/rootStore";

interface IProps {
    attendees: IAttendee[]
}

const ActivityDetailedSidebar: React.FC<IProps> = (props) => {
    const rootStore = useContext(RootStoreContext);
    const {activityStore} = rootStore;
    const {activity} = activityStore;

    return (
        <Fragment>
            <Segment
                textAlign='center'
                style={{ border: 'none' }}
                attached='top'
                secondary
                inverted
                color='teal'
            >
                {activity!.attendees.length} People Going
            </Segment>
            <Segment attached>
                <List relaxed divided>
                    {   activity!.attendees.map(a => a.isHost  &&
                        <Item key={a.username} style={{ position: 'relative' }}>
                            <Label
                                style={{ position: 'absolute' }}
                                color='orange'
                                ribbon='right'
                            >
                                Host
                            </Label>
                            <Image size='tiny' src={a.image || '/assets/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Item.Header as='h3'>
                                    <Link to={`/profile/${a.username}`}>{a.displayName}</Link>
                                </Item.Header>
                                {a.following && <Item.Extra style={{color: 'orange'}}>Following</Item.Extra>}
                            </Item.Content>
                        </Item>)
                    }
                    {   activity!.attendees.map(a => !a.isHost  &&
                        <Item key={a.username} style={{ position: 'relative' }}>
                            <Image size='tiny' src={'/assets/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Item.Header as='h3'>
                                    <Link to={`/profile/${a.username}`}>{a.displayName}</Link>
                                </Item.Header>
                                {a.following && <Item.Extra style={{color: 'orange'}}>Following</Item.Extra>}
                            </Item.Content>
                        </Item>)
                    }
                </List>
            </Segment>
        </Fragment>
    );
};

export default observer(ActivityDetailedSidebar);
