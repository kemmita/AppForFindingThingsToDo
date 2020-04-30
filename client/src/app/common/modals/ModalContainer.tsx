import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Modal} from "semantic-ui-react";
import {RootStoreContext} from "../../stores/rootStore";

const ModalContainer: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {modalStore} = rootStore;

    return (
        <Modal open={modalStore.modal.open} onClose={modalStore.closeModal} size='mini'>
            <Modal.Content>
                {modalStore.modal.body}
            </Modal.Content>
        </Modal>
    );
};

export default observer(ModalContainer);
