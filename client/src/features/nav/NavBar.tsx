import React, {useContext} from 'react';
import {Menu, Dropdown, Image} from "semantic-ui-react";
import Container from "semantic-ui-react/dist/commonjs/elements/Container";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import {observer} from "mobx-react-lite";
import {Link, NavLink} from "react-router-dom";
import {RootStoreContext} from "../../app/stores/rootStore";

interface IProps {}

const NavBar: React.FC<IProps> = (props) => {
    const rootStore = useContext(RootStoreContext);
    const {userStore} = rootStore;

    return (
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities' as={NavLink} to='/activities'/>
                <Menu.Item>
                    <Button as={NavLink} to='/createActivity' positive content='Create Activity' />
                </Menu.Item>
                {userStore.user &&
                <Menu.Item position='right'>
                    <Image avatar spaced='right' src={userStore.user.image} />
                    <Dropdown pointing='top left' text={userStore.user.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/profile/${userStore.user.username}`} text={`${userStore.user.username}' profile`} icon='user'/>
                            <Dropdown.Item onClick={userStore.logout} text='Logout' icon='power' />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
                }
            </Container>
        </Menu>
    );
};

export default observer(NavBar);
