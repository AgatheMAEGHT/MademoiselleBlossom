import React from 'react';

import './alert.css';
import { alert } from '../types';

function Alert(props: alert) {
    return (
        <div className="alert" id={props.id}>
            <div id="alert-background"></div>
            <div id="alert-tile">
                <p>{props.message}</p>
                <button id="alert-button" onClick={() => { document.getElementById(props.id)!.style.display = "none"; document.getElementById("app")!.style.height = "initial"; document.getElementById("app")!.style.overflow = "initial" }}>D'accord</button>
            </div>
        </div >
    );
}

export function displayAlert(alertId: string) {
    document.getElementById(alertId)!.style.display = "flex";
    document.getElementById("app")!.style.height = "25vh";
    document.getElementById("app")!.style.overflow = "hidden";
}

export default Alert;
