import React, {Fragment} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Container, Form} from "semantic-ui-react";
import {Field, Form as FinalForm} from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import {IProfile} from "../../../app/Interfaces/profile";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import {combineValidators, isRequired} from "revalidate";

interface IProps {
    profile: IProfile,
    handleFormSubmit: (values: any) => void
}

const validate = combineValidators({
    displayName: isRequired('Display Name cannot be left empty!'),
    bio: isRequired('Bio cannot be left empty')
});

const AboutPaneEditTrue: React.FC<IProps> = ({profile, handleFormSubmit}) => {

    return (
        <Fragment>
            <Container style={{marginTop: '7%'}}>
                <FinalForm
                    validate={validate}
                    onSubmit={handleFormSubmit}
                    initialValues={profile!}
                           render={(props) =>(
                    <Form onSubmit={props.handleSubmit}>
                        <Field name={'displayName'} component={TextInput} value={profile!.displayName}/>
                        <Field name={'bio'} component={TextAreaInput} rows={3} placeholder={'Bio'} value={profile!.bio} />
                        <Button disabled={props.invalid || props.pristine} floated='right' type='submit' positive content='Submit'/>
                    </Form>
                )}/>
            </Container>
        </Fragment>
    );
};

export default observer(AboutPaneEditTrue);
