import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Header, Tab, Card, Image, Button, Grid} from "semantic-ui-react";
import {RootStoreContext} from "../../../app/stores/rootStore";
import PhotoUploadWidget from '../../../app/common/photoUpload/PhotoUploadWidget';

interface IProps {}

const PhotosPane: React.FC<IProps> = (props) => {
    const rootStore = useContext(RootStoreContext);
    const {userStore} = rootStore;
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState<string>('');

    const handleUploadImage = (photo: Blob)=>{
        userStore.uploadPhoto(photo).then(() => setAddPhotoMode(false));
    };

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{paddingBottom: 0}}>
                    <Header floated={'left'} icon={'image'}  content={'Photos'}/>
                    {userStore.isCurrentUser &&
                    <Button floated={'right'} basic content={addPhotoMode ? 'Cancel' : 'Add Photo'} onClick={() => setAddPhotoMode(!addPhotoMode)} /> }
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handleUploadImage} loading={userStore.uploadingPhoto}/>
                    ): (
                        <Card.Group itemsPerRow={5}>
                            {userStore.profile && userStore.profile.photos.map(p =>
                                <Card key={p.id}>
                                    <Image src={p.url}/>
                                    {userStore.isCurrentUser &&
                                        <Button.Group fluid >
                                            {p.url !== userStore.user!.image && <Button name={p.id} basic positive content={'Set main'} onClick={() => userStore.setMainPhoto(p)}/>}
                                            <Button
                                                name={p.id}
                                                disabled={p.url === userStore.user!.image}
                                                basic
                                                negative
                                                icon={'trash'}
                                                onClick={(e) => {
                                                    userStore.deletePhoto(p);
                                                    setTarget(e.currentTarget.name)}
                                                }
                                                loading={userStore.deletingPhoto && target === p.id}
                                            />
                                        </Button.Group>
                                    }
                                </Card>
                            )}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
};

export default observer(PhotosPane);
