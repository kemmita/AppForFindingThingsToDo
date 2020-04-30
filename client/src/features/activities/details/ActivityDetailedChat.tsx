import React, {Fragment, useContext, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {Segment, Comment} from "semantic-ui-react";
import Header from "semantic-ui-react/dist/commonjs/elements/Header";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import {RootStoreContext} from "../../../app/stores/rootStore";
import {Form as FinalForm, Field} from "react-final-form";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import {formatDistance} from "date-fns";

interface IProps {
    activityId: string
}

const ActivityDetailedChat: React.FC<IProps> = (props) => {
    const rootStore = useContext(RootStoreContext);
    const {activityStore} = rootStore;

    useEffect(() =>{
        activityStore.createHubConnection(props.activityId);
        return() =>{
            activityStore.stopHubConnection(props.activityId);
        };
    }, [activityStore]);


    return (
        <Fragment>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached>
                <Comment.Group>
                    {activityStore.activity && activityStore.activity.comments && activityStore.activity!.comments.map((comment) =>(
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as='a'>{comment.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistance(comment.createdAt, new Date())}</div>
                                </Comment.Metadata>
                                <Comment.Text>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}
                        <FinalForm
                            onSubmit={activityStore.addComment}
                            render={(props) =>(
                                <Form reply onSubmit={() => props.handleSubmit()!.then(() => props.form.reset())}>
                                    {activityStore.activity!.comments.length > 0 ?
                                        <Field name={'body'} component={TextAreaInput} rows={3}
                                               placeholder={'Write Something Beautiful!'}/>
                                        :
                                        <Field name={'body'} component={TextAreaInput} rows={3}
                                               placeholder={'Be the first to write something cool!'}/>
                                    }
                                    <Button
                                        content='Add Reply'
                                        labelPosition='left'
                                        icon='edit'
                                        primary
                                        type={'submit'}
                                        disabled={props.invalid || props.pristine}
                                        loading={props.submitting}
                                    />
                                </Form>
                            )}/>
                </Comment.Group>
            </Segment>
        </Fragment>
    );
};

export default observer(ActivityDetailedChat);
