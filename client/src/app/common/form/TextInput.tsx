import React from 'react';
import {FieldRenderProps} from "react-final-form";
import {FormFieldProps, Form} from "semantic-ui-react";
import Label from "semantic-ui-react/dist/commonjs/elements/Label";


interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps{}

const TextInput: React.FC<IProps> = (props) => {

    return (
        <Form.Field error={props.meta.touched && !!props.meta.error} type={props.type} width={props.width}>
            <input {...props.input} placeholder={props.placeholder} />
            {props.meta.touched && props.meta.error && (
                <Label basic color='red'>
                    {props.meta.error}
                </Label>
            )}
        </Form.Field>
    );
};

export default TextInput;
