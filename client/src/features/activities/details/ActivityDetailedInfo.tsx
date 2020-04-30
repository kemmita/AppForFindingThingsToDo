import React  from 'react';
import {observer} from "mobx-react-lite";
import {IActivity} from "../../../app/Interfaces/activity";
import {Icon} from "semantic-ui-react";
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";
import {format} from "date-fns";

interface IProps {
    activity: IActivity
}

const ActivityDetailedInfo: React.FC<IProps> = (props) => {
    return (
        <Segment.Group>
            <Segment attached='top'>
                <Grid>
                    <Grid.Column width={1}>
                        <Icon size='large' color='teal' name='info' />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <p>{props.activity.description}</p>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='calendar' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={15}>
            <span>
              {format(props.activity.date, 'eeee do MMMM')} at {format(props.activity.date, 'h: mm a')}
            </span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='marker' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <span>{props.activity.venue}, {props.activity.city}</span>
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment.Group>
    );
};

export default observer(ActivityDetailedInfo);
