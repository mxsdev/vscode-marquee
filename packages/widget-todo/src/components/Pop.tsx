import React, { useState, useContext, useCallback } from "react";
import Popover from "@material-ui/core/Popover";
import {
  IconButton,
  Grid,
  Divider,
  Checkbox,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Tooltip from "@material-ui/core/Tooltip";
import { HideWidgetContent } from "@vscode-marquee/widget";

import TodoContext from "../Context";

let HideBox = React.memo(() => {
  const { _updateHide, hide } = useContext(TodoContext);

  return (
    <Grid
      container
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item>Hide completed</Grid>
      <Grid item>
        <Checkbox
          aria-label="Hide completed"
          color="primary"
          checked={hide}
          value={hide}
          name="hide"
          onChange={(e) => {
            _updateHide(e.target.checked);
          }}
        />
      </Grid>
    </Grid>
  );
});

let ArchivedBox = React.memo(() => {
  const { _updateShowArchived, showArchived } = useContext(TodoContext);

  return (
    <Grid
      container
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item>Show archived</Grid>
      <Grid item>
        <Checkbox
          aria-label="Show archived"
          color="primary"
          checked={showArchived}
          value={showArchived}
          name="hide"
          onChange={(e) => {
            _updateShowArchived(e.target.checked);
          }}
        />
      </Grid>
    </Grid>
  );
});

let AutoDetectBox = React.memo(() => {
  const { _updateAutoDetect, autoDetect } = useContext(TodoContext);
  return (
    <Grid
      container
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item>
        <Tooltip
          title="Detect TODO comments in your code, and make them one-click addable to Marquee."
          placement="top"
          arrow
        >
          <>Auto-detect TODOs</>
        </Tooltip>
      </Grid>
      <Grid item>
        <Checkbox
          aria-label="Auto-detect TODOs"
          color="primary"
          checked={autoDetect}
          value={autoDetect}
          name="autodetect"
          onChange={(e) => {
            _updateAutoDetect(e.target.checked);
          }}
        />
      </Grid>
    </Grid>
  );
});

let TodoPop = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "todo-popover" : undefined;

  return (
    <div>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Grid container style={{ padding: "16px" }} direction="column">
          <Grid item>
            <AutoDetectBox />
          </Grid>
          <Grid item>
            <HideBox />
          </Grid>
          <Grid item>
            <ArchivedBox />
          </Grid>
          <Grid item>&nbsp;</Grid>
          <Grid item>
            <Divider />
          </Grid>
          <Grid item>&nbsp;</Grid>
          <Grid item>
            <HideWidgetContent name="todo" />
          </Grid>
        </Grid>
      </Popover>
    </div>
  );
};

export default React.memo(TodoPop);