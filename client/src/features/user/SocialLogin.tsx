import React from 'react';
import {observer} from "mobx-react-lite";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import {Button, Icon} from "semantic-ui-react";

interface IProps {
    fbCallback: (response: any) => void;
}

const ActivityDetails: React.FC<IProps> = (props) => {
    return (
        <div>
            <FacebookLogin
                appId='534231783929420'
                fields='name,email,picture'
                callback={props.fbCallback}
                render={(renderProps: any) =>(
                    <Button onClick={renderProps.onClick} type='button' fluid color={'facebook'}>
                        <Icon name={'facebook'} />
                        Login Mit Facebook
                    </Button>
                )}
            />
        </div>
    );
};

export default observer(ActivityDetails);
