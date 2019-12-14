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
import { ActionYoutubeSearchedFor } from 'material-ui/svg-icons';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'

const loadImage = require('blueimp-load-image');

const allImages = ['/random_profile_male_1.png', '/random_profile_male_1.png',
    '/random_profile_male_1.png', '/random_profile_male_1.png',
    '/random_profile_male_1.png', '/random_profile_male_1.png',
    '/random_profile_male_1.png'];

const holder = {}

class GalleryStyled extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false }
        this.handleCancel = this.handleCancel.bind(this)
        holder.gallery = this
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
                    let binaryData = img.toDataURL();
                    allImages.push(binaryData)
                    holder.gallery.forceUpdate()
                    //binaryData is all we need to send back to the server
                    console.log("dataUrl", binaryData);
                    /*let context = img.getContext('2d')
                    let imageData = context.getImageData(0, 0, img.width, img.height).data
                    let blob = new Blob(imageData)
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = function () { var base64data = reader.result; console.log('base64data', base64data);
                    }*/
                },
                {
                    maxWidth: 320,
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
                    onEntering={this.handleEntering}
                    contentStyle={{ width: "100%", maxWidth: "none" }}
                    aria-labelledby="confirmation-dialog-title"
                    open={this.state.open}
                >
                    <DialogTitle id="confirmation-dialog-title">Gallery</DialogTitle>
                    <FlashButton square buttonType='system'
                        onClick={() => document.getElementById("input-file-upload").click()}
                    >
                        Upload
                </FlashButton>
                    <DialogContent dividers>
                        <GridList cellHeight={60} cols={4}>
                            {allImages.map( (image, index) => (
                                <GridListTile key={image} id={index} cols={1}>
                                    <ImageUploadComponentRedux
                                        source={image}
                                        id={index}
                                    />
                                </GridListTile>
                            ))}
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

class ImageUploadComponent extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        let isBinary = this.props.source.indexOf('data:image') == 0
        if (isBinary) {
            this.props.uploadImage(this.props.source, this.props.id)
        }
    }
    render() {
        return (
            <img
                src={this.props.url ? this.props.url : this.props.source }
            />
        )
    }

}
function mapStateToProps(state, props) {
    if (state.id==props.id) {
        return { loading: state.loading, url: state.url }
    }
    return {};
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}
const ImageUploadComponentRedux = connect(mapStateToProps, mapDispatchToProps)(ImageUploadComponent)

const Gallery = withTheme(GalleryStyled);
export {
    Gallery
}