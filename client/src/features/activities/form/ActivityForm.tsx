import React, {useContext, useEffect, useState} from 'react';
import {Segment} from "semantic-ui-react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import {ActivityFormValues} from "../../../app/Interfaces/activity";
import {v4 as uuid} from 'uuid';
import {observer} from "mobx-react-lite";
import {RouteComponentProps} from "react-router";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";
import {Form as FinalForm, Field} from 'react-final-form';
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {combineValidators, composeValidators, hasLengthGreaterThan, isRequired} from 'revalidate';
import {RootStoreContext} from "../../../app/stores/rootStore";

const validate = combineValidators({
    title: isRequired('The event title is required'),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'}))
    (),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time')
});

interface IDetailParams {
    id: string
}

const ActivityForm: React.FC<RouteComponentProps<IDetailParams>> = (props) => {
    const rootStore = useContext(RootStoreContext);
    const {activityStore} = rootStore;

    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);
    useEffect (() =>{
        setLoading(true);
        if (props.match.params.id){
            activityStore.loadActivity(props.match.params.id).then((activity) => setActivity(
                new ActivityFormValues(activity)
            )).finally(() => setLoading(false));
        }else{
            setLoading(false);
            setActivity(new ActivityFormValues());
        }
    }, [activityStore, props.match.params.id]);

    const combineDateAndTime = (date: Date, time: Date): Date =>{
        // const timeString = time.getHours() + ':' + time.getMinutes() + ':00';
        // const year = date.getFullYear();
        // const month = date.getMonth() + 1;
        // const day = date.getDate();
        // const dateString = `${year}-${month}-${day}`;

        return new Date(date.toISOString().split('T')[0] + 'T' + date.toISOString().split('T')[1]);
    };

    const handleFinalFormSubmit = (values: any) =>{
          const dateAndTime = combineDateAndTime(values.date, values.time);
          const {date, time, ...activity} = values;
          activity.date = dateAndTime;
          if (!activity.id){
              let newActivity = {
                  ...activity,
                  id: uuid()
              };
              activityStore.createActivity(newActivity);
          } else {
              activityStore.editActivity(activity);
          }
    };

    const redirectAfterCancel = () =>{
        activity.id ? props.history.push(`/activity/${activity.id}`) :
                      props.history.push(`/activities`);
    };
    if (loading) return <LoadingComponent content={'Loading Activities...'} />;

        return (
            <Grid>
                <Grid.Column width={'10'}>
                    <Segment clearing>
                        <FinalForm validate={validate} initialValues={activity} onSubmit={handleFinalFormSubmit} render={(props) =>(
                            <Form onSubmit={props.handleSubmit}>
                                <Field name='title' placeholder='title' value={activity.title} component={TextInput}/>
                                <Field name='description' placeholder='Description' value={activity.description} component={TextAreaInput} rows={4}/>
                                <Field name='category' placeholder='Category' value={activity.category} component={SelectInput} />
                                <Form.Group widths={'equal'}>
                                    <Field date={true} name='date' placeholder='Date' value={activity.date} component={DateInput}/>
                                    <Field time={true} name='time' placeholder='Time' value={activity.time} component={DateInput}/>
                                </Form.Group>
                                <Field name='city' placeholder='City' value={activity.city} component={TextInput}/>
                                <Field name='venue' placeholder='Venue' value={activity.venue} component={TextInput}/>
                                <Button disabled={props.invalid || props.pristine} floated='right' type='submit' positive content='Submit'/>
                                <Button onClick={redirectAfterCancel} style={{backgroundColor: 'red', color: 'white'}} floated='right' type='submit' content='Cancel'/>
                            </Form>
                        )} />
                    </Segment>
                </Grid.Column>
            </Grid>
        );
};

export default observer(ActivityForm);
