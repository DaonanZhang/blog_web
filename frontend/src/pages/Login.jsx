import Form from "../components/Form";
import React from "react";

function Login() {
    return <Form route="/api/token/" methode="login" />
}

export default Login