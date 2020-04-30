import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {RootStoreContext} from "../../app/stores/rootStore";
import {Form as FinalForm, Field} from 'react-final-form';
import {Button, Form, Header} from 'semantic-ui-react';
import TextInput from "../../app/common/form/TextInput";
import {IUserFormValues} from "../../app/Interfaces/user";
import {FORM_ERROR} from "final-form";
import {combineValidators, isRequired} from "revalidate";
import ErrorMessage from "../../app/common/form/ErrorMessage";

const validate = combineValidators({
   email: isRequired('email'),
   password: isRequired('password')
});

const LoginForm: React.FC = (props) => {
    const rootStore = useContext(RootStoreContext);
    const {userStore} = rootStore;
    return (
        <FinalForm
            validate={validate}
            onSubmit={(values:IUserFormValues) => userStore.login(values).catch(err => ({
                [FORM_ERROR] : err
            }))}
            render={({handleSubmit, submitting, form, submitError, invalid, pristine, dirtySinceLastSubmit}) =>(
                <Form onSubmit={handleSubmit} error>
                    <Header content='Login Now!' textAlign='center' style={{color: '#1E6F9D'}} size={'large'}/>
                    <Field name='email' component={TextInput} placeholder='Email' />
                    <Field name='password' type='password' component={TextInput} placeholder='Password' />
                    {submitError && !dirtySinceLastSubmit && <ErrorMessage error={submitError.message} text={'Invalid email or password'}/>}
                    <br/>
                    <Button fluid disabled={invalid && !dirtySinceLastSubmit || pristine} style={{backgroundColor: '#1E6F9D', color: 'white'}} content='Login' loading={submitting}/>
                </Form>
            )}
        />
    );
};

export default observer(LoginForm);
