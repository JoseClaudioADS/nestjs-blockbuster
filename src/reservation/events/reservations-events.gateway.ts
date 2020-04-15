import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'reservations' })
export class ReservationsEventsGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('identity')
    async identity(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any,
    ): Promise<any> {
        console.log(`Received of client ${client.id}`, data);
        return data;
    }
}
