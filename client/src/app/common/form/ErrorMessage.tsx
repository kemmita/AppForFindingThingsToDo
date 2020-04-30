import React from 'react';
import {observer} from "mobx-react-lite";
import {AxiosResponse} from "axios";
import {Message} from "semantic-ui-react";

interface IProps {
    error: AxiosResponse,
    text: string
}

const ErrorMessage: React.FC<IProps> = (props) => {
    return (
        <Message error>
            <Message.Header>{props.error.statusText}</Message.Header>
            {props.text && <Message.Content content={props.text}/>}
        </Message>
    );
};

export default observer(ErrorMessage);
