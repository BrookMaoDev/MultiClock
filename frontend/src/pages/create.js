import React from "react";
import Form from "../components/create-post-form";
import Msg from "../components/flash-msg";

export default function Create() {
    return (
        <div>
            <h3 class="mb-6 text-2xl font-medium text-center">Create Game</h3>
            <Form />
        </div>
    );
}
