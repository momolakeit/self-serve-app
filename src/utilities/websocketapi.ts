import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { RecipeSocketComponent } from 'src/app/components/recipe-socket/recipe-socket.component';
import {CsrfService} from '../app/services/csrf.service';

export class WebSocketAPI {
    webSocketEndPoint: string = 'http://localhost:8080/gs-guide-websocket';
    topic: string = "/topic/greetings";
    stompClient: any;
    recipeSocketComponent: RecipeSocketComponent;

    constructor(recipeSocketComponent: RecipeSocketComponent,private csrf:CsrfService){
        this.recipeSocketComponent = recipeSocketComponent;
    }

    _connect() {
        //GET HEADER

        this.csrf.getCsrf().subscribe((data) =>{
            // getcsrfToken
            var headers = {};
            headers[data.headerName] = data.token;

            //get jwt token
            var token = {};
            token['Authorization'] = localStorage.getItem("token");
            console.log(data.headerName);
            
            console.log("Initialize WebSocket Connection");
            let ws = new SockJS(this.webSocketEndPoint);
            this.stompClient = Stomp.over(ws);
            const _this = this;
            
            _this.stompClient.connect({headers,token}, function (frame) {
                _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
                    _this.onMessageReceived(sdkEvent);
                });
                //_this.stompClient.reconnect_delay = 2000;
            }, this.errorCallBack);
        })
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this._connect();
        }, 5000);
    }

 /**
  * Send message to sever via web socket
  * @param {*} message 
  */
    _send(message) {
        console.log("calling logout api via web socket");
        this.stompClient.send("/app/hello", {}, JSON.stringify(message));
    }

    onMessageReceived(message) {
        console.log("Message Recieved from Server :: " + message);
        this.recipeSocketComponent.handleMessage(JSON.stringify(message.body));
    }
}