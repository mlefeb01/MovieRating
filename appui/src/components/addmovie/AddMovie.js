import React, { Component, useState } from 'react';
import './AddMovie.css'

export class AddMovie extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleAdd() {
        this.props.add(this.state.value);
        this.setState({ value: '' });
    }

    render() {
        return (
            <div>
                <hr />
                <div className="container">
                    <textarea className="textbox" value={this.state.value} onChange={this.handleChange} />
                    <button className="button" onClick={this.handleAdd}>Add Movie</button>
                </div>
                <hr />
            </div>
        )
    }

}

export default AddMovie;