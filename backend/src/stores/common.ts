import { RootStore } from '@stores';
import { action, computed, observable } from 'mobx';
import { Storage } from '@utils';
import { WS_SERVER } from '@configs';
import { partition, take } from 'lodash';
import { IMessage } from '@interfaces';

const BASIC_NUM = 3;

export class CommonStore {
    private rootStore: RootStore;
    private connection?: WebSocket;

    @observable collapsed = false;
    @observable showMessageKey: string = 'notifications';
    @observable messages: IMessage[] = [];
    @observable notifications: IMessage[] = [];
    @observable showNum = BASIC_NUM;

    @computed get totalNum(): number {
        return this.messages.length + this.notifications.length;
    }

    @computed get canLoadMore(): boolean {
        return this.showNum < this.datasource.length;
    }

    @computed get canClearAll(): boolean {
        return this.datasource.length > 0;
    }

    @computed get datasource(): IMessage[] {
        const source =
            this.showMessageKey === 'messages'
                ? this.messages
                : this.notifications;
        return take(source, this.showNum);
    }
    @computed get marginMenu() {
        return this.collapsed ? 'margin-collapsed-menu' : 'margin-menu';
    }

    @action loadMore() {
        this.showNum += BASIC_NUM;
    }

    @action clearAll() {
        this.connection && this.connection.send('@clear-all');
    }

    @action onMessageKeyChange(key: string) {
        this.showMessageKey = key;
    }

    @action onCollapse(collapsed: boolean) {
        this.collapsed = collapsed;
    }

    @action setMessages(messages: IMessage[]) {
        this.messages = messages;
    }

    @action setNotifications(notifications: IMessage[]) {
        this.notifications = notifications;
    }

    disconnect() {
        this.connection && this.connection.close();
        this.connection = undefined;
    }

    initConnection() {
        const token = Storage.getItem<string>('token');
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        this.connection = new WebSocket(
            `${protocol}${WS_SERVER}?token=${token}`,
        );
        this.connection.onopen = () => {
            console.log('Connected');
            //get initial messages
            //@ts-ignore
            this.connection.send('@init');
        };
        this.connection.onclose = () => {
            console.log('Disconnected');
        };
        this.connection.onmessage = event => {
            console.log(event);
            const [messages, notifications] = partition(
                JSON.parse(event.data),
                message => message.type === 'message',
            );
            this.setMessages(messages);
            this.setNotifications(notifications);
        };
    }

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }
}
