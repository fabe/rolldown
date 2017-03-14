'use strict';

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Menlo',
    letterSpacing: 1,
  },
  input: {
    height: 55,
    alignSelf: 'stretch',
    fontSize: 20,
    textAlign: 'right',
    borderRadius: 0,
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: 'Menlo',
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#fff',
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 420,
    borderColor: '#fff',
    borderWidth: 2,
  },
  buttonSecondary: {
    backgroundColor: '#000',
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Menlo',
  },
  buttonSecondaryText: {
    color: '#fff',
  },
  disabled: {
    opacity: 0.3,
  },
  progress: {
    borderRadius: 0,
  },
});

module.exports = styles;
