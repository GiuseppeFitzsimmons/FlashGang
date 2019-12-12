import { FlashButton } from '../widgets/FlashBits'
import Icon from '@material-ui/core/Icon';
import React from 'react';
import { withTheme } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
const loadImage = require('blueimp-load-image');


class GalleryStyled extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false }
        this.handleCancel = this.handleCancel.bind(this)
    }
    handleEntering() {
    }
    handleCancel() {
        this.setState({ open: false })
    }
    setImage() {
        this.setState({
            open: false,
        })
    }
    handleFileChange(e) {
        let file = e.target.files;
        if (file) {
            var loadingImage = loadImage(
                file[0],
                function (img, data) {
                    let context = img.getContext('2d')
                    let imageData = context.getImageData(0, 0, img.width, img.height).data
                    let blob = new Blob(imageData)
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = function () { var base64data = reader.result; console.log('base64data', base64data);
                    }
                },
                {
                    maxWidth: 3,
                    canvas: true

                }
            );
            if (!loadingImage) {
            }
        }
        document.getElementById("file-upload").reset();
    }
    render() {
        return (
            <>
                <form id="file-upload" autocomplete="off" style={{ display: 'none' }}>
                    <input id="input-file-upload" type="file" onChange={this.handleFileChange} accept="image/png, image/jpeg" />
                </form>
                <FlashButton square buttonType='system'
                    onClick={
                        () => this.setState({ open: true })
                    }>
                    Add image
                </FlashButton>
                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    maxWidth="xs"
                    onEntering={this.handleEntering}
                    aria-labelledby="confirmation-dialog-title"
                    open={this.state.open}
                >
                    <DialogTitle id="confirmation-dialog-title">Upload image</DialogTitle>
                    <FlashButton square buttonType='system'
                        onClick={() => document.getElementById("input-file-upload").click()}
                    >
                        Upload
                </FlashButton>
                    <DialogContent dividers>
                        <GridList cellHeight={60} cols={4}>
                            {/*all_icons.map(icon => (
                                <GridListTile key={icon} cols={1}>
                                    <FlashButton square buttonType={icon == this.props.icon ? 'system' : 'action'}
                                        onClick={
                                            () => this.setImage(icon)
                                        }>
                                        <Icon style={{ fontSize: 20 }}>{icon}</Icon>
                                    </FlashButton>
                                </GridListTile>
                                    ))*/}
                        </GridList>
                    </DialogContent>

                    <DialogActions>
                        <FlashButton onClick={this.handleCancel} color="primary">
                            Cancel
                        </FlashButton>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}

const Gallery = withTheme(GalleryStyled);
export {
    Gallery
}