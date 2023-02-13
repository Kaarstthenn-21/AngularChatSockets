import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { usuario } from '../models/usuario';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  public usuario?: usuario | undefined;


  constructor(
    private socket: Socket
  ) {
    this.checkStatus();
    this.cargarStorage();
  }

  checkStatus() {

    this.socket.on('connect', () => {
      console.log("Conectado al servidor");
      this.socketStatus = true;
    });

    this.socket.on('disconnect', () => {
      console.log("Desconectado del servidor");
      this.socketStatus = false;
    });
  }

  emit(evento: string, payload: any, callback?: Function) {
    // emit('evento',payload, callback?)
    this.socket.emit(evento, payload, callback);
  }

  listen(evento: string) {
    return this.socket.fromEvent(evento);
  }

  loginWS(nombre: string) {
    return new Promise<void>((resolve, reject) => {
      this.emit('configurar-usuario', { nombre }, (resp: any) => {

        this.usuario = new usuario(nombre);
        this.guardarStorage();
        resolve();

      });
    });
  }

  getUsuario() {
    return this.usuario;
  }
  guardarStorage() {
    localStorage.setItem('usuario', JSON.stringify(this.usuario));
  }

  cargarStorage() {
    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario') ?? "");
      this.loginWS(this.usuario?.nombre ?? "");
    }
  }
}
