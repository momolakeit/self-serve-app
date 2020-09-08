import { Component } from '@angular/core';
import { WebSocketAPI } from '../../../utilities/websocketapi';

@Component({
  selector: 'app-recipe-socket',
  templateUrl: './recipe-socket.component.html',
  styleUrls: ['./recipe-socket.component.css']
})
export class RecipeSocketComponent {

  webSocketAPI: WebSocketAPI;
  greeting: any;
  name: string;
  ngOnInit() {
    this.webSocketAPI = new WebSocketAPI(new RecipeSocketComponent());
  }

  connect(){
    this.webSocketAPI._connect();
  }

  disconnect(){
    this.webSocketAPI._disconnect();
  }

  sendMessage(){
    this.webSocketAPI._send(this.name);
  }

  handleMessage(message){
    this.greeting = message;
  }

}
