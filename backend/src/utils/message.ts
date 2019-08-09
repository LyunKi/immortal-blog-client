import { IMessage } from '@interfaces';
import { each } from 'lodash';
import { Navigator } from '@utils';

export function produceMessage(messages: IMessage[]) {
    each(messages, (message: IMessage) => {
        const title = `Hi,some new ${message.message_type} for you`;
        const options = {
            body: message.content,
            icon: message.img,
        };
        const notification = new Notification(title, options);
        if (message.href && notification) {
            notification.onclick = () => {
                //@ts-ignore
                Navigator.goto(message.href);
            };
        }
    });
}
