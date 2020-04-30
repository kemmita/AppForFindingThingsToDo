import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {RootStoreContext} from "../../app/stores/rootStore";
import {Form as FinalForm, Field} from 'react-final-form';
import {Button, Form, Header} from 'semantic-ui-react';
import TextInput from "../../app/common/form/TextInput";
import {IUserFormValues} from "../../app/Interfaces/user";
import {FORM_ERROR} from "final-form";
import {
    combineValidators,
    composeValidators,
    isRequired,
    createValidator
} from "revalidate";
import ErrorMessage from "../../app/common/form/ErrorMessage";

const customIsRequired = isRequired({ message: 'Required' })

const isValidEmail = createValidator(
    message => value => {
        if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            return message
        }
    },
    'Invalid email address'
);

const isVlaidPassword = createValidator(
    message => value => {
        if (value && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/i.test(value)) {
            return message
        }
    },
    'Invalid password'
);

const validate = combineValidators({
    email: composeValidators(
        customIsRequired,
        isValidEmail
    )(),
    password: composeValidators(
        customIsRequired,
        isVlaidPassword
    )('password'),
    displayName: isRequired('displayName'),
    username: isRequired('username'),
});

const RegisterForm: React.FC = (props) => {
    const rootStore = useContext(RootStoreContext);
    const {userStore} = rootStore;
    return (
        <FinalForm
            validate={validate}
            onSubmit={(values:IUserFormValues) => userStore.register(values).catch(err => ({
                [FORM_ERROR] : err
            }))}
            render={({handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit,values}) =>(
                <Form onSubmit={handleSubmit} error>
                    <Header content='Register Now!' textAlign='center' style={{color: '#1E6F9D'}} size={'large'}/>
                    <Field name='email' component={TextInput} placeholder='Email' />
                    <Field name='displayName' component={TextInput} placeholder='DisplayName' />
                    <Field name='username' component={TextInput} placeholder='Username' />
                    <Field name='password' type='password' component={TextInput} placeholder='Password' />
                    {submitError && !dirtySinceLastSubmit && <ErrorMessage error={submitError.message} text={'If you got this far, you forgot to place an uppercase letter in the password!'}/>}
                    <br/>
                    <Button fluid disabled={invalid && !dirtySinceLastSubmit || pristine} style={{backgroundColor: '#1E6F9D', color: 'white'}} content='Register' loading={submitting}/>
                </Form>
            )}
        />
    );
};

export default observer(RegisterForm);
