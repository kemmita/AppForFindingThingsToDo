import React, {Fragment, useContext, useEffect} from 'react';
import {Container} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {Button, Segment, Image, Header} from "semantic-ui-react";
import {RootStoreContext} from "../../app/stores/rootStore";
import LoginForm from "../user/LoginForm";
import RegisterForm from "../user/RegisterForm";
import {observer} from "mobx-react-lite";

const HomePage: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const{userStore, modalStore} = rootStore;

    useEffect (() =>{
        if (userStore.registerComplete) {
            modalStore.openModal(<LoginForm />)
        }
    }, );

    return (
        <Segment inverted textAlign='center' vertical className='masthead' >
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom: 12}}/>
                    Reactivities
                </Header>
                {userStore.isLoggedIn && userStore.user ?
                    <Fragment>
                        <Header as='h2' inverted content={`Welcome Back ${userStore.user.displayName}`} />
                        <Button as={Link} to='/activities' size='huge' inverted>
                            Go to activities!
                        </Button>
                    </Fragment> :
                    <Fragment>
                        <Header as='h2' inverted content='Welcome to Reactivities' />
                        <Button onClick={() => modalStore.openModal(<LoginForm />)} size='huge' inverted>
                            Login
                        </Button>
                        <Button onClick={() => modalStore.openModal(<RegisterForm />)} size='huge' inverted>
                            Register
                        </Button>
                    </Fragment>
                }
            </Container>
        </Segment>
    );
};

export default observer(HomePage);
