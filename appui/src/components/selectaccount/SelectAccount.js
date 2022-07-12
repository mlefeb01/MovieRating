import React, { Component } from 'react';

export class SelectAccount extends Component {

    constructor(props) {
        super(props);
        this.state = { account: props.web3.eth.accounts[0] }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const account = event.target.value;
        this.props.web3.eth.defaultAccount = account;
        this.setState({ account });
    }

    render() {
        let accounts = this.props.web3.eth.accounts.map((account, i) => 
            <option key={i} value={account}>{i}: {account}</option>
        );
        return (
            <div>
                <select value={this.state.account} onChange={this.handleChange}>
                    {accounts}
                </select>
            </div>
        )
    }

}