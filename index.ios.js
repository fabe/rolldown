'use strict';

import React, { Component } from 'react';
import RNFS from 'react-native-fs';

import {
  AppRegistry,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Clipboard,
  Alert,
  ProgressViewIOS,
  KeyboardAvoidingView
} from 'react-native';

import styles from './styles/styles';
import lang from './js/language';

import twitterApi from './js/twitterApi';
import uvdh from './js/uvdh';
import fs from './js/fs';
import { twitter, blacklist, parseURL } from './js/hosts';
import { b64, getExtension } from './js/util';

export default class rolldown extends Component {
  constructor() {
    super();
    this.state = {
      status: {},
      url: '',
      loading: false,
      progress: 0,
    };

    this.timer = {};

    this.onTextChange = this.onTextChange.bind(this);
    this.onDownload = this.onDownload.bind(this);
    this.onPasteDownload = this.onPasteDownload.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.checkForTimeout = this.checkForTimeout.bind(this);
  }

  updateProgress(status) {
    // Calculate decimal status of download, set as state.

    const { bytesWritten, contentLength } = status;
    this.setState({ progress: bytesWritten / contentLength });
  }

  onDownload() {
    const url = parseURL(this.state.url);
    const extension = getExtension(url.href);
    let path = `${RNFS.CachesDirectoryPath}/video.mp4`;

    // Start loading indicator.
    this.startLoading();

    // Check after 30 seconds if anything happened.
    this.timer = setTimeout(this.checkForTimeout, 30000);

    if (blacklist.indexOf(url.hostname) != -1 || this.state.url == '') {
      // Check for blacklisted or empty host.

      this.stopLoading(true);
      Alert.alert(lang.SORRY, lang.INVALID_URL, { text: lang.OK });
    } else if (twitter.indexOf(url.hostname) != -1) {
      // Check if it's a twitter URL.

      const id = url.pathname.split('status/')[1].split('/')[0];
      twitterApi
        .getTwitterToken()
        .then(token => twitterApi.getTwitterVideo(id, token))
        .then(mp4 => this.downloadFromMp4(mp4, path))
        .catch(err => {
          this.stopLoading(true);
          Alert.alert(lang.SORRY, lang.INVALID_TWITTER, { text: lang.OK });
        });
    } else if (extension == 'mp4' || extension == 'mov') {
      // Check if it's a direct URL to a video file.

      path = `${RNFS.CachesDirectoryPath}/video.${extension}`;
      this.downloadFromMp4(url.href, path);
    } else {
      // Otherwise give the UVDH API a shot.

      uvdh.fetchVideo(url.href).then(res => {
        if (res.error) {
          this.stopLoading(true);
          Alert.alert(lang.SORRY, lang.INVALID_URL, { text: lang.OK });
        } else {
          this.downloadFromMp4(res.url, path);
        }
      });
    }
  }

  checkForTimeout() {
    if (this.state.progress == 0) {
      this.stopLoading(true);
      Alert.alert(lang.TIMEOUT, lang.TIMEOUT_MESSAGE, { text: lang.OK });
    }
  }

  downloadFromMp4(mp4, path) {
    fs
      .downloadVideoToCache(mp4, path, this.updateProgress)
      .then(() => fs.saveVideo(path))
      .then(() => fs.deleteVideoFromCache(path))
      .then(() => {
        this.stopLoading();
        Alert.alert(lang.SUCCESS, lang.SUCCESS_MESSAGE, { text: lang.OK });
      });
  }

  async onPasteDownload() {
    // Get clipboard contents, set as state and start download after.

    const clip = await Clipboard.getString();
    if (clip) this.setState({ url: clip }, this.onDownload);
  }

  onTextChange(url) {
    // Change url state on change.

    this.setState({ url });
  }

  startLoading() {
    // Set loading indicator.

    this.setState({ loading: true });
  }

  stopLoading(error) {
    // Reset loading indicator, clear timer.

    let url = this.state.url;
    if (!error) url = '';

    clearTimeout(this.timer);
    this.setState({ loading: false, progress: 0, url });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <KeyboardAvoidingView
          keyboardVerticalOffset={20}
          behavior="padding"
          style={styles.form}
        >
          <View>
            <Text style={styles.label}>{lang.VIDEO_URL}</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={this.onTextChange}
            onSubmitEditing={this.onDownload}
            value={this.state.url}
            keyboardType="url"
          />
          <ProgressViewIOS
            progress={this.state.progress}
            progressTintColor="#fff"
            style={{ alignSelf: 'stretch' }}
            trackTintColor="#666"
          />

          <View
            style={[
              styles.buttonGroup,
              this.state.loading ? styles.disabled : null,
            ]}
          >
            <TouchableOpacity
              onPress={this.onPasteDownload}
              style={[styles.button, styles.buttonSecondary]}
              disabled={this.state.loading}
            >
              <Text style={[styles.buttonText, styles.buttonSecondaryText]}>
                {lang.PASTE_DOWNLOAD}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.onDownload}
              style={styles.button}
              disabled={this.state.loading}
            >
              <Text style={styles.buttonText}>{lang.DOWNLOAD}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

AppRegistry.registerComponent('rolldown', () => rolldown);
