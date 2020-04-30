import React, {Fragment, useContext} from 'react';
import { Menu, Header } from 'semantic-ui-react';
import { Calendar } from 'react-widgets';
import {observer} from "mobx-react-lite";
import {RootStoreContext} from "../../../app/stores/rootStore";

const ActivityFilters = () => {
    const rootStore = useContext(RootStoreContext);
    const {activityStore} = rootStore;
    return(
        <Fragment>
            <Menu vertical size={'large'} style={{width: '100%', marginTop: 50}}>
                <Header icon={'filter'} attached color={'teal'} content={'Filters'}/>
                <Menu.Item
                    color={'blue'}
                    name={'all'}
                    content={'All Activities'}
                    onClick={() =>activityStore.setPredicate('all', 'true')}
                    active={activityStore.predicate.size === 0}
                />
                <Menu.Item
                    color={'blue'}
                    name={'username'}
                    content={"I'm Going"}
                    onClick={() => activityStore.setPredicate('isGoing', 'true')}
                    active={activityStore.predicate.has('isGoing')}
                />
                <Menu.Item
                    color={'blue'}
                    name={'host'}
                    content={"I'm hosting"}
                    onClick={() => activityStore.setPredicate('isHost', 'true')}
                    active={activityStore.predicate.has('isHost')}
                />
            </Menu>
            <Header
                icon={'calendar'}
                attached
                color={'teal'}
                content={'Select Date'}/>
            <Calendar
                onChange={(date) => activityStore.setPredicate('startDate', date!)}
                value={activityStore.predicate.get('startDate') || new Date()}
            />
        </Fragment>
    )
};

export default observer(ActivityFilters);
