import React, {Fragment, useContext} from 'react';
import { Item } from 'semantic-ui-react'
import {observer} from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem";
import Label from "semantic-ui-react/dist/commonjs/elements/Label";
import {RootStoreContext} from "../../../app/stores/rootStore";
import {format} from 'date-fns';

interface IProps {}

const ActivityList: React.FC<IProps> = (props) => {
    const rootStore = useContext(RootStoreContext);
    const {activityStore} = rootStore;
    return (
        <Fragment>
            {activityStore.activitiesByDate.map(([group, activities]) =>(
            <Fragment key={group}>
                <Label size='large' color='blue'>
                    {format(group, 'eeee do MMMM')}
                </Label>
                <Item.Group divided>
                {activities.map(activityByDate =>(
                        <ActivityListItem key={activityByDate.id} activity={activityByDate} />
                    ))}
            </Item.Group>
            </Fragment>
            ))}
        </Fragment>
    );
};

export default observer(ActivityList);
