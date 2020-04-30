import React, {Fragment, useContext, useEffect} from 'react';
import NavBar from '../../features/nav/NavBar'
import {Container} from "semantic-ui-react";
import {observer} from "mobx-react-lite";
import {Route, RouteComponentProps, Switch, withRouter} from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import {ToastContainer} from "react-toastify";
import WhatTheHeck from "./WhatTheHeck";
import {RootStoreContext} from "../stores/rootStore";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import ProfilePage from "../../features/Profiles/ProfilePage";
import PrivateRoute from "./PrivateRoute";
const App: React.FC<RouteComponentProps> = ({location}) => {
    const rootStore = useContext(RootStoreContext);
    const {commonStore, userStore} = rootStore;

    useEffect(() =>{
       if (commonStore.token){
           userStore.getCurrentUser().finally(() => commonStore.setAppLoaded());
       }else {
           commonStore.setAppLoaded();
       }
    }, [commonStore, userStore]);

    if (!commonStore.appLoaded){
        return <LoadingComponent content='Loading Cool Application' />
    }

    return (
        <Fragment>
            <ModalContainer />
            <ToastContainer position={"bottom-right"} />
            <Route exact path='/' component={HomePage}/>
            <Route path={'/(.+)'} render={() => (
                <Fragment>\
                    <NavBar />
                    <Container style={{marginTop: '7em'}}>
                        <Switch>
                            <PrivateRoute exact path='/activities' component={ActivityDashboard}/>
                            <PrivateRoute exact path='/activity/:id' component={ActivityDetails}/>
                            <PrivateRoute exact path='/profile/:username' component={ProfilePage}/>
                            <PrivateRoute exact path={['/createActivity', '/manage/:id']} component={ActivityForm}/>
                            <PrivateRoute exact path={['/theHeck']} component={WhatTheHeck}/>
                            <PrivateRoute component={NotFound}/>
                        </Switch>
                    </Container>
                </Fragment>
            )}/>
        </Fragment>
    );
};

export default withRouter(observer(App));
