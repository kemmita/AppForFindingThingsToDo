import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {IActivity} from "../../../app/Interfaces/activity";
import {Segment} from "semantic-ui-react";
import Item from "semantic-ui-react/dist/commonjs/views/Item";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import Header from "semantic-ui-react/dist/commonjs/elements/Header"
import Image from "semantic-ui-react/dist/commonjs/elements/Image"
import {Link} from "react-router-dom";
import {format} from "date-fns";
import {RootStoreContext} from "../../../app/stores/rootStore";

interface IProps {
    activity: IActivity
}

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};





const ActivityDetailedHeader: React.FC<IProps> = (props) => {

    const rootStore = useContext(RootStoreContext);
    const {activityStore} = rootStore;

    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                <Image style={activityImageStyle} src={`/assets/categoryImages/${props.activity.category}.jpg`} fluid />
                <Segment basic style={activityImageTextStyle}>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={props.activity.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{format(props.activity.date, 'eeee do MMMM')}</p>
                                <p>
                                    Hosted by <strong>Bob</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {!props.activity.isHost && !props.activity.isGoing &&  <Button color='teal' onClick={() => activityStore.attendActivity(props.activity.id)}>Join Activity</Button>}
                {props.activity.isGoing && !props.activity.isHost && <Button onClick={() => activityStore.cancelAttendance(props.activity.id)}>Cancel attendance</Button>}
                {props.activity.isHost &&
                <Button as={Link} to={`/manage/${props.activity.id}`} color='orange' floated='right'>
                    Manage Event
                </Button>}
                {props.activity.isHost &&
                <Button onClick={() =>{activityStore.deleteActivity(props.activity.id)}} color='red' floated='left'>
                    Delete Event
                </Button>}
            </Segment>
        </Segment.Group>
    );
};

export default observer(ActivityDetailedHeader);
