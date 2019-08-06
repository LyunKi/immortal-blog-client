export interface IMessage {
    messageType: 'messages' | 'notifications';
    title: string;
    content: string;
    href?: string;
    img?: string;
    createAt: string;
}
