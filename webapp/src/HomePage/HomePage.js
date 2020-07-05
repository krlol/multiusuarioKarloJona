import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';

class HomePage extends React.Component {

    constructor(props){
        super(props)
        if(localStorage.getItem("user") === undefined || localStorage.getItem("user") === null || localStorage.getItem("user") === ""){
            window.location.href = "/login";
        }
    }
    
    componentDidMount() {
        //this.props.getUsers();
    }

    handleDeleteUser(id) {
        return (e) => this.props.deleteUser(id);
    }

    render() {
        const { users } = this.props;
        var user = {};

        if(localStorage.getItem("user")){
            user = JSON.parse(localStorage.getItem("user"));
            console.log(user)
        }
        
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hola {user.nombre}!</h1>
                <h2>Tu rol es: {user.rol}!</h2>
                <p>Te has logeado correctamente</p>
                <h3>Gracias por estar aquí!</h3>
                <p>
                    <button onClick={()=>{
                        window.location.href = "/login";
                        localStorage.removeItem("user")
                    }}>Salir</button>
                </p>
            </div>
        );
    }
}

function mapState(state) {
    return {}
}

const actionCreators = {
    getUsers: userActions.getAll,
    deleteUser: userActions.delete
}

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };