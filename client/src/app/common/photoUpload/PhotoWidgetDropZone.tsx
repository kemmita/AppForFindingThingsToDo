import React, {useCallback} from 'react';
import {observer} from "mobx-react-lite";
import {useDropzone} from "react-dropzone";
import {Header, Icon} from "semantic-ui-react";

interface IProps {
    setFiles: (files: any[]) => void;
}

const dropZoneStyles = {
  border: 'dashed 3px',
  borderColor: '#eee',
  borderRadius: '5px',
  paddingTop: '30px',
  textAlign: 'center' as 'center',
  height: '200px'
};

const dropZoneActive = {
    borderColor: 'green'
};

const PhotoWidgetDropZone: React.FC<IProps> = (props) => {
    const onDrop = useCallback(acceptedFiles => {
        props.setFiles(acceptedFiles.map((file: object) => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })))
    }, [props]);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    return (
        <div {...getRootProps()} style={isDragActive ? {...dropZoneStyles, ...dropZoneActive} : dropZoneStyles}>
            <input {...getInputProps()} />
            <Icon name={'upload'} size={'huge'} />
            <Header content={'Drop image here'} />
        </div>
    )
};

export default observer(PhotoWidgetDropZone);
