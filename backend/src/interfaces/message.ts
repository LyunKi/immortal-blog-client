export interface IMessage {
    message_type: 'messages' | 'notifications';
    title: string;
    content: string;
    href?: string;
    img?: string;
    createAt: string;
}
