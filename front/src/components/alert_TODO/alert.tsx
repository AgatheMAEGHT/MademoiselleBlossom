import React from 'react';

import './alert.css';
import { alert } from '../types';

function Alert(props: alert) {
    let alertBackgroundColor = "#f8d7da";
    let alertColor = "#721c24";
    if (props.status === "success") {
        alertBackgroundColor = "#d4edda";
        alertColor = "#000f04";
    } else if (props.status === "info") {
        alertBackgroundColor = "#cce5ff";
        alertColor = "#002752";
    } else if (props.status === "warning") {
        alertBackgroundColor = "#fff3cd";
        alertColor = "#413000";
    }
    return (
        <div className="alert" id={props.id}>
            <div id="alert-background" ></div>
            <div id="alert-tile" style={{ backgroundColor: alertBackgroundColor, color: alertColor }}>
                <p>{props.message}</p>
                <button id="alert-button" onClick={() => { document.getElementById(props.id)!.style.display = "none"; document.getElementById("app")!.style.height = "initial"; document.getElementById("app")!.style.overflow = "initial"; }}>D'accord</button>
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
