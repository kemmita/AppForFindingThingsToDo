import React from 'react';
import {FieldRenderProps} from "react-final-form";
import {FormFieldProps, Form, Select} from "semantic-ui-react";
import Label from "semantic-ui-react/dist/commonjs/elements/Label";

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps{}

const SelectInput: React.FC<IProps> = (props) => {

    return (
        <Form.Field error={props.meta.touched && !!props.meta.error} width={props.width}>
            <Select value={props.input.value} onChange={(e, data) => props.input.onChange(data.value)} placeholder={props.placeholder} options={categories}/>
            {props.meta.touched && props.meta.error && (
                <Label basic color='red'>
                    {props.meta.error}
                </Label>
            )}
        </Form.Field>
    );
};

const categories = [
    {key: 'drinks', text: 'Drinks', value: 'drinks'},
    {key: 'culture', text: 'Culture', value: 'culture'},
    {key: 'film', text: 'Film', value: 'film'},
    {key: 'food', text: 'Food', value: 'food'},
    {key: 'music', text: 'Music', value: 'music'},
    {key: 'travel', text: 'Travel', value: 'travel'}
];

export default SelectInput;
