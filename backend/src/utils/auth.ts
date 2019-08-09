import { Storage } from '@utils/storage';
import { IUserInfoAndPrivileges } from '@interfaces';
import { getStore } from '@stores';

export const refreshStorageInfo = ([
    userInfo,
    privileges,
]: IUserInfoAndPrivileges) => {
    Storage.saveItem('user', {
        privileges: privileges,
        userInfo: userInfo,
    });
    refreshUserInfo();
};

export const refreshUserInfo = () => {
    const user = getStore().user;
    user.initFromStorage();
};
