import React, { useContext, useState, useCallback } from "react";

import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import Popover from "@material-ui/core/Popover";
import { IconButton, Grid, TextField, Badge } from "@material-ui/core";
import { DebounceInput } from "react-debounce-input";

import TodoContext from "../Context";

let TodoFilterBox = () => {
  const { _updateFilter, todoFilter } = useContext(TodoContext);
  let filterInput: HTMLInputElement | null = null;

  return (
    <DebounceInput
      autoFocus
      inputProps={{ ref: (input: HTMLInputElement) => (filterInput = input) }}
      element={TextField}
      minLength={2}
      debounceTimeout={500}
      InputLabelProps={{
        shrink: true,
      }}
      label={"Filter"}
      variant="filled"
      placeholder="Type here..."
      onChange={(e) => {
        _updateFilter(e.target.value);
      }}
      // margin="none"
      size="small"
      name="github-filter"
      value={todoFilter}
      InputProps={{
        endAdornment: (
          <ClearIcon
            fontSize="small"
            style={{ cursor: "pointer" }}
            onClick={() => {
              _updateFilter("");
              filterInput!.focus();
            }}
          />
        ),
      }}
    />
  );
};

let TodoFilter = () => {
  const { todoFilter } = useContext(TodoContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "todo-filter-popover" : undefined;

  return (
    <div>
      <IconButton size="small" onClick={handleClick}>
        <Badge
          color="secondary"
          variant="dot"
          overlap="circular"
          badgeContent={todoFilter.length}
        >
          <SearchIcon fontSize="small" />
        </Badge>
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
        <Grid container>
          <Grid item>
            <TodoFilterBox />
          </Grid>
        </Grid>
      </Popover>
    </div>
  );
};

export default React.memo(TodoFilter);