import React, {useContext, useEffect, useState} from 'react';
import {Grid, Loader} from "semantic-ui-react";
import ActivityList from "./ActivityList";
import {observer} from "mobx-react-lite";
import {RootStoreContext} from "../../../app/stores/rootStore";
import InfiniteScoll from 'react-infinite-scroller'
import ActivityFilters from "./ActivityFilters";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";


interface IProps {}

const ActivityDashboard: React.FC<IProps> = (props) => {
    const rootStore = useContext(RootStoreContext);
    const {activityStore} = rootStore;
    const [loadingNext, setLoadingNext] = useState(false);

    const handleGetNext = () =>{
        setLoadingNext(true);
        activityStore.setPage(activityStore.page + 1);
        activityStore.loadActivities().then(() =>setLoadingNext(false));
    };

    useEffect (() =>{
        activityStore.loadActivities();
    }, [activityStore]);

    return (
        <Grid>
            <Grid.Column width={10}>
                {activityStore.loadingInitial && activityStore.page === 0 ?
                    <ActivityListItemPlaceholder />
                    :
                    <InfiniteScoll pageStart={0} loadMore={handleGetNext} hasMore={!loadingNext && activityStore.page + 1 < activityStore.totalPages} initialLoad={false}>
                        <ActivityList />
                    </InfiniteScoll>
                }
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDashboard);
