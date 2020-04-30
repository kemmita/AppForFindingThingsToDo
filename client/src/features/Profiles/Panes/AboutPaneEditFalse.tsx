import React, {Fragment, useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Container, Divider} from "semantic-ui-react";
import {RootStoreContext} from "../../../app/stores/rootStore";

interface IProps {}

const AboutPaneEditFalse: React.FC<IProps> = (props) => {
    const rootStore = useContext(RootStoreContext);
    const {userStore} = rootStore;
    return (
        <Fragment>
            <Divider style={{marginTop: '7%'}}/>
            <Container textAlign={'justified'}>
                <p>
                    {userStore.profile ? userStore.profile.bio : 'Bio Goes Here!'}
                </p>
            </Container>
        </Fragment>
    );
};

export default observer(AboutPaneEditFalse);
