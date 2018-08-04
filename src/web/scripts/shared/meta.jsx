// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export default class Meta extends React.Component {
    constructor(props) {
        super(props);

        this.title = props.title;
    }

    render() {
        return (<Helmet>
            <meta charSet="utf-8" />
            <title>{this.title + ' | The Modern JavaScript Toolbox | That Conference 2018 Precon'}</title>
        </Helmet>);
    }
}

Meta.propTypes = {
    title: PropTypes.string
};