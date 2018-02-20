import React from 'react';
import Dialog from 'material-ui/Dialog';

const AttentionDialog = ({ title, text }) => (
  <Dialog title={title} modal open>{text}</Dialog>
);

AttentionDialog.propTypes = {
  title: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired,
};

export default AttentionDialog;
