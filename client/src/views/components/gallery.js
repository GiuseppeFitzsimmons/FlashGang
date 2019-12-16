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
import CircularProgress from '@material-ui/core/CircularProgress';

const loadImage = require('blueimp-load-image');

//const allImages = [];
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
    componentDidUpdate(prevProps) {
        /*if (this.props.images) {
            this.props.images.forEach(image => {
                allImages.push(image)
            })
        }*/
    }
    componentDidMount() {
        this.props.getImages()
    }
    handleFileChange(e) {
        let file = e.target.files;
        if (file) {
            var loadingImage = loadImage(
                file[0],
                function (img, data) {
                    try {
                        let binaryData = img.toDataURL();
                        holder.gallery.props.images.splice(0,0,binaryData)
                        holder.gallery.forceUpdate()
                        //binaryData is all we need to send back to the server
                        console.log("dataUrl", binaryData);
                    } catch (err) {
                        //TODO something's gone wrong with this file
                        alert("Unsupported format")
                    }
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
        const images = this.props.images ? this.props.images : []
        //console.log('allImages', allImages)
        return (
            <>
                <form id="file-upload" autocomplete="off" style={{ display: 'none' }}>
                    <input id="input-file-upload" type="file" onChange={this.handleFileChange} accept="image/png, image/jpeg" />
                </form>
                <FlashButton
                    buttonType='system'
                    startIcon={<Icon style={{ fontSize: 20, color: 'green' }}>add_photo_alternate</Icon>}
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
                    fullWidth={true}
                    maxWidth='xl'
                >
                    <DialogTitle id="confirmation-dialog-title">Gallery</DialogTitle>
                    <FlashButton square buttonType='system'
                        disabled={!this.props.images}
                        onClick={() => document.getElementById("input-file-upload").click()}
                    >
                        Upload
                </FlashButton>
                    <DialogContent>
                        <GridList cellHeight={160} cols={4} spacing={-32}>
                            {images.map((image, index) => (
                                <GridListTile key={index} id={index} cols={1} imgFullWidth={true}>
                                    <ImageUploadComponentRedux
                                        onImageSelected={this.props.onImageSelected}
                                        source={image}
                                        id={index}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </DialogContent>

                    <DialogActions>
                        <FlashButton onClick={this.handleCancel} color="primary">
                            Close
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
            <>
                {
                    this.props.loading &&
                    <div className='sweet-loading' style={{
                        display: 'inline-block',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        top: '0', right: '0', left: '0', bottom: '0',
                        position: 'absolute',
                        backgroundColor: 'rgb(255,255,255,.5)',
                        paddingTop: '32px'
                    }} >
                        <CircularProgress />
                    </div>
                }
                {
                    this.props.errors && false &&
                    <div style={{
                        display: 'inline-block',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        top: '0', right: '0', left: '0', bottom: '0',
                        position: 'absolute',
                        backgroundColor: 'rgb(255,255,255,.5)',
                        paddingTop: '32px'
                    }} >
                        <Icon style={{ fontSize: 30, color: 'rgb(255,100,100,.75)' }}>error</Icon>
                    </div>
                }
                <div
                    style={{
                        background: `url(${this.props.source})`,
                        backgroundSize: 'cover',
                        width: '100%',
                        height: '100%',
                        backgroundPosition: 'center center'
                    }}
                    onClick={() => {
                        let isBinary = this.props.source.indexOf('data:image') == 0
                        if (!isBinary) {
                            this.props.onImageSelected(this.props.source)
                        }
                    }
                    }
                >

                </div>
            </>
        )
    }
}
function mapStateToProps(state, props) {
    if (state.id == props.id) {
        return { loading: state.loading, source: state.url, errors: state.errors }
    }
    return {};
}
function mapStateToPropsGallery(state, props) {
    return { images: state.images };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}
const ImageUploadComponentRedux = connect(mapStateToProps, mapDispatchToProps)(ImageUploadComponent)

const GalleryStyle = withTheme(GalleryStyled);
const Gallery = connect(mapStateToPropsGallery, mapDispatchToProps)(GalleryStyle)
export {
    Gallery
}