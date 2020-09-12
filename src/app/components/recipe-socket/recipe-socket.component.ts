import { Component } from '@angular/core';
import { CsrfService } from 'src/app/services/csrf.service';
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

  constructor(private csrfService: CsrfService){}

  ngOnInit() {
    this.webSocketAPI = new WebSocketAPI(this,this.csrfService);
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
