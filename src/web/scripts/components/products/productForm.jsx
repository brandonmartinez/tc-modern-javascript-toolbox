// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import {
    Form, FormGroup, Label, Input, Button
} from 'reactstrap';

// Containers and Components

class ProductForm extends React.Component {
    constructor(props) {
        super(props);

        this.initialState = {
            name: '',
            price: '',
            quantity: '',
            description: ''
        };
        this.state = this.initialState;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;

        // get name/value pair
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.addProduct(this.state);
        this.setState(this.initialState);
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input type="text" name="name" id="name" placeholder="Product Name" value={this.state.name} onChange={this.handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="price">Price</Label>
                    <Input type="text" name="price" id="price" placeholder="$0.00" value={this.state.price} onChange={this.handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="quantity">Quantity</Label>
                    <Input type="text" name="quantity" id="quantity" placeholder="0" value={this.state.quantity} onChange={this.handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="description">Description</Label>
                    <Input type="textarea" name="description" id="description" placeholder="" value={this.state.description} onChange={this.handleChange} />
                </FormGroup>
                <Button>Submit</Button>
            </Form>
        );
    }
}

// Todo: fill in proper shape
ProductForm.propTypes = {
    addProduct: PropTypes.func
};

export default ProductForm;