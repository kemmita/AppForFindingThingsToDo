import React, {useContext, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {RouteComponentProps} from "react-router";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";
import {RootStoreContext} from "../../../app/stores/rootStore";

interface IDetailParams {
    id: string
}

const ActivityDetails: React.FC<RouteComponentProps<IDetailParams>> = (props) => {
    const rootStore = useContext(RootStoreContext);
    const {activityStore} = rootStore;
    const {activity, loadActivity, loadingInitial} = activityStore;

    useEffect (() =>{
        loadActivity(props.match.params.id);
    }, [loadActivity, props.match.params.id]);



    if (loadingInitial) return <LoadingComponent content='Loading Activity...' />;
    if (!activity){
        return <Grid></Grid>;
    }
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activityStore.activity!} />
                <ActivityDetailedInfo activity={activityStore.activity!} />
                <ActivityDetailedChat activityId={props.match.params.id} />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar attendees={activityStore.activity!.attendees} />
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDetails);
