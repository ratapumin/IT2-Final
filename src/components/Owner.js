import React, { Component } from 'react';
import User from './User';

class Owner extends Component {
    constructor(props) {
        super(props);
        this.user = new User(props.user_fname, props.user_lname, props.user_tel);
        this.state = {
            user_fname: props.user_fname,
            user_lname: props.user_lname,
            user_tel: props.user_tel,
            role: props.role,
            user_status: props.user_status
        };
    }

    set_role(role) {
        this.setState({ role });
    }

    get_role() {
        return this.state.role;
    }

    set_user_status(user_status) {
        this.setState({ user_status });
    }

    get_user_status() {
        return this.state.user_status;
    }

    ownerprintInfo() {
        this.user.userprintInfo();
        console.log('Role: ', this.get_role());
        console.log('Status: ', this.get_user_status());
    }
    testprops() {
        const new_fname = 'rata';
        const new_lname = 'nana';
        const new_tel = '066222';
        const new_role = 'A';
        const new_status = 'active';

        this.setState({
            user_fname: new_fname,
            user_lname: new_lname,
            user_tel: new_tel,
            role: new_role,
            user_status: new_status
        });

        // Update the user instance
        this.user.set_fname(new_fname);
        this.user.set_lname(new_lname);
        this.user.set_tel(new_tel);
    }



    render() {
        return (
            <div>
                <p> {this.user.get_fname()}</p>
                <p>{this.user.get_lname()}</p>
                <p>{this.user.get_tel()}</p>
                <p>{this.get_role()}</p>
                <p>{this.get_user_status()}</p>
                <button onClick={() => this.testprops()}> eiei   </button>
            </div>
        );
    }
}

export default Owner;
