import * as signalR from '@microsoft/signalr';

const hub = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5246/hub')
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Error)
    .build();

export default hub;
