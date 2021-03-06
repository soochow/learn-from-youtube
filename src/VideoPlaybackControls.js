import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, FormField, Textfield } from 'react-mdc-web';
import { Menu, MenuItem } from 'react-mdl-extra';

import './button.css';
import './VideoPlaybackControls.css';

const playbackRateOptions = [
    {value: 0.25, label: '.25x'},
    {value: 0.5, label: '.5x'},
    {value: 0.75, label: '.75x'},
    {value: 1.0, label: '1x'},
    {value: 2.0, label: '2.x'}
];

const videoTimestampRegex = /^$|[0-9]+:[0-9]{2}/;

class VideoPlaybackControls extends Component {
    constructor(props) {
        super(props);

        this.handleStartInputChange = this.handleStartInputChange.bind(this);
        this.handleEndInputChange = this.handleEndInputChange.bind(this);

        this.handleLoopChange = this.handleLoopChange.bind(this);

        this.handlePlay = this.handlePlay.bind(this);
    }

    handleStartInputChange(e) {
        this.props.onStartInputChange(e.target.value);
    }

    handleEndInputChange(e) {
        this.props.onEndInputChange(e.target.value);
    }

    handleLoopChange(e) {
        this.props.onLoopInputChange(e.target.checked);
    }

    handlePlay(e) {
        e.preventDefault();

        if (!videoTimestampRegex.test(this.props.start)) {
            alert('Please enter a valid start time in format m:ss');
            return;
        }
        else if (!videoTimestampRegex.test(this.props.end)) {
            alert('Please enter a valid end time in format m:ss');
            return;
        }

        this.props.onPlay();
    }

    static currentPlaybackRate(rateValue) {
        var i;
        for (i = 0; i < playbackRateOptions.length; i++) {
            let rateOption = playbackRateOptions[i];
            if (VideoPlaybackControls.nearlyEqual(rateValue, rateOption.value, 0.001)) {
                return rateOption;
            }
        }
        return playbackRateOptions[1];
    }

    static nearlyEqual(a, b, epsilon) {
        let absA = Math.abs(a);
        let absB = Math.abs(b);
        let diff = Math.abs(a - b);

        if (a === b) { // shortcut, handles infinities
            return true;
        }
        else if (a === 0 || b === 0 || diff < Math.MIN_VALUE) {
            // a or b is zero or both are extremely close to it
            // relative error is less meaningful here
            return diff < (epsilon * Math.MIN_VALUE);
        }
        else { // use relative error
            return diff / Math.min((absA + absB), Math.MAX_VALUE) < epsilon;
        }
    }

    render() {
        return (
            <div className="VideoPlaybackControls">
                <Textfield
                    floatingLabel="Start time (m:ss)"
                    value={this.props.start}
                    onChange={this.handleStartInputChange}
                />&nbsp;&nbsp;&nbsp;

                <Textfield
                    floatingLabel="End time (m:ss)"
                    value={this.props.end}
                    onChange={this.handleEndInputChange}
                />&nbsp;&nbsp;&nbsp;

                <FormField id="loop-checkbox">
                    <Checkbox
                        onChange={this.handleLoopChange}
                        checked={this.props.loop}
                    />
                    <label>Loop&nbsp;&nbsp;&nbsp;</label>
                </FormField>

                <Menu
                    target={<Button raised>Speed {VideoPlaybackControls.currentPlaybackRate(this.props.rate).label}</Button>}
                    align="tl bl"
                >
                    <MenuItem onClick={() => this.props.onRateInputChange(0.25)}>.25x</MenuItem>
                    <MenuItem onClick={() => this.props.onRateInputChange(0.5)}>.5x</MenuItem>
                    <MenuItem onClick={() => this.props.onRateInputChange(0.75)}>.75x</MenuItem>
                    <MenuItem onClick={() => this.props.onRateInputChange(1.0)}>1.0x</MenuItem>
                    <MenuItem onClick={() => this.props.onRateInputChange(2.0)}>2.0x</MenuItem>
                </Menu>&nbsp;&nbsp;&nbsp;

                <Button
                    raised
                    onClick={this.handlePlay}
                >
                    Play
                </Button>
            </div>
        );
    }
}

VideoPlaybackControls.propTypes = {
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    loop: PropTypes.bool.isRequired,
    rate: PropTypes.number.isRequired,

    onStartInputChange: PropTypes.func.isRequired,
    onEndInputChange: PropTypes.func.isRequired,
    onLoopInputChange: PropTypes.func.isRequired,
    onRateInputChange: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired
};

export default VideoPlaybackControls;
